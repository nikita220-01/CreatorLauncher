#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::command;

// Команда для запуска Minecraft
#[command]
fn launch_minecraft(nickname: String, version: String) -> Result<String, String> {
    // Здесь будет реальный запуск Java с Minecraft
    // Пока что просто возвращаем сообщение для теста
    
    // Пример реального запуска (раскомментируй, когда будешь готов):
    /*
    let output = Command::new("java")
        .arg("-Xmx2G")
        .arg("-jar")
        .arg("minecraft.jar")
        .arg("--username")
        .arg(&nickname)
        .arg("--version")
        .arg(&version)
        .output()
        .expect("Failed to execute Minecraft");
    
    if output.status.success() {
        Ok(format!("Minecraft launched successfully for {}", nickname))
    } else {
        Err("Failed to launch Minecraft".to_string())
    }
    */
    
    Ok(format!("🎮 Запуск Minecraft для {} (версия: {})", nickname, version))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![launch_minecraft])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}