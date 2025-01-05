document.addEventListener('DOMContentLoaded', function() {
    // 添加设备分辨率检测和适配
    function checkDeviceAndAdjust() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // 设置根元素的数据属性，用于 CSS 媒体查询
        document.documentElement.dataset.deviceWidth = width;
        document.documentElement.dataset.deviceHeight = height;
        document.documentElement.dataset.devicePixelRatio = devicePixelRatio;
        
        // 根据设备宽度调整导航栏
        const sideNav = document.getElementById('side-nav');
        const app = document.getElementById('app');
        
        if (width <= 768) {
            // 移动设备
            sideNav.style.width = '60px';
            document.querySelectorAll('.nav-item span').forEach(span => {
                span.style.display = 'none';
            });
            document.querySelectorAll('.nav-group h3').forEach(h3 => {
                h3.style.display = 'none';
            });
            app.classList.add('mobile');
        } else if (width <= 1024) {
            // 平板设备
            sideNav.style.width = '180px';
            app.classList.add('tablet');
        } else {
            // 桌面设备
            sideNav.style.width = '240px';
            app.classList.remove('mobile', 'tablet');
        }
        
        // 调整图片网格布局
        const photoGallery = document.querySelector('.photo-gallery');
        if (photoGallery) {
            if (width <= 650) {
                photoGallery.style.gridTemplateColumns = '1fr';
            } else if (width <= 1000) {
                photoGallery.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                photoGallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }
        }
        
        // 调整链接网格布局
        const linkGroups = document.querySelectorAll('.link-group');
        linkGroups.forEach(group => {
            if (width <= 480) {
                group.style.gridTemplateColumns = '1fr';
            } else if (width <= 768) {
                group.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                group.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
            }
        });
    }
    
    // 初始检测
    checkDeviceAndAdjust();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkDeviceAndAdjust);
    
    // 监听设备方向变化
    window.addEventListener('orientationchange', checkDeviceAndAdjust);
    
    // 欢迎界面处理
    const enterDot = document.getElementById('enter-dot');
    if (enterDot) {
        enterDot.addEventListener('click', function() {
            // 先显示主界面
            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            // 然后初始化默认页面
            initDefaultPage();
        });
    }

    // 初始化默认页面函数
    function initDefaultPage() {
        const defaultNav = document.querySelector('[data-page="gallery"]');
        if (defaultNav) {
            defaultNav.classList.add('active');
            showPage('gallery');
        }
    }

    // 显示页面函数
    function showPage(pageName) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // 显示选中的页面
        const selectedPage = document.getElementById(`${pageName}-page`);
        if (selectedPage) {
            selectedPage.style.display = 'block';
            // 初始化页面特定功能
            initPageFeatures(pageName);
        }
    }

    // 添加点击涟漪效果
    document.addEventListener('mousedown', function(e) {
        // 忽略右键点击
        if (e.button !== 0) return;
        
        // 忽略特定元素的点击
        if (e.target.closest('.chat-input-container') || 
            e.target.closest('.lightbox-toolbar') ||
            e.target.closest('#user-input') ||
            e.target.closest('a') ||  // 忽略链接
            e.target.closest('input') ||  // 忽略输入框
            e.target.closest('textarea')) {  // 忽略文本区域
            return;
        }
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        
        // 确保动画结束后移除元素
        ripple.addEventListener('animationend', function() {
            ripple.remove();
        });
        // 3秒后如果元素还存在就移除它（防止动画失败）
        setTimeout(() => ripple.remove(), 3000);
    });
    
    // 触摸设备支持
    document.addEventListener('touchstart', function(e) {
        // 忽略特定元素的触摸
        if (e.target.closest('.chat-input-container') || 
            e.target.closest('.lightbox-toolbar') ||
            e.target.closest('#user-input')) {
            return;
        }
        
        const touch = e.touches[0];
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = touch.clientX + 'px';
        ripple.style.top = touch.clientY + 'px';
        document.body.appendChild(ripple);
        
        // 确保动画结束后移除元素
        ripple.addEventListener('animationend', function() {
            ripple.remove();
        });
        // 3秒后如果元素还存在就移除它（防止动画失败）
        setTimeout(() => ripple.remove(), 3000);
    });

    // 导航点击效果
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // 移除其他导航项的激活状态
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加当前项的激活状态
            this.classList.add('active');
            
            // 显示对应的页面
            const pageName = this.dataset.page;
            showPage(pageName);
        });
    });

    // 页面特定功能初始化
    function initPageFeatures(pageName) {
        switch(pageName) {
            case 'gallery':
                initGallery();
                break;
            case 'chat':
                // 初始化打字效果
                initTypingEffect();
                break;
        }
    }

    // 初始化相册功能
    function initGallery() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxContent = document.querySelector('.lightbox-content');
        let isDragging = false;
        let startX, startY;
        let translateX = 0, translateY = 0;
        let lastX, lastY;
        let currentScale = 1;
        let currentRotation = 0;
        
        // 修改缩放图片的函数
        window.zoomIn = function() {
            const newScale = Math.min(currentScale * 1.2, 3); // 最大放大3倍
            if (currentScale !== newScale) {
                const scaleRatio = newScale / currentScale;
                translateX = translateX * scaleRatio;
                translateY = translateY * scaleRatio;
                currentScale = newScale;
            }
            updateImageTransform();
        };
        
        window.zoomOut = function() {
            const newScale = Math.max(currentScale / 1.2, 0.5); // 最小缩小到0.5倍
            if (currentScale !== newScale) {
                const scaleRatio = newScale / currentScale;
                translateX = translateX * scaleRatio;
                translateY = translateY * scaleRatio;
                currentScale = newScale;
            }
            updateImageTransform();
        };

        // 修改鼠标滚轮缩放
        lightboxContent.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const rect = lightboxImage.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(Math.max(currentScale * delta, 0.5), 3); // 限制缩放范围
            
            if (currentScale !== newScale) {
                const scaleRatio = newScale / currentScale;
                translateX = translateX * scaleRatio + mouseX * (1 - scaleRatio);
                translateY = translateY * scaleRatio + mouseY * (1 - scaleRatio);
                currentScale = newScale;
                updateImageTransform();
            }
        }, { passive: false });

        // 关闭图片查看器
        window.closeLightbox = function() {
            lightbox.style.display = 'none';
            // 重置所有变换
            translateX = 0;
            translateY = 0;
            currentRotation = 0;
            currentScale = 1;
            updateImageTransform();
        };
        
        // 打开图片查看器
        window.openLightbox = function(imgElement) {
            lightboxImage.src = imgElement.src;
            lightbox.style.display = 'flex';
            
            // 重置图片状态
            translateX = 0;
            translateY = 0;
            currentRotation = 0;
            currentScale = 1;
            updateImageTransform();
        };
        
        // 处理拖动开始
        lightboxContent.addEventListener('mousedown', function(e) {
            if (!e.target.closest('.lightbox-toolbar')) {
                isDragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                lightbox.classList.add('dragging');
                e.preventDefault();
            }
        });

        // 处理拖动
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                if (currentScale <= 1) {
                    // 未放大时不允许拖动
                    return;
                }
                
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                
                // 更新位置
                translateX += deltaX;
                translateY += deltaY;
                
                lastX = e.clientX;
                lastY = e.clientY;
                
                // 更新变换（包含边界检查）
                updateImageTransform();
                e.preventDefault();
            }
        });

        // 处理拖动结束
        document.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            isDragging = false;
            lightbox.classList.remove('dragging');
        });

        // 点击背景关闭
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // 防止拖动时选中文本
        lightbox.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
        // 旋转图片
        window.rotateLightboxImage = function(degrees) {
            currentRotation += degrees;
            updateImageTransform();
        };
        
        // 更新图片变换
        function updateImageTransform() {
            // 获取图片和容器的尺寸
            const rect = lightboxImage.getBoundingClientRect();
            const containerRect = lightboxContent.getBoundingClientRect();
            
            // 计算边界
            const maxX = (rect.width * currentScale - containerRect.width) / 2;
            const maxY = (rect.height * currentScale - containerRect.height) / 2;
            
            // 限制拖动范围
            if (currentScale <= 1) {
                // 如果未放大，则禁止拖动
                translateX = 0;
                translateY = 0;
            } else {
                // 限制在可视区域内
                translateX = Math.max(Math.min(translateX, maxX), -maxX);
                translateY = Math.max(Math.min(translateY, maxY), -maxY);
            }
            
            // 应用变换
            requestAnimationFrame(() => {
                lightboxImage.style.transform = 
                    `translate(${translateX}px, ${translateY}px) rotate(${currentRotation}deg) scale(${currentScale})`;
            });
        }
        
        // 下载图片
        window.downloadImage = function() {
            const link = document.createElement('a');
            link.href = lightboxImage.src;
            link.download = 'photo.jpg';
            link.click();
        };
    }

    // 聊天功能初始化
    function initChat() {
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');

        // 本地响应配置
        const LOCAL_RESPONSES = {
            greetings: [
                "你好！很高兴见到你。",
                "你好！有什么我可以帮你的吗？",
                "嗨！今天过得怎么样？"
            ],
            default: [
                "抱歉，AI服务暂时不可用。我是一个简单的本地回复系统。",
                "目前AI服务正在维护中，我只能提供基础的对话功能。",
                "AI服务遇到了一些问题，但我还是很乐意和你聊天。"
            ]
        };

        async function sendMessage() {
            const message = userInput.value.trim();
            if (message) {
                // 添加用户消息
                const userMessageHtml = `
                    <div class="message user-message">
                        <div class="message-content">
                            <p>${message}</p>
                        </div>
                        <div class="message-avatar">我</div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', userMessageHtml);
                userInput.value = '';

                // 使用本地响应
                const isGreeting = message.match(/^(你好|嗨|hello|hi|hey)/i);
                const responses = isGreeting ? LOCAL_RESPONSES.greetings : LOCAL_RESPONSES.default;
                const localReply = responses[Math.floor(Math.random() * responses.length)];
                
                const aiMessageHtml = `
                    <div class="message bot-message">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <p>${formatAIResponse(localReply)}</p>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', aiMessageHtml);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }

        // 发送按钮点击事件
        sendButton.addEventListener('click', sendMessage);

        // 输入框回车事件
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 自动调整输入框高度
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = userInput.scrollHeight + 'px';
        });
    }

    // 在页面加载完成后初始化聊天功能
    document.addEventListener('DOMContentLoaded', () => {
        initChat();
    });

    // 格式化AI回复内容
    function formatAIResponse(text) {
        return text
            // 处理换行
            .replace(/\n/g, '<br/>')
            // 处理空格
            .replace(/ /g, '&nbsp;')
            // Unicode 转义
            .replace(/[\u0020-\u0040\u005B-\u0060\u007B-\u007E]/g, function(char) {
                return `&#${char.charCodeAt(0)};`;
            })
            // 特殊处理 < 和 >
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // 处理加粗
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // 处理斜体
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // 处理代码块
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // 处理行内代码
            .replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    // 添加特殊字符样式
    const charStyle = document.createElement('style');
    charStyle.textContent = `
        .message-content {
            word-break: break-word;
            white-space: pre-wrap;
        }
        .message-content code {
            unicode-bidi: embed;
        }
    `;
    document.head.appendChild(charStyle);

    // 展开/收起输入框
    function toggleExpand(btn) {
        const container = btn.closest('.chat-input-container');
        container.classList.toggle('expanded');
        const icon = btn.querySelector('i');
        if (container.classList.contains('expanded')) {
            icon.className = 'fas fa-compress-alt';
        } else {
            icon.className = 'fas fa-expand-alt';
        }
    }

    // 将现有的 showWeChatQR 函数移到全局作用域
    window.showWeChatQR = function(event) {
        event.preventDefault();
        const modal = document.getElementById('wechat-modal');
        modal.style.display = 'block';
    }

    // 等待 DOM 加载完成后再添加事件监听器
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.onclick = function() {
            document.getElementById('wechat-modal').style.display = 'none';
        }
    }

    // 点击弹窗外部关闭
    const modal = document.getElementById('wechat-modal');
    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

    // 修改打字效果初始化函数
    function initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            let index = 0;

            function typeWriter() {
                if (index < text.length) {
                    typingText.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 150); // 调整打字速度
                } else {
                    // 添加闪烁的点
                    const dot = document.createElement('span');
                    dot.className = 'typing-dot';
                    dot.textContent = '•';
                    typingText.appendChild(dot);
                }
            }

            // 开始打字动画
            setTimeout(typeWriter, 500); // 延迟开始
        }
    }

    // 初始化主题切换
    initThemeSwitch();
});

function initThemeSwitch() {
    const toggleSwitch = document.querySelector('#checkbox');
    if (!toggleSwitch) return; // 确保元素存在

    // 修改默认主题逻辑
    const currentTheme = localStorage.getItem('theme') || 'light'; // 默认使用浅色模式
    
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleSwitch.checked = currentTheme === 'dark';

    // 监听切换事件
    toggleSwitch.addEventListener('change', function(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
} 