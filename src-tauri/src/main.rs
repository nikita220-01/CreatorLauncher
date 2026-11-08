#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use serde::Deserialize;
use tauri::command;

// Структуры для парсинга JSON Minecraft
#[derive(Deserialize, Debug)]
struct MinecraftVersion {
    #[serde(rename = "mainClass")]
    main_class: String,
    libraries: Vec<Library>,
    arguments: Arguments,
    assets: String,
}

#[derive(Deserialize, Debug)]
struct Library {
    name: String,
    #[serde(default)]
    downloads: Option<Downloads>,
}

#[derive(Deserialize, Debug)]
struct Downloads {
    artifact: Option<Artifact>,
}

#[derive(Deserialize, Debug)]
struct Artifact {
    path: String,
}

#[derive(Deserialize, Debug)]
struct Arguments {
    jvm: Vec<serde_json::Value>,
    game: Vec<serde_json::Value>,
}

#[command]
fn launch_minecraft(nickname: String, version: String) -> Result<String, String> {
    let mc_dir = PathBuf::from(r"C:\Users\DIGITAL-PC\AppData\Roaming\.minecraft");
    let version_dir = mc_dir.join("versions").join(&version);
    let json_path = version_dir.join(format!("{}.json", version));

    // Проверяем, что JSON существует
    if !json_path.exists() {
        return Err(format!("❌ JSON-манифест не найден: {}", json_path.display()));
    }

    // Читаем JSON
    let json_content = fs::read_to_string(&json_path)
        .map_err(|e| format!("❌ Ошибка чтения JSON: {}", e))?;

    // Парсим JSON
    let version_data: MinecraftVersion = serde_json::from_str(&json_content)
        .map_err(|e| format!("❌ Ошибка парсинга JSON: {}", e))?;

    // Выводим информацию
    let mut result = format!("✅ JSON прочитан успешно!\n\n");
    result += &format!("📦 Версия: {}\n", version);
    result += &format!("🎯 Главный класс: {}\n", version_data.main_class);
    result += &format!("📚 Библиотек: {}\n", version_data.libraries.len());
    result += &format!("🎨 Ассеты: {}\n", version_data.assets);
    result += &format!("👤 Игрок: {}\n\n", nickname);

    // Показываем первые 5 библиотек
    result += "📋 Первые 5 библиотек:\n";
    for (i, lib) in version_data.libraries.iter().take(5).enumerate() {
        result += &format!("   {}. {}\n", i + 1, lib.name);
    }

    Ok(result)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![launch_minecraft])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}