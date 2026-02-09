// ==================== 数据管理 ====================
const STORAGE_KEY = 'website_admin_data';
const PASSWORD_KEY = 'admin_password';

// 默认数据结构
let websiteData = {
    activities: {
        reading: '《说话的艺术》',
        learning: '搭建自己的网站',
        food: '姜记烤肉！'
    },
    mainQuests: [
        { year: '2025年', content: '1月2号 麒盛科技开始搬砖' },
        { year: '2024年', content: '12月博士毕业啦🎓' },
        { year: '2019年', content: '硕士毕业' }
    ],
    sideQuests: [
        { year: '2025年', content: '跟突突成为一家人🐱' },
        { year: '2024年', content: '开始沉迷养花🌸' },
        { year: '2023年', content: '跟小杨成为一家人❤️' },
        { year: '2021年', content: '学习拳击🥊' },
        { year: '2019年', content: '学会了木雕🪵' },
        { year: '2019年', content: '跟甜酒成为一家人🐱' }
    ]
};

// ==================== 登录管理 ====================
function login() {
    const password = document.getElementById('loginPassword').value;
    
    if (!password) {
        showNotification('请输入密码！', 'error');
        return;
    }
    
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    
    // 首次登录，设置密码
    if (!storedPassword) {
        localStorage.setItem(PASSWORD_KEY, btoa(password));
        showNotification('密码设置成功！', 'success');
        enterAdmin();
        return;
    }
    
    // 验证密码
    if (btoa(password) === storedPassword) {
        showNotification('登录成功！', 'success');
        enterAdmin();
    } else {
        showNotification('密码错误！', 'error');
    }
}

function enterAdmin() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadData();
    renderAll();
}

function logout() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginPassword').value = '';
}

// ==================== 数据加载与保存 ====================
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        websiteData = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websiteData));
    showNotification('数据已保存！', 'success');
}

// ==================== 渲染界面 ====================
function renderAll() {
    renderActivities();
    renderMainQuests();
    renderSideQuests();
}

function renderActivities() {
    document.getElementById('reading').value = websiteData.activities.reading;
    document.getElementById('learning').value = websiteData.activities.learning;
    document.getElementById('food').value = websiteData.activities.food;
}

