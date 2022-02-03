class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";

        this.start();
    }

    start() {
        this.get_info();
    }

    register() { // 打开注册界面
    }

    login() { // 打开登录界面
    }

    get_info() {
        let outer = this;
        // 从服务器端获取信息
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result == "success") {
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide() {
    }

    show() {
    }
}
