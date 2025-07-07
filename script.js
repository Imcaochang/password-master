// 密码生成器主应用
class PasswordGenerator {
    constructor() {
        this.init();
        this.loadSettings();
        this.bindEvents();
        this.loadHistory();
    }

    // 初始化应用
    init() {
        // 获取DOM元素
        this.elements = {
            passwordOutput: document.getElementById('passwordOutput'),
            copyBtn: document.getElementById('copyBtn'),
            generateBtn: document.getElementById('generateBtn'),
            generateMultipleBtn: document.getElementById('generateMultipleBtn'),
            passwordLength: document.getElementById('passwordLength'),
            lengthValue: document.getElementById('lengthValue'),
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            numbers: document.getElementById('numbers'),
            symbols: document.getElementById('symbols'),
            excludeSimilar: document.getElementById('excludeSimilar'),
            strengthFill: document.getElementById('strengthFill'),
            strengthText: document.getElementById('strengthText'),
            settingsToggle: document.getElementById('settingsToggle'),
            settingsContent: document.getElementById('settingsContent'),
            historyList: document.getElementById('historyList'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            themeToggle: document.getElementById('themeToggle'),
            themeIcon: document.querySelector('.theme-icon'),
            modal: document.getElementById('multipleModal'),
            modalClose: document.getElementById('modalClose'),
            modalCancel: document.getElementById('modalCancel'),
            modalGenerate: document.getElementById('modalGenerate'),
            multipleCount: document.getElementById('multipleCount'),
            multiplePasswords: document.getElementById('multiplePasswords'),
            notification: document.getElementById('notification'),
            notificationText: document.getElementById('notificationText')
        };

        // 字符集定义
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            similar: '0O1lI'
        };

        // 预设策略
        this.strategies = {
            simple: {
                length: 12,
                uppercase: true,
                lowercase: true,
                numbers: true,
                symbols: false,
                excludeSimilar: false
            },
            standard: {
                length: 16,
                uppercase: true,
                lowercase: true,
                numbers: true,
                symbols: true,
                excludeSimilar: false
            },
            strong: {
                length: 20,
                uppercase: true,
                lowercase: true,
                numbers: true,
                symbols: true,
                excludeSimilar: true
            },
            memorable: {
                length: 16,
                uppercase: true,
                lowercase: true,
                numbers: true,
                symbols: false,
                excludeSimilar: true
            }
        };

        // 当前设置
        this.settings = {
            length: 16,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            excludeSimilar: false
        };

        // 历史记录
        this.history = [];
    }

