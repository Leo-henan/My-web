document.addEventListener('DOMContentLoaded', () => {
    const aiChatBtn = document.getElementById('ai-chat-btn');
    const aiChatInterface = document.getElementById('ai-chat-interface');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendMessageBtn = document.getElementById('send-message');

    aiChatBtn.addEventListener('click', () => {
        aiChatInterface.classList.remove('hidden');
    });

    closeChatBtn.addEventListener('click', () => {
        aiChatInterface.classList.add('hidden');
    });

    sendMessageBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            callMiniMaxAPI(message);
        }
    }

    function addMessage(role, content) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;
        messageElement.textContent = content;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function callMiniMaxAPI(message) {
        const apiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJMaW4iLCJVc2VyTmFtZSI6IkxpbiIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxODQ2MTkxNzY0MzAyNDc5NDU3IiwiUGhvbmUiOiIxNzgzOTU0ODkxMSIsIkdyb3VwSUQiOiIxODQ2MTkxNzY0Mjk0MDkwODQ5IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjQtMTAtMTkgMDk6NDk6MzMiLCJpc3MiOiJtaW5pbWF4In0.pTRST1cjgqk9bCcYe80nhp2McEbyRgN11HM1ONUcqeaZl9kxj3FDmQeSUhQ1XLwvUxB43qB17U0L-vF3_WnXsOUQ78IA1yUvaZhKflyqYk_K82JW29UTj4GlKhAv_Wm0hyZreDNXmYOKNO5sBHwxyxvZQwtj_h49-VsfvUGpN3WufKYUz4YWUnTIpwXWXejXGFspmWdhpOwxajAxXqmWb3EUhVB9g43utwJ9M48_W7eNhmk_Smj8y2TwiFU6rswf3DqkIHRzz--Sv8-A7YI1AowLO_SPtu_AKKZnlKmiQwjq7oQMrqOkvlNoTO_H7TtglBp94HNU36lC0riwIVQHnQ';
        const apiUrl = 'https://api.minimax.chat/v1/text/chatcompletion_v2';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'abab6.5s-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const aiResponse = data.choices[0].message.content;
                addMessage('assistant', aiResponse);
            } else {
                addMessage('assistant', '抱歉，我现在无法回答您的问题。');
            }
        } catch (error) {
            console.error('Error calling MiniMax API:', error);
            addMessage('assistant', '抱歉，发生了一些错误。请稍后再试。');
        }
    }

    // 轮播图逻辑
    const carousel = document.querySelector('.carousel-container');
    const images = document.querySelectorAll('.carousel-image');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    function showImage(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // 自动轮播
    setInterval(showNextImage, 5000);

    // 在文件末尾添加这段代码
    images.forEach((img, index) => {
        console.log(`图片${index + 1}路径: ${img.src}`);
        img.addEventListener('load', () => {
            console.log(`图片${index + 1}加载成功`);
        });
        img.addEventListener('error', () => {
            console.log(`图片${index + 1}加载失败`);
        });
    });
});
