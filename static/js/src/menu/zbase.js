class AcGameMenu {
    constructor(root){
        this.root = root;
        this.usernames = null;
        this.scores = null;
        this.ranks = null;
        this.yourscore = null;
        this.yourtime = null;
        this.yourrank = null;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-title">
        O宇宙
    </div>

    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>

        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>

        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            设置
        </div>
        <br>

        <div class="ac-game-menu-field-item ac-game-menu-field-item-ranking">
            排行榜
        </div>
        <br>

        <div class="ac-game-menu-field-item ac-game-menu-field-item-logout">
            退出登录
        </div>
        <br>
    </div>

    <div class="ac-game-menu-single-mode-field">
        <div class="ac-game-menu-single-mode-field-item ac-game-menu-single-mode-field-item-fast-mode">
            快速模式
        </div>
        <br>

        <div class="ac-game-menu-single-mode-field-item ac-game-menu-single-mode-field-item-survival-mode">
            生存模式
        </div>
        <br>
    </div>

    <div class="ac-game-menu-ranking-field">
        <div class="ac-game-menu-ranking-field-item ac-game-menu-ranking-field-item-points">
            积分榜
        </div>
        <br>

        <div class="ac-game-menu-ranking-field-item ac-game-menu-ranking-field-item-time">
            生存时间榜
        </div>
        <br>
    </div>

    <div class="ac-game-menu-notes">
        <div class="ac-game-menu-notes-item ac-game-menu-notes-item-title">
            游戏说明
        </div>
        <br>

        <div class="ac-game-menu-notes-item ac-game-menu-notes-item-content">
            <p>1. 右键点击进行移动，左键释放技能 </p>
            <p>2. 多人模式[Enter]聊天，[Esc]退出 </p>

            <p>技能选择：</p>
            <p>1. a选择普攻</p>
            <p>2. q选择火球</p>
            <p>3. w选择冰球</p>
            <p>4. f选择闪现</p>
            <p>5. g进行治疗</p>
        </div>
        <br>
    </div>


    <div class="ac-game-ranking">
        <table class="ac-game-ranking-table ac-game-ranking-table-points"></table>

        <table class="ac-game-ranking-table ac-game-ranking-table-time"></table>
    </div>

    <div class="ac-game-ranking-selfdata">
    </div>

    <div class="ac-game-menu-esc">
        <div class="ac-game-menu-esc-item">
            返回菜单
        </div>
    </div>

</div>
`);
        this.$show_ranking = this.$menu.find(`.ac-game-ranking`);
        this.$menu.hide();
        this.$show_ranking.hide();
        this.root.$ac_game.append(this.$menu); // 将this.$menu存到divid为ac_game_12345678中

        this.$options = this.$menu.find(`.ac-game-menu-field`);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$single_mode_field = this.$menu.find(`.ac-game-menu-single-mode-field`);
        this.$fast_mode = this.$menu.find('.ac-game-menu-single-mode-field-item-fast-mode');
        this.$survival_mode = this.$menu.find(`.ac-game-menu-single-mode-field-item-survival-mode`);

        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.$ranking = this.$menu.find(`.ac-game-menu-field-item-ranking`);
        this.$logout = this.$menu.find(`.ac-game-menu-field-item-logout`);
        this.$notes = this.$menu.find(`.ac-game-menu-notes`);
        this.$ranking_field = this.$menu.find(`.ac-game-menu-ranking-field`);
        this.$ranking_field_points = this.$ranking_field.find(`.ac-game-menu-ranking-field-item-points`);
        this.$ranking_field_time = this.$ranking_field.find(`.ac-game-menu-ranking-field-item-time`);
        this.$esc_button = this.$menu.find(`.ac-game-menu-esc`);
        this.$selfdata = this.$menu.find(`.ac-game-ranking-selfdata`);
        this.$selfdata.hide();
        this.$esc_button.hide();
        this.$single_mode_field.hide();
        this.$ranking_field.hide();

        this.$ranking_table_points = this.$show_ranking.find(`.ac-game-ranking-table-points`);
        this.$ranking_table_time = this.$show_ranking.find(`.ac-game-ranking-table-time`);

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){ // click single mode
            outer.$options.hide();
            outer.$notes.hide();
            outer.$single_mode_field.show();
            outer.$esc_button.show();
        });
        this.$fast_mode.click(function() { // click fast mode
            outer.hide();
            outer.root.playground.show("fast mode");
        });
        this.$survival_mode.click(function() {
            outer.hide();
            outer.root.playground.show("survival mode");
        });
        this.$multi_mode.click(function(){ // click multi mode
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$ranking.click(function() {
            outer.$options.hide();
            outer.$notes.hide();
            outer.$esc_button.show();
            outer.$ranking_field.show();
        });
        this.$ranking_field_points.click(function() {
            outer.$ranking_field.hide();
            outer.$esc_button.show();
            outer.getinfo_ranking_points();
        });
        this.$ranking_field_time.click(function() {
            outer.$ranking_field.hide();
            outer.$esc_button.show();
            outer.getinfo_ranking_time();
        });
        this.$logout.click(function(){ // click logout
            outer.root.settings.logout_on_remote();
        });
        this.$settings.click(function() { // click settings
            outer.$options.hide();
            outer.$notes.hide();
            outer.$esc_button.show();
        });
        this.$esc_button.click(function() { // click esc_button
            outer.$options.show();
            outer.$notes.show();
            outer.$esc_button.hide();
            outer.$show_ranking.hide();
            outer.$single_mode_field.hide();
            outer.$ranking_field.hide();
            outer.$ranking_table_points.empty();
            outer.$ranking_table_time.empty();
            outer.$selfdata.empty();
            outer.$selfdata.hide();
        });
    }

    render_row_item(content) {
        return $(`<td>${content}</td>`);
    }

    render_ranking_time() {
        this.ranks = [];
        this.ranks[0] = 1;
        for (let i = 1; i < this.usernames.length; ++ i) {
            if (this.times[i] == this.times[i - 1]) this.ranks[i] = this.ranks[i - 1];
            else this.ranks[i] = i + 1;
        }
        this.$ranking_table_time.append(`
        <tr>
            <th>排名</th>
            <th>用户名</th>
            <th>生存时间</th>
        </tr>
`);
        let yourrk = -1;
        for (let i = 0; i < this.usernames.length; ++ i) {
            let $row = $(`<tr></tr>`);
            let username = this.usernames[i];
            let time = this.times[i];
            let rk = this.ranks[i];
            if (username == this.root.settings.username)
                yourrk = rk;
            let c = this.render_row_item(`${rk}`);
            let a = this.render_row_item(`${username}`);
            let b = this.render_row_item(`${time}s`);
            $row.append(c);
            $row.append(a);
            $row.append(b);
            this.$ranking_table_time.append($row);
        }
        this.$selfdata.append(this.render_yourtime(yourrk, this.yourtime));
        this.$selfdata.show();
    }

    getinfo_ranking_time() {
        let outer = this;
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: "ranking_time",
                username: outer.root.settings.username,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    outer.usernames = resp.usernames;
                    outer.times = resp.times;
                    outer.yourtime = resp.time;
                    outer.render_ranking_time();
                    outer.$show_ranking.show();
                }
            }
        });
    }

    render_yourscore(rk, sc) {
        if (rk == -1) return $(`<p>你的积分是${sc}, 暂未入榜~</p>`);
        else return $(`<p>你的积分是${sc}, 排名第${rk}!</p>`);
    }

    render_yourtime(rk, tm) {
        if (rk == -1) return $(`<p>你的最长生存时间是${tm}s, 暂未入榜~</p>`);
        else return $(`<p>你的最长生存时间是${tm}s, 排名第${rk}!</p>`);
    }

    render_ranking_points() {
        this.ranks = [];
        this.ranks[0] = 1;
        for (let i = 1; i < this.scores.length; ++ i) {
            if (this.scores[i] == this.scores[i - 1]) this.ranks[i] = this.ranks[i - 1];
            else this.ranks[i] = i + 1;
        }
        this.$ranking_table_points.append(`
        <tr>
            <th>排名</th>
            <th>用户名</th>
            <th>积分</th>
        </tr>
`);

        let yourrk = -1;
        for (let i = 0; i < this.usernames.length; ++ i) {
            let $row = $(`<tr></tr>`);
            let username = this.usernames[i];
            let score = this.scores[i];
            let rk = this.ranks[i];
            if (username == this.root.settings.username)
                yourrk = rk;
            let c = this.render_row_item(`${rk}`);
            let a = this.render_row_item(`${username}`);
            let b = this.render_row_item(`${score}`);
            $row.append(c);
            $row.append(a);
            $row.append(b);
            this.$ranking_table_points.append($row);
        }

        this.$selfdata.append(this.render_yourscore(yourrk, this.yourscore));
        this.$selfdata.show();
    }

    getinfo_ranking_points() {
        let outer = this;
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: "ranking_points",
                username: outer.root.settings.username,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    outer.usernames = resp.usernames;
                    outer.scores = resp.scores;
                    outer.yourscore = resp.score;
                    outer.render_ranking_points();
                    outer.$show_ranking.show();
                }
            }
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}
