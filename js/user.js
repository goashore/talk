class FieldValidator {
    constructor(target, validateFunc) {
        // 当前要验证的文本框
        this.input = $(target);
        // 错误提示匹配
        this.p = this.input.nextElementSibling;
        // 验证规则
        this.validateFunc = validateFunc;
        this.input.onblur = () => {
            this.validate()
        }
    }
    // 验证,成功则返回true, 失败则返回false
    async validate() {
        const resp = await this.validateFunc(this.input.value);
        if (resp) {
            this.p.innerText = resp;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    // 对传入的所有验证器进行统一验证,全部成功,则返回true, 否则返回false
    static async validate(...validators) {
        const proms = validators.map(v => v.validate());
        const result = await Promise.all(proms);
        return result.every(r => r);
    }
}
