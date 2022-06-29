(async function () {
    const loginIdValidate = new FieldValidator('#loginId', async function (val) {
        if (!val) {
            return '账号不能为空'
        }

        const result = await API.exists(val);
        if (result.data) {
            return '账号已存在,请重新填写'
        }
    });

    const loginPwdValidate = new FieldValidator('#loginPwd', function (val) {
        if (!val) {
            return '密码不能为空'
        }
    });

    const nicknameValidate = new FieldValidator('#nickname', function (val) {
        if (!val) {
            return '昵称不能为空'
        }
    });

    const loginPwdConfirm = new FieldValidator('#loginPwdConfirm', function (val) {
        if (!val) {
            return '请再次输入密码'
        }
        if (val !== loginPwdValidate.input.value) {
            return '两次输入密码不一致'
        }
    });

    const form = $(".form-container");

    form.addEventListener('submit', async function (e) {
        // 阻止事件默认行为
        e.preventDefault();
        // 统一验证
        const resp = await FieldValidator.validate(loginIdValidate, nicknameValidate, loginPwdValidate, loginPwdConfirm);
        // 失败, 验证未通过
        if (!resp) {
            return;
        }
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const result = await API.reg(data);
        if (result.code === 0) {
            alert('恭喜你,注册成功');
            location.href = './login.html'
        }
    })
})();