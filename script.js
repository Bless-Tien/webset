// ==================== 主题切换 ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// 检查本地存储的主题
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// ==================== 页面导航 ====================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // 更新导航状态
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // 切换section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    });
});

// 滚动到指定section
function scrollToSection(sectionId) {
    const targetLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (targetLink) {
        targetLink.click();
    }
}

// ==================== 导航栏滚动效果 ====================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ==================== 页面初始化 ====================
window.addEventListener('load', () => {
    console.log('🎉 欢迎来到 Bless Tien 的个人网站！');
    console.log('💼 智能硬件 / 智能家居方向产品经理');
    console.log('🔬 跨界搞产品的科研博士');
});

// 添加平滑滚动动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
