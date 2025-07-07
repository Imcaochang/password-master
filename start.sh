#!/bin/bash

# Password Master 启动脚本
# 支持多种本地服务器启动方式

echo "🔐 Password Master - 智能密码生成器"
echo "=================================="
echo ""

# 检查是否有可用的服务器
check_server() {
    if command -v python3 &> /dev/null; then
        echo "✅ 检测到 Python3"
        return 0
    elif command -v python &> /dev/null; then
        echo "✅ 检测到 Python"
        return 0
    elif command -v node &> /dev/null; then
        echo "✅ 检测到 Node.js"
        return 0
    elif command -v php &> /dev/null; then
        echo "✅ 检测到 PHP"
        return 0
    else
        echo "❌ 未检测到可用的服务器"
        return 1
    fi
}

# 启动服务器
start_server() {
    local port=${1:-8000}
    
    echo "🚀 正在启动本地服务器..."
    echo "📱 请在浏览器中访问: http://localhost:$port"
    echo "🛑 按 Ctrl+C 停止服务器"
    echo ""
    
    # 尝试不同的服务器
    if command -v python3 &> /dev/null; then
        echo "使用 Python3 启动服务器..."
        python3 -m http.server $port
    elif command -v python &> /dev/null; then
        echo "使用 Python 启动服务器..."
        python -m http.server $port
    elif command -v node &> /dev/null; then
        echo "使用 Node.js serve 启动服务器..."
        npx serve . -p $port
    elif command -v php &> /dev/null; then
        echo "使用 PHP 启动服务器..."
        php -S localhost:$port
    else
        echo "❌ 无法启动服务器，请手动启动"
        return 1
    fi
}

# 主函数
main() {
    # 检查当前目录
    if [ ! -f "index.html" ]; then
        echo "❌ 错误：请在项目根目录下运行此脚本"
        exit 1
    fi
    
    # 检查服务器
    if ! check_server; then
        echo ""
        echo "💡 建议安装以下任一服务器："
        echo "   - Python3: https://www.python.org/"
        echo "   - Node.js: https://nodejs.org/"
        echo "   - PHP: https://www.php.net/"
        echo ""
        echo "或者直接双击 index.html 文件在浏览器中打开"
        exit 1
    fi
    
    # 获取端口号
    read -p "请输入端口号 (默认: 8000): " port
    port=${port:-8000}
    
    # 启动服务器
    start_server $port
}

# 运行主函数
main 