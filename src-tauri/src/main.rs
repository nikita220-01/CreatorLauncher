#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use std::process::Command;
use serde::{Deserialize, Serialize};
use serde::de::DeserializeOwned;
use tauri::command;

// === Структуры для Mojang API ===
#[derive(Deserialize, Debug)]
struct VersionManifest {
    versions: Vec<VersionEntry>,
}

#[derive(Deserialize, Debug)]
struct VersionEntry {
    id: String,
    url: String,
    #[serde(rename = "type")]
    version_type: String,
}

// === Структуры для Minecraft JSON ===
// ДОБАВЛЕНО: Serialize ко всем структурам, чтобы мы могли сохранить JSON в файл
#[derive(Deserialize, Serialize, Debug)]
struct MinecraftVersion {
    #[serde(rename = "mainClass")]
    main_class: String,
    libraries: Vec<Library>,
    assets: String,
    downloads: Downloads,
    arguments: Option<Arguments>,
}

#[derive(Deserialize, Serialize, Debug)]
struct Downloads {
    client: DownloadFile,
}

#[derive(Deserialize, Serialize, Debug)]
struct DownloadFile {
    url: String,
    sha1: String,
    size: u64,
}

#[derive(Deserialize, Serialize, Debug)]
struct Library {
    name: String,
    #[serde(default)]
    downloads: Option<LibraryDownloads>,
    #[serde(default)]
    rules: Option<Vec<Rule>>,
    #[serde(default)]
    natives: Option<std::collections::HashMap<String, String>>,
}

#[derive(Deserialize, Serialize, Debug)]
struct LibraryDownloads {
    artifact: Option<Artifact>,
    classifiers: Option<std::collections::HashMap<String, Artifact>>,
}