function renderMainQuests() {
    const container = document.getElementById('mainQuestList');
    container.innerHTML = '';
    
    websiteData.mainQuests.forEach((quest, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item-edit';
        item.innerHTML = `
            <input type="text" class="input-field" value="${quest.year}" 
                   onchange="updateMainQuest(${index}, 'year', this.value)" placeholder="年份">
            <textarea class="input-field" 
                      onchange="updateMainQuest(${index}, 'content', this.value)" 
                      placeholder="任务内容">${quest.content}</textarea>
            <div class="item-actions">
                <button class="btn-small btn-danger" onclick="deleteMainQuest(${index})">删除</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderSideQuests() {
    const container = document.getElementById('sideQuestList');
    container.innerHTML = '';
    
    websiteData.sideQuests.forEach((quest, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item-edit';
        item.innerHTML = `
            <input type="text" class="input-field" value="${quest.year}" 
                   onchange="updateSideQuest(${index}, 'year', this.value)" placeholder="年份">
            <textarea class="input-field" 
                      onchange="updateSideQuest(${index}, 'content', this.value)" 
                      placeholder="任务内容">${quest.content}</textarea>
            <div class="item-actions">
                <button class="btn-small btn-danger" onclick="deleteSideQuest(${index})">删除</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// ==================== 最近动态管理 ====================
function saveActivities() {
    websiteData.activities.reading = document.getElementById('reading').value;
    websiteData.activities.learning = document.getElementById('learning').value;
    websiteData.activities.food = document.getElementById('food').value;
    saveData();
}

function archiveActivities() {
    if (!confirm('确定要归档当前的"最近在做什么"到支线任务吗？')) {
        return;
    }
    
    const currentYear = new Date().getFullYear() + '年';
    const activities = websiteData.activities;
    
    // 创建归档内容
    const archiveContent = `阅读《${activities.reading}》、学习${activities.learning}、推荐${activities.food}`;
    
    // 添加到支线任务开头
    websiteData.sideQuests.unshift({
        year: currentYear,
        content: archiveContent
    });
    
    saveData();
    renderSideQuests();
    showNotification('已归档到支线任务！', 'success');
}

// ==================== 主线任务管理 ====================
function addMainQuest() {
    const currentYear = new Date().getFullYear() + '年';
    websiteData.mainQuests.unshift({
        year: currentYear,
        content: '新的主线任务...'
    });
    saveData();
    renderMainQuests();
}

function updateMainQuest(index, field, value) {
    websiteData.mainQuests[index][field] = value;
    saveData();
}

function deleteMainQuest(index) {
    if (confirm('确定要删除这条主线任务吗？')) {
        websiteData.mainQuests.splice(index, 1);
        saveData();
        renderMainQuests();
    }
}

// ==================== 支线任务管理 ====================
function addSideQuest() {
    const currentYear = new Date().getFullYear() + '年';
    websiteData.sideQuests.unshift({
        year: currentYear,
        content: '新的支线任务...'
    });
    saveData();
    renderSideQuests();
}

function updateSideQuest(index, field, value) {
    websiteData.sideQuests[index][field] = value;
    saveData();
}

function deleteSideQuest(index) {
    if (confirm('确定要删除这条支线任务吗？')) {
        websiteData.sideQuests.splice(index, 1);
        saveData();
        renderSideQuests();
    }
}

// ==================== 生成HTML ====================
function generateHTML() {
    // 读取模板
    fetch('index.html')
        .then(response => response.text())
        .then(html => {
            // 替换最近动态
            html = html.replace(
                /<p class="activity-content">.*?<\/p>/g,
                function(match, offset) {
                    if (match.includes('正在阅读')) {
                        return `<p class="activity-content">${websiteData.activities.reading}</p>`;
                    } else if (match.includes('学习技能')) {
                        return `<p class="activity-content">${websiteData.activities.learning}</p>`;
                    } else if (match.includes('美食安利')) {
                        return `<p class="activity-content">${websiteData.activities.food}</p>`;
                    }
                    return match;
                }
            );
            
            // 替换主线任务
            let mainQuestHTML = '';
            websiteData.mainQuests.forEach(quest => {
                mainQuestHTML += `
                        <div class="timeline-year-block">
                            <div class="timeline-item">
                                <div class="timeline-date">${quest.year}</div>
                                <div class="timeline-content">
                                    ${quest.content}
                                </div>
                            </div>
                        </div>
                        `;
            });
            
            // 替换支线任务
            let sideQuestHTML = '';
            websiteData.sideQuests.forEach(quest => {
                sideQuestHTML += `
                        <div class="timeline-year-block">
                            <div class="timeline-item">
                                <div class="timeline-date">${quest.year}</div>
                                <div class="timeline-content">
                                    ${quest.content}
                                </div>
                            </div>
                        </div>
                        `;
            });
            
            // 替换时间线内容
            html = html.replace(
                /<!-- 左侧：主线任务 -->[\s\S]*?<\/div>\s*<!-- 右侧：支线任务 -->/,
                `<!-- 左侧：主线任务 -->
                    <div class="timeline-column main-quest">
${mainQuestHTML}
                    </div>
                    
                    <!-- 右侧：支线任务 -->`
            );
            
            html = html.replace(
                /<!-- 右侧：支线任务 -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
                `<!-- 右侧：支线任务 -->
                    <div class="timeline-column side-quest">
${sideQuestHTML}
                    </div>
                </div>
            </div>
        </div>
    </section>`
            );
            
            // 下载文件
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            a.click();
            
            showNotification('HTML文件已生成并下载！', 'success');
        })
        .catch(error => {
            showNotification('生成失败：' + error.message, 'error');
        });
}

// ==================== 预览网站 ====================
function previewSite() {
    window.open('index.html', '_blank');
}

// ==================== 通知系统 ====================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'success' ? '#28a745' : '#dc3545';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ==================== 页面加载 ====================
window.addEventListener('load', () => {
    // 检查是否已登录（简单实现）
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn) {
        enterAdmin();
    }
    
    // 监听Enter键登录
    document.getElementById('loginPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
});

// 登录成功后设置session
function enterAdmin() {
    sessionStorage.setItem('admin_logged_in', 'true');
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadData();
    renderAll();
}

// 退出时清除session
function logout() {
    sessionStorage.removeItem('admin_logged_in');
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginPassword').value = '';
}
