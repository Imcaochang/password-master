@echo off
chcp 65001 >nul
title Password Master - 智能密码生成器

echo 🔐 Password Master - 智能密码生成器
echo ==================================
echo.

REM 检查当前目录
if not exist "index.html" (
    echo ❌ 错误：请在项目根目录下运行此脚本
    pause
    exit /b 1
)

REM 检查可用的服务器
set "server_found="

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 检测到 Python
    set "server_found=1"
    goto :start_server
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 检测到 Python3
    set "server_found=1"
    goto :start_server
)

node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 检测到 Node.js
    set "server_found=1"
    goto :start_server
)

php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 检测到 PHP
    set "server_found=1"
    goto :start_server
)

if not defined server_found (
    echo ❌ 未检测到可用的服务器
    echo.
    echo 💡 建议安装以下任一服务器：
    echo    - Python: https://www.python.org/
    echo    - Node.js: https://nodejs.org/
    echo    - PHP: https://www.php.net/
    echo.
    echo 或者直接双击 index.html 文件在浏览器中打开
    pause
    exit /b 1
)

:start_server
set /p port="请输入端口号 (默认: 8000): "
if "%port%"=="" set port=8000

echo.
echo 🚀 正在启动本地服务器...
echo 📱 请在浏览器中访问: http://localhost:%port%
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 尝试启动服务器
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 使用 Python 启动服务器...
    python -m http.server %port%
    goto :end
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 使用 Python3 启动服务器...
    python3 -m http.server %port%
    goto :end
)

node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 使用 Node.js serve 启动服务器...
    npx serve . -p %port%
    goto :end
)

php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 使用 PHP 启动服务器...
    php -S localhost:%port%
    goto :end
)

echo ❌ 无法启动服务器，请手动启动

:end
pause 