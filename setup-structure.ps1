# setup-structure.ps1
# Скрипт для создания структуры проекта ERP коворкинга

Write-Host "Создание структуры проекта..." -ForegroundColor Green

# Backend структура
$backendDirs = @(
    "backend/app/api",
    "backend/app/core",
    "backend/app/db",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/services",
    "backend/tests"
)

# Frontend структура
$frontendDirs = @(
    "frontend/public",
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/utils"
)

# Дополнительные директории
$otherDirs = @(
    "docs",
    ".github/workflows"
)

# Создание всех директорий
$allDirs = $backendDirs + $frontendDirs + $otherDirs
foreach ($dir in $allDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "✓ Создана папка: $dir" -ForegroundColor Cyan
}

# Создание файлов
$files = @(
    "backend/requirements.txt",
    "backend/Dockerfile",
    "backend/.env.example",
    "backend/app/__init__.py",
    "backend/app/main.py",
    "frontend/package.json",
    "frontend/Dockerfile",
    "docker-compose.yml",
    ".gitignore",
    "README.md"
)

foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file | Out-Null
    Write-Host "✓ Создан файл: $file" -ForegroundColor Yellow
}

Write-Host "`nСтруктура проекта успешно создана!" -ForegroundColor Green
Write-Host "Используйте 'tree /F' для просмотра структуры" -ForegroundColor Gray