#[derive(Deserialize, Serialize, Debug)]
struct Artifact {
    path: String,
    url: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Rule {
    action: String,
    os: Option<OsRule>,
}

#[derive(Deserialize, Serialize, Debug)]
struct OsRule {
    name: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Arguments {
    game: Vec<serde_json::Value>,
    jvm: Vec<serde_json::Value>,
}

// === Команда запуска ===
#[command]
fn launch_minecraft(nickname: String, version: String) -> Result<String, String> {
    let project_dir = PathBuf::from(r"D:\.cline\CreatorLauncher\CreatorLauncher\minecraft_data");
    let versions_dir = project_dir.join("versions");
    let libraries_dir = project_dir.join("libraries");
    let assets_dir = project_dir.join("assets");
    let natives_dir = project_dir.join("natives");

    fs::create_dir_all(&versions_dir).map_err(|e| format!("Mkdir versions: {}", e))?;
    fs::create_dir_all(&libraries_dir).map_err(|e| format!("Mkdir libraries: {}", e))?;
    fs::create_dir_all(&assets_dir).map_err(|e| format!("Mkdir assets: {}", e))?;
    fs::create_dir_all(&natives_dir).map_err(|e| format!("Mkdir natives: {}", e))?;

    let version_dir = versions_dir.join(&version);
    let json_path = version_dir.join(format!("{}.json", version));
    let jar_path = version_dir.join(format!("{}.jar", version));

    // Если версия не скачана — скачиваем
    if !json_path.exists() || !jar_path.exists() {
        download_vanilla(&version, &versions_dir, &libraries_dir)?;
    }

    // Читаем JSON
    let json_content = fs::read_to_string(&json_path).map_err(|e| format!("Read JSON: {}", e))?;
    let version_data: MinecraftVersion = serde_json::from_str(&json_content)
        .map_err(|e| format!("Parse JSON: {}", e))?;

    // Собираем classpath
    let mut classpath = Vec::new();
    for lib in &version_data.libraries {
        if !should_include_lib(lib) {
            continue;
        }

        if let Some(dl) = &lib.downloads {
            if let Some(a) = &dl.artifact {
                let lib_path = libraries_dir.join(&a.path);
                if lib_path.exists() {
                    classpath.push(lib_path.to_str().unwrap().to_string());
                }
            }
        }
    }

    classpath.push(jar_path.to_str().unwrap().to_string());

    let java = r"C:\Program Files\JetBrains\PyCharm Community Edition 2025.1.3\jbr\bin\java.exe";
    let lib_path_arg = format!("-Djava.library.path={}", natives_dir.to_str().unwrap());

    let output = Command::new(java)
        .arg("-Xmx2G")
        .arg(&lib_path_arg)
        .arg("-cp").arg(classpath.join(";"))
        .arg(&version_data.main_class)
        .arg("--username").arg(&nickname)
        .arg("--version").arg(&version)
        .arg("--gameDir").arg(project_dir.to_str().unwrap())
        .arg("--assetsDir").arg(assets_dir.to_str().unwrap())
        .arg("--assetIndex").arg(&version_data.assets)
        .arg("--uuid").arg("00000000-0000-0000-0000-000000000000")
        .arg("--accessToken").arg("0")
        .arg("--userType").arg("mojang")
        .arg("--versionType").arg("release")
        .output()
        .map_err(|e| format!("Java launch: {}", e))?;

    if output.status.success() {
        Ok(format!("✅ Minecraft запущен!\nКласс: {}\nБиблиотек: {}", version_data.main_class, classpath.len()))
    } else {
        Err(format!("❌ Ошибка запуска:\n{}", String::from_utf8_lossy(&output.stderr)))
    }
}

// === Скачивание Vanilla версии ===
fn download_vanilla(version: &str, versions_dir: &PathBuf, libraries_dir: &PathBuf) -> Result<String, String> {
    // 1. Получаем список версий
    let manifest_url = "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json";
    let manifest: VersionManifest = download_json(manifest_url)?;

    // 2. Находим нужную версию
    let version_entry = manifest.versions.iter()
        .find(|v| v.id == version && v.version_type == "release")
        .ok_or_else(|| format!("Версия {} не найдена", version))?;

    // 3. Скачиваем JSON манифест версии
    let version_json: MinecraftVersion = download_json(&version_entry.url)?;

    // 4. Создаём папку версии
    let version_dir = versions_dir.join(version);
    fs::create_dir_all(&version_dir).map_err(|e| format!("Mkdir version: {}", e))?;

    // 5. Сохраняем JSON (теперь это сработает, так как все структуры имеют Serialize)
    let json_path = version_dir.join(format!("{}.json", version));
    let json_str = serde_json::to_string_pretty(&version_json).map_err(|e| format!("JSON serialize: {}", e))?;
    fs::write(&json_path, json_str).map_err(|e| format!("Write JSON: {}", e))?;

    // 6. Скачиваем client.jar
    let jar_path = version_dir.join(format!("{}.jar", version));
    download_file(&version_json.downloads.client.url, &jar_path)?;

    // 7. Скачиваем библиотеки
    for lib in &version_json.libraries {
        if !should_include_lib(lib) {
            continue;
        }

        if let Some(dl) = &lib.downloads {
            if let Some(a) = &dl.artifact {
                let lib_path = libraries_dir.join(&a.path);
                if !lib_path.exists() {
                    if let Some(parent) = lib_path.parent() {
                        fs::create_dir_all(parent).ok();
                    }
                    download_file(&a.url, &lib_path)?;
                }
            }
        }
    }

    Ok(format!("✅ Версия {} успешно скачана!", version))
}

// === Вспомогательные функции ===
fn should_include_lib(lib: &Library) -> bool {
    if let Some(rules) = &lib.rules {
        let mut include = false;
        for rule in rules {
            if rule.action == "allow" {
                if let Some(os) = &rule.os {
                    if os.name == "windows" { include = true; }
                } else { include = true; }
            } else if rule.action == "disallow" {
                if let Some(os) = &rule.os {
                    if os.name == "windows" { include = false; }
                } else { include = false; }
            }
        }
        include
    } else {
        true
    }
}

// ИСПРАВЛЕНО: DeserializeOwned решает проблему времени жизни (lifetime)
fn download_json<T>(url: &str) -> Result<T, String>
where
    T: DeserializeOwned,
{
    let output = Command::new("curl")
        .arg("-s")
        .arg("-L") // -L важен для следования за перенаправлениями Mojang
        .arg(url)
        .output()
        .map_err(|e| format!("curl error: {}", e))?;

    let body = String::from_utf8_lossy(&output.stdout);
    serde_json::from_str(&body).map_err(|e| format!("JSON parse: {}", e))
}

fn download_file(url: &str, path: &PathBuf) -> Result<(), String> {
    let output = Command::new("curl")
        .arg("-L")
        .arg("-o")
        .arg(path.to_str().unwrap())
        .arg(url)
        .output()
        .map_err(|e| format!("curl download: {}", e))?;

    if output.status.success() {
        Ok(())
    } else {
        Err(format!("Download failed: {}", String::from_utf8_lossy(&output.stderr)))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![launch_minecraft])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}