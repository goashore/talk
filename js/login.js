(async function () {
    const loginIdValidate = new FieldValidator('#loginId', async function (val) {
        if (!val) {
            return '请填写账号'
        }
    });

    const loginPwdValidate = new FieldValidator('#loginPwd', function (val) {
        if (!val) {
            return '请填写密码'
        }
    });

    const form = $('.form-container');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const resp = await FieldValidator.validate(loginIdValidate, loginPwdValidate);

        if (!resp) {
            return;
        }
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const result = await API.login(data);
        if (result.code === 0) {
            //    成功
            alert('登录成功,点击跳转到首页');
            location.href = './index.html';
        } else {
            //    失败
            loginIdValidate.p.innerText = '账号或密码错误';
            loginPwdValidate.input.value = '';
        }
    })
})();