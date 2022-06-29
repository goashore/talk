var API = (function () {
    const BASE_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    async function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers['authorization'] = localStorage.getItem(TOKEN_KEY);
        }

        return await fetch(BASE_URL + path, {headers})
    }

    async function post(path, bodyObj) {
        const headers = {
            "Content-Type": "application/json"
        };
        if (localStorage.getItem(TOKEN_KEY)) {
            headers['authorization'] = localStorage.getItem(TOKEN_KEY);
        }

        return await fetch(BASE_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        })
    }

    // 注册接口
    async function reg(userInfo) {
        return await post('/api/user/reg', userInfo).then(resp => resp.json());
    }


    // 登录接口
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo);
        const result = await resp.json();
        if (result.code === 0) {
            localStorage.setItem(TOKEN_KEY, `Bearer ${resp.headers.get('authorization')}`);
        }
        return result
    }

    // 验证账号是否存在
    async function exists(loginId) {
        return await get(`/api/user/exists?loginId=${loginId}`).then(resp => resp.json())
    }

    // 当前登录的用户信息
    async function profile() {
        return get('/api/user/profile').then(resp => resp.json())
    }

    // 发送消息
    async function sendChat(content) {
        return await post('/api/chat', {content}).then(resp => resp.json());
    }

    // 获取聊天记录
    async function getHistory() {
        return await get('/api/chat/history').then(resp => resp.json())
    }

    // 退出登录
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})();
