# Password Master - 智能密码生成器

🔐 一个安全、易用的在线密码生成工具，帮助您创建高强度、符合各种安全要求的密码。

## ✨ 功能特性

### 🎯 核心功能
- **智能密码生成**：使用Web Crypto API生成高安全性随机密码
- **自定义长度**：支持8-128位密码长度设置
- **字符类型选择**：
  - 大写字母 (A-Z)
  - 小写字母 (a-z)
  - 数字 (0-9)
  - 特殊字符 (!@#$%^&*等)
  - 排除易混淆字符 (0,O,1,l,I等)

### 🛡️ 安全功能
- **本地生成**：所有密码在本地生成，不上传服务器
- **强度评估**：实时检测密码强度等级（弱/中/强/极强）
- **自动清除**：复制后5秒自动清除剪贴板
- **安全提示**：提供密码安全使用建议

### 🎨 用户体验
- **响应式设计**：完美支持桌面端、平板、手机
- **深色模式**：支持明暗主题切换
- **预设策略**：简单、标准、高强度、易记忆四种预设
- **密码历史**：保存最近生成的密码（本地存储）
- **批量生成**：一次生成多个密码
- **一键复制**：快速复制密码到剪贴板

### ⌨️ 快捷操作
- `Ctrl/Cmd + Enter`：生成密码
- `Ctrl/Cmd + C`：复制密码
- 点击密码框：自动全选

## 🚀 快速开始

### 在线使用
直接访问项目页面即可使用，无需安装任何依赖。

### 本地运行
1. 克隆项目
```bash
git clone https://github.com/your-username/password-master.git
cd password-master
```

2. 启动本地服务器
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用PHP
php -S localhost:8000
```

3. 打开浏览器访问 `http://localhost:8000`

## 📱 使用方法

### 基本使用
1. 点击"生成密码"按钮创建随机密码
2. 使用滑块调整密码长度（8-128位）
3. 选择需要的字符类型
4. 点击复制按钮复制密码

### 高级设置
1. 点击"密码设置"展开设置面板
2. 使用预设策略快速配置：
   - **简单密码**：12位，仅字母数字
   - **标准密码**：16位，包含特殊字符
   - **高强度密码**：20位，排除易混淆字符
   - **易记忆密码**：16位，可读性强的组合

### 批量生成
1. 点击"批量生成"按钮
2. 设置生成数量（2-50个）
3. 点击"生成"创建多个密码
4. 分别复制需要的密码

## 🛠️ 技术实现

### 前端技术
- **HTML5**：语义化标签，良好的可访问性
- **CSS3**：现代CSS特性，响应式设计
- **JavaScript ES6+**：模块化编程，面向对象设计
- **Web Crypto API**：安全的随机数生成

### 核心算法
```javascript
// 密码生成算法
function createPassword() {
    // 1. 构建字符集
    let charset = '';
    if (settings.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (settings.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (settings.numbers) charset += '0123456789';
    if (settings.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // 2. 排除易混淆字符
    if (settings.excludeSimilar) {
        charset = charset.replace(/[0O1lI]/g, '');
    }
    
    // 3. 使用Web Crypto API生成随机字符
    const randomBytes = new Uint8Array(1);
    crypto.getRandomValues(randomBytes);
    return charset[randomBytes[0] % charset.length];
}
```

### 强度评估算法
- **长度评分**：8位=1分，12位=2分，16位=3分，20位=4分
- **字符多样性**：每种字符类型+1分
- **熵值计算**：基于字符集大小和密码长度
- **强度等级**：弱(≤2分)、中等(3-4分)、强(5-6分)、极强(≥7分)

## 📊 性能指标

- **加载时间**：< 2秒
- **密码生成**：< 100ms
- **浏览器兼容性**：> 95%
- **响应式支持**：桌面、平板、手机

## 🔒 安全特性

### 密码安全
- ✅ 使用Web Crypto API确保随机性
- ✅ 本地生成，不上传服务器
- ✅ 自动清除剪贴板
- ✅ 强度评估和建议

### 隐私保护
- ✅ 不收集用户密码信息
- ✅ 本地存储设置和历史
- ✅ 无第三方追踪
- ✅ 开源透明

## 🎨 设计特色

### 现代化UI
- 简洁美观的界面设计
- 流畅的动画效果
- 直观的交互反馈
- 一致的设计语言

### 可访问性
- 键盘导航支持
- 屏幕阅读器兼容
- 高对比度模式
- 字体缩放支持

### 响应式布局
- 移动优先设计
- 自适应网格布局
- 触摸友好的交互
- 优化的移动体验

## 📈 开发计划

### 已完成 ✅
- [x] 基本密码生成功能
- [x] 密码长度设置
- [x] 字符类型选择
- [x] 复制功能
- [x] 响应式设计
- [x] 深色模式
- [x] 密码强度评估
- [x] 预设策略
- [x] 密码历史记录
- [x] 批量生成

### 计划中 🚧
- [ ] 用户账户系统
- [ ] 密码收藏功能
- [ ] 多语言支持
- [ ] PWA支持
- [ ] 移动端APP
- [ ] 密码管理器集成

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发环境设置
```bash
# 克隆项目
git clone https://github.com/your-username/password-master.git
cd password-master

# 安装开发依赖（可选）
npm install

# 启动开发服务器
npm run dev
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有贡献者的支持
- 灵感来源于各种优秀的密码生成工具
- 使用了现代Web技术栈

## 📞 联系我们

- 项目主页：https://github.com/your-username/password-master
- 问题反馈：https://github.com/your-username/password-master/issues
- 邮箱：your-email@example.com

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！