(async function () {
    const user = await API.profile();
    if (!user.data) {
        alert('未登录或登录已失效,请重新登录');
        location.href = './login.html';
        return;
    }
    const doms = {
        aside: {
            nickname: $('.aside .nickname'),
            loginId: $('.aside .loginId')
        },
        chatContainer: $('.chat-history'),
        msgContainer: $('.msg-container'),
        msgIpt: $('.msg-container input'),
        closeBtn: $('.close')
    };

    setUserInfo();

    await renderChatHistory();

    // 发送消息
    doms.msgContainer.addEventListener('submit', async function (e) {
        e.preventDefault();

        const content = doms.msgIpt.value;

        if (!content) {
            return;
        }

        addChat({
            from: user.data.loginId,
            to: null,
            createdAt: Date.now(),
            content
        });
        scrollToBottom();
        doms.msgIpt.value = '';

        const resp = await API.sendChat(content);

        if (resp) {
            addChat({
                from: null,
                to: user.data.loginId,
                ...resp.data
            });
            scrollToBottom();
        }

    });

    // 退出登录
    doms.closeBtn.addEventListener('click', function () {
        API.loginOut();
        location.href = './index.html';
    });

    // 设置侧边栏个人信息
    function setUserInfo() {
        doms.aside.nickname.innerText = user.data.nickname;
        doms.aside.loginId.innerText = user.data.loginId;
    }

    // 渲染聊天记录
    async function renderChatHistory() {
        const resp = await API.getHistory();
        for (const chat of resp.data) {
            addChat(chat);
        }
        scrollToBottom();
    }

    // 将滚动条滚动到最底部
    function scrollToBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    /**
     * {
     *     from
     *     to
     *     content
     *     createdAt
     * }
     * @param chatInfo
     */
    function addChat(chatInfo) {
        const div = $$$('div');
        div.classList.add('chat-item');
        chatInfo.from && div.classList.add('user');
        const img = $$$('img');
        img.className = 'chat-img';
        img.src = `./asset/${chatInfo.from ? 'user': 'robot'}-avatar.jpeg`;
        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;
        const p = $$$('p');
        p.className = 'date';
        p.innerText = formatTime(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(p);
        doms.chatContainer.appendChild(div);
    }

    function formatTime(timeStamp) {
        const date = new Date(timeStamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = (date.getDay()).toString().padStart(2, '0');
        const hour = (date.getHours()).toString().padStart(2, '0');
        const minute = (date.getMinutes()).toString().padStart(2, '0');
        const second = (date.getSeconds()).toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
})();