    // 绑定事件
    bindEvents() {
        // 生成密码按钮
        this.elements.generateBtn.addEventListener('click', () => this.generatePassword());
        this.elements.generateMultipleBtn.addEventListener('click', () => this.showMultipleModal());

        // 复制按钮
        this.elements.copyBtn.addEventListener('click', () => this.copyPassword());

        // 长度滑块
        this.elements.passwordLength.addEventListener('input', (e) => {
            this.settings.length = parseInt(e.target.value);
            this.elements.lengthValue.textContent = this.settings.length;
            this.saveSettings();
        });

        // 字符类型复选框
        ['uppercase', 'lowercase', 'numbers', 'symbols', 'excludeSimilar'].forEach(type => {
            this.elements[type].addEventListener('change', (e) => {
                this.settings[type] = e.target.checked;
                this.saveSettings();
                this.validateSettings();
            });
        });

        // 长度预设按钮
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const length = parseInt(e.target.dataset.length);
                this.settings.length = length;
                this.elements.passwordLength.value = length;
                this.elements.lengthValue.textContent = length;
                this.saveSettings();
                this.updatePresetButtons();
            });
        });

        // 策略按钮
        document.querySelectorAll('.strategy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const strategy = e.target.dataset.strategy;
                this.applyStrategy(strategy);
            });
        });

        // 设置面板切换
        this.elements.settingsToggle.addEventListener('click', () => this.toggleSettings());

        // 清空历史
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // 主题切换
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // 模态框事件
        this.elements.modalClose.addEventListener('click', () => this.hideModal());
        this.elements.modalCancel.addEventListener('click', () => this.hideModal());
        this.elements.modalGenerate.addEventListener('click', () => this.generateMultiplePasswords());

        // 点击模态框外部关闭
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.hideModal();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.generatePassword();
                        break;
                    case 'c':
                        if (this.elements.passwordOutput.value) {
                            e.preventDefault();
                            this.copyPassword();
                        }
                        break;
                }
            }
        });

        // 密码输出框点击全选
        this.elements.passwordOutput.addEventListener('click', () => {
            this.elements.passwordOutput.select();
        });
    }

    // 生成密码
    generatePassword() {
        if (!this.validateSettings()) {
            this.showNotification('请至少选择一种字符类型', 'error');
            return;
        }

        const password = this.createPassword();
        this.elements.passwordOutput.value = password;
        this.evaluateStrength(password);
        this.addToHistory(password);
        this.elements.passwordOutput.select();
    }

    // 创建密码
    createPassword() {
        let charset = '';
        let password = '';

        // 构建字符集
        if (this.settings.uppercase) charset += this.charSets.uppercase;
        if (this.settings.lowercase) charset += this.charSets.lowercase;
        if (this.settings.numbers) charset += this.charSets.numbers;
        if (this.settings.symbols) charset += this.charSets.symbols;

        // 排除易混淆字符
        if (this.settings.excludeSimilar) {
            charset = charset.split('').filter(char => !this.charSets.similar.includes(char)).join('');
        }

        // 确保至少包含每种选中的字符类型
        const requiredChars = [];
        if (this.settings.uppercase) {
            requiredChars.push(this.getRandomChar(this.charSets.uppercase));
        }
        if (this.settings.lowercase) {
            requiredChars.push(this.getRandomChar(this.charSets.lowercase));
        }
        if (this.settings.numbers) {
            requiredChars.push(this.getRandomChar(this.charSets.numbers));
        }
        if (this.settings.symbols) {
            requiredChars.push(this.getRandomChar(this.charSets.symbols));
        }

        // 生成随机字符
        const remainingLength = this.settings.length - requiredChars.length;
        for (let i = 0; i < remainingLength; i++) {
            password += this.getRandomChar(charset);
        }

        // 添加必需字符并打乱顺序
        password += requiredChars.join('');
        return this.shuffleString(password);
    }

    // 获取随机字符
    getRandomChar(charset) {
        const randomBytes = new Uint8Array(1);
        crypto.getRandomValues(randomBytes);
        return charset[randomBytes[0] % charset.length];
    }

    // 打乱字符串
    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    // 评估密码强度
    evaluateStrength(password) {
        let score = 0;
        let feedback = [];

        // 长度评分
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        if (password.length >= 20) score += 1;

        // 字符多样性评分
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

        if (hasUppercase) score += 1;
        if (hasLowercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSymbols) score += 1;

        // 熵值计算
        const charsetSize = (hasUppercase ? 26 : 0) + (hasLowercase ? 26 : 0) + (hasNumbers ? 10 : 0) + (hasSymbols ? 32 : 0);
        const entropy = Math.log2(Math.pow(charsetSize, password.length));

        // 确定强度等级
        let strength, strengthClass, strengthText;
        if (score <= 2 || password.length < 8) {
            strength = 'weak';
            strengthClass = 'weak';
            strengthText = '弱';
        } else if (score <= 4) {
            strength = 'medium';
            strengthClass = 'medium';
            strengthText = '中等';
        } else if (score <= 6) {
            strength = 'strong';
            strengthClass = 'strong';
            strengthText = '强';
        } else {
            strength = 'very-strong';
            strengthClass = 'very-strong';
            strengthText = '极强';
        }

        // 更新UI
        this.elements.strengthFill.className = `strength-fill ${strengthClass}`;
        this.elements.strengthText.textContent = strengthText;
    }

    // 复制密码
    async copyPassword() {
        const password = this.elements.passwordOutput.value;
        if (!password) {
            this.showNotification('没有可复制的密码', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.showNotification('密码已复制到剪贴板', 'success');
            
            // 自动清除剪贴板（5秒后）
            setTimeout(async () => {
                try {
                    await navigator.clipboard.writeText('');
                } catch (e) {
                    // 忽略清除失败的错误
                }
            }, 5000);
        } catch (err) {
            // 降级方案
            this.elements.passwordOutput.select();
            document.execCommand('copy');
            this.showNotification('密码已复制到剪贴板', 'success');
        }
    }

    // 验证设置
    validateSettings() {
        const hasChars = this.settings.uppercase || this.settings.lowercase || 
                        this.settings.numbers || this.settings.symbols;
        
        if (!hasChars) {
            this.elements.generateBtn.disabled = true;
            this.elements.generateBtn.style.opacity = '0.5';
            return false;
        } else {
            this.elements.generateBtn.disabled = false;
            this.elements.generateBtn.style.opacity = '1';
            return true;
        }
    }

    // 应用策略
    applyStrategy(strategy) {
        const config = this.strategies[strategy];
        if (!config) return;

        // 更新设置
        this.settings = { ...config };
        
        // 更新UI
        this.elements.passwordLength.value = this.settings.length;
        this.elements.lengthValue.textContent = this.settings.length;
        this.elements.uppercase.checked = this.settings.uppercase;
        this.elements.lowercase.checked = this.settings.lowercase;
        this.elements.numbers.checked = this.settings.numbers;
        this.elements.symbols.checked = this.settings.symbols;
        this.elements.excludeSimilar.checked = this.settings.excludeSimilar;

        // 更新策略按钮状态
        document.querySelectorAll('.strategy-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-strategy="${strategy}"]`).classList.add('active');

        // 更新预设按钮
        this.updatePresetButtons();

        this.saveSettings();
        this.validateSettings();
    }

    // 更新预设按钮状态
    updatePresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.length) === this.settings.length) {
                btn.classList.add('active');
            }
        });
    }

    // 切换设置面板
    toggleSettings() {
        const isVisible = this.elements.settingsContent.classList.contains('show');
        this.elements.settingsContent.classList.toggle('show');
        this.elements.settingsToggle.querySelector('.toggle-icon').textContent = isVisible ? '▼' : '▲';
    }

    // 添加历史记录
    addToHistory(password) {
        const historyItem = {
            password: password,
            timestamp: new Date().toISOString(),
            settings: { ...this.settings }
        };

        this.history.unshift(historyItem);
        
        // 限制历史记录数量
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }

        this.saveHistory();
        this.renderHistory();
    }

    // 渲染历史记录
    renderHistory() {
        this.elements.historyList.innerHTML = '';
        
        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const time = new Date(item.timestamp).toLocaleString('zh-CN');
            
            historyItem.innerHTML = `
                <div>
                    <div class="history-password">${item.password}</div>
                    <div class="history-time">${time}</div>
                </div>
                <button class="history-copy" onclick="passwordGenerator.copyHistoryPassword(${index})">复制</button>
            `;
            
            this.elements.historyList.appendChild(historyItem);
        });
    }

    // 复制历史密码
    async copyHistoryPassword(index) {
        const password = this.history[index].password;
        try {
            await navigator.clipboard.writeText(password);
            this.showNotification('历史密码已复制', 'success');
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('历史密码已复制', 'success');
        }
    }

    // 清空历史
    clearHistory() {
        if (confirm('确定要清空所有历史记录吗？')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showNotification('历史记录已清空', 'success');
        }
    }

    // 显示批量生成模态框
    showMultipleModal() {
        this.elements.modal.classList.add('show');
        this.elements.multipleCount.focus();
    }

    // 隐藏模态框
    hideModal() {
        this.elements.modal.classList.remove('show');
    }

    // 批量生成密码
    generateMultiplePasswords() {
        const count = parseInt(this.elements.multipleCount.value);
        if (count < 2 || count > 50) {
            this.showNotification('生成数量必须在2-50之间', 'error');
            return;
        }

        if (!this.validateSettings()) {
            this.showNotification('请至少选择一种字符类型', 'error');
            return;
        }

        this.elements.multiplePasswords.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const password = this.createPassword();
            const passwordItem = document.createElement('div');
            passwordItem.className = 'multiple-password-item';
            passwordItem.innerHTML = `
                <span class="multiple-password-text">${password}</span>
                <button class="multiple-password-copy" onclick="passwordGenerator.copyMultiplePassword('${password}')">复制</button>
            `;
            this.elements.multiplePasswords.appendChild(passwordItem);
        }

        this.hideModal();
        this.showNotification(`已生成 ${count} 个密码`, 'success');
    }

    // 复制批量生成的密码
    async copyMultiplePassword(password) {
        try {
            await navigator.clipboard.writeText(password);
            this.showNotification('密码已复制', 'success');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('密码已复制', 'success');
        }
    }

    // 切换主题
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.elements.themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        localStorage.setItem('theme', newTheme);
    }

    // 显示通知
    showNotification(message, type = 'success') {
        this.elements.notificationText.textContent = message;
        this.elements.notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }

    // 保存设置
    saveSettings() {
        localStorage.setItem('passwordGeneratorSettings', JSON.stringify(this.settings));
    }

    // 加载设置
    loadSettings() {
        const saved = localStorage.getItem('passwordGeneratorSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            
            // 更新UI
            this.elements.passwordLength.value = this.settings.length;
            this.elements.lengthValue.textContent = this.settings.length;
            this.elements.uppercase.checked = this.settings.uppercase;
            this.elements.lowercase.checked = this.settings.lowercase;
            this.elements.numbers.checked = this.settings.numbers;
            this.elements.symbols.checked = this.settings.symbols;
            this.elements.excludeSimilar.checked = this.settings.excludeSimilar;
            
            this.updatePresetButtons();
            this.validateSettings();
        }
    }

    // 保存历史记录
    saveHistory() {
        localStorage.setItem('passwordGeneratorHistory', JSON.stringify(this.history));
    }

    // 加载历史记录
    loadHistory() {
        const saved = localStorage.getItem('passwordGeneratorHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }

    // 加载主题
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.elements.themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        } else {
            // 检测系统主题偏好
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                this.elements.themeIcon.textContent = '☀️';
            }
        }
    }
}

// 初始化应用
let passwordGenerator;

document.addEventListener('DOMContentLoaded', () => {
    passwordGenerator = new PasswordGenerator();
    passwordGenerator.loadTheme();
}); 