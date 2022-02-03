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
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor(id) {
        AC_GAME_OBJECTS.push(this); // 每一个创建的对象都存储到全局的数组中
        this.has_called_start = false; // 标记是否执行过start函数
        this.timedelta = 0; // 当前帧距离上一帧的毫秒数
        this.uuid = this.create_uuid();
    }

    create_uuid() { // 创建唯一编号，8位数
        let res = "";
        for (let i = 0; i < 8; ++ i) {
            let x = parseInt(Math.floor( Math.random() * 10 )); // 返回[0, 1)的随机数
            res += x;
        }
        return res;
    }

    start() { // 只会在第一帧执行一次
    }

    update() { // 每一帧均会执行一次
    }

    late_update() { // 每一帧最后执行的内容
    }

    on_destroy() { // 被删之前执行一次
    }

    destroy() { // 删掉该物体
        this.on_destroy();
        for (let i = 0; i < AC_GAME_OBJECTS.length; ++ i) {
            if (AC_GAME_OBJECTS[i] == this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp; // 上一帧的时间戳

// 传入当前帧的时间戳
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; ++ i) {
        let obj = AC_GAME_OBJECTS[i];
        if (obj.has_called_start == false) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for (let i = 0; i < AC_GAME_OBJECTS.length; ++ i) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION); // 请求动画帧
class ChatField {
    constructor(playground) {
        this.playground = playground;
        this.$history = $(`<div class="ac-game-chat-field-history"><</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
    }


    add_listening_events() {
        let outer = this;

        this.$input.keydown(function(e) {
            if (e.which == 27) { // Esc
                outer.hide_input();
                return false;
            } else if (e.which == 13) { // Enter
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();

                if (text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text);
                }
                return false;
            }
        });
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history() {
        let outer = this;
        this.$history.fadeIn();

        if (this.func_id) clearTimeout(this.func_id); // 根据函数id删除

        this.func_id = setTimeout(function() {
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000);
    }

    show_input() {
        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }

}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d'); // 主要操作canvas的context
        this.ctx.canvas.height = this.playground.height;
        this.ctx.canvas.width = this.playground.width;
        this.playground.$playground.append(this.$canvas);
        this.background_color_choices = [
            "black", 
            "rgba(89, 88, 88)", // light grey
            "rgba(0, 75, 143)", // deep blue
        ];
        this.background_color = this.background_color_choices[0];

    //    this.start();
    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = this.background_color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = this.background_color ;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = null;

        if (this.playground.state === "waiting") {
            this.text = "已就绪：0人";
        } else if (this.playground.state === "preparing") {
            this.text = "你还有3s时间选择位置";
        }
    }

    start() {
    }

    write(text) {
        this.text = text;
    }
    update() {
        this.render();
    }

    render() {
        this.ctx.front = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length, father, type) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 1;
        this.father = father;
        this.type = type;
        this.eps = 0.01;

    }

    start() {
    }

    update() {
        if (this.type === "tail" && this.father.exist == false) {
            this.move_length = 0;
        }
        if (this.move_length < this.eps || this.speed < this.eps) {
            // 如果目标移动距离或当前距离为0，删除
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        let scale = this.playground.scale;

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.tox = null;
        this.toy = null;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.radius = radius;
        this.hp = 100; // 血量值
        this.ap = 100; // 体力值
        this.color = color;
        this.score = 0; // 本局得分初始值

        this.speed = speed;
        this.pre_speed = speed; // 原生速度
        this.up_ratio = 2.5; // 加速倍数
        this.freeze_ratio = 0.7; // 冻伤后速度下降倍数

        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01;
        this.spend_time = 0;
        this.cur_skill = null; // player当前持有的技能
        this.friction = 0.75; // 被攻击后的摩擦力效果指数
        this.min_radius = 0.4 * radius; // 死亡前的最小半径
        this.max_radius = radius;
        this.min_ap = 15; // 能够加速的最小体力

        this.is_speed_up = false;
        this.is_freezing = false;
        this.is_dizzy = false;
        this.is_moving = false;

        this.bullets = []; // 存储普攻的子弹
        this.fireballs = []; // 存储火球
        this.iceballs = []; // 存储冰球
        this.lightnings = []; // 存储闪电

        if (this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }

        this.skills_list = ["shoot", "fireball", "iceball", "blink", "cure"];
        this.skills = {
            "shoot": {
                "name": "shoot",
                "cold_time": 0,
                "cur_time": 0,
                "img_src": "https://app636.acapp.acwing.com.cn/static/image/playground/bullet.png",
                "img": null,
                "keypos": 65, // a
                "damage": 0.02,
                "r": 0.007,
                "color": "rgba(217,217,217, 1)",
                "speed": 0.58,
                "move_length": 0.6,
            },
            "fireball": {
                "name": "fireball",
                "cold_time": 8,
                "cur_time": 8,
                "img_src": "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png",
                "img": null,
                "keypos": 81, // q
                "damage": 0.15,
                "r": 0.013,
                "color": 'orange',
                "speed": 0.70,
                "move_length": 1.25,
            },
            "iceball": {
                "name": "iceball",
                "cold_time": 8,
                "cur_time": 8,
                "img_src": "https://app636.acapp.acwing.com.cn/static/image/playground/ice.png",
                "img": null,
                "keypos": 87, // w
                "damage": 0.06,
                "r": 0.010,
                "color": 'rgba(101,159,255, 0.6)',
                "speed": 0.45,
                "move_length": 1,
            },
            "blink": {
                "name": "blink",
                "cold_time": 10,
                "cur_time": 10,
                "img_src": "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png",
                "img": null,
                "keypos": 70, // f
                "max_dist": 0.45,
            },
            "cure": {
                "name": "cure",
                "cold_time": 12,
                "cur_time": 12,
                "img_src": "https://app636.acapp.acwing.com.cn/static/image/playground/cure.jpg",
                "img": null,
                "keypos": 71, // g
                "prob": [0, 0.75, 0.94, 0.97, 0.99, 1.00], // %75, %19, %3, %2, 1%
                "value": [0, 10, 20, 30, 50, 100],
            },
        };

        if (this.character === "me") {
            for (let i = 0; i < this.skills_list.length; ++ i) {
                let name = this.skills_list[i];
                this.skills[name].img = new Image();
                this.skills[name].img.src = this.skills[name].img_src;
            }
            this.cur_skill = "shoot";
        }
    } 

    start() {
        if (this.playground.mode === "multi mode")
            this.playground.player_count ++;

        this.playground.notice_board.write("已就绪：" + this.playground.player_count + "人");

        if (this.playground.player_count >= 3) {
            this.playground.state = "preparing";
        }

        if (this.character === "me") {
            this.add_listening_events();
        } else if (this.character === "robot") {
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false; // 禁用contextmenu事件(鼠标右键点击出现的表单)
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (outer.playground.state === "waiting")
                return false;
            // 获取窗口大小
            const rect = outer.ctx.canvas.getBoundingClientRect();
            let clickPos_x = e.clientX - rect.left;
            let clickPos_y = e.clientY - rect.top;
            let tx = clickPos_x / outer.playground.scale;
            let ty = clickPos_y / outer.playground.scale;
            if (e.which == 3) {
                // 鼠标右键
                outer.move_to(tx, ty);
                outer.is_moving = true;

                if (outer.character === "me") {
                    outer.rendering_move_to = true;
                    outer.rendering_move_to_start = outer.spend_time;
                    outer.render_move_circle = 0;
                    outer.tox = tx;
                    outer.toy = ty;
                }

                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            } else if (e.which == 1) {
                // 鼠标左键
                if (outer.hp < outer.eps) return false;
                if (outer.cur_skill === "fireball") {
                    if (outer.skills.fireball.cur_time > outer.eps)
                        return false;
                    let fireball = outer.shoot_fireball(tx, ty);

                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
                } else if (outer.cur_skill === "blink") {
                    if (outer.skills.blink.cur_time > outer.eps)
                        return false;
                    outer.blink(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_blink(tx, ty);
                    }
                } else if (outer.cur_skill === "shoot") {
                    if (outer.playground.state === "preparing")
                        return false;
                    let bullet = outer.shoot_bullet(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_bullet(tx, ty, bullet.uuid);
                    }
                } else if (outer.cur_skill === "iceball") {
                    if (outer.skills.iceball.cur_time > outer.eps)
                        return false;
                    let iceball = outer.shoot_iceball(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_iceball(tx, ty, iceball.uuid);
                    }
                }
            }
        });

        this.playground.game_map.$canvas.keydown(function(e) {
            if (e.which == 13) { // Enter: 打开对话框
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.show_input();
                    return false;
                }
            } else if (e.which == 27) { // Esc: 退出对话
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.hide_input();
                }
            }


            if (outer.playground.state !== "fighting" || outer.hp < outer.eps) {
                return true;
            }
            if (e.which == outer.skills.fireball.keypos) {
                // q: 发射火球
                if (outer.skills.fireball.cur_time > outer.eps) {
                    return true;
                }

                outer.cur_skill = "fireball";
                // return false;
            } else if (e.which == outer.skills.blink.keypos) {
                // f: 闪现
                if (outer.skills.blink.cur_time > outer.eps) {
                    return true;
                }

                outer.cur_skill = "blink";
                // return false;
            } else if (e.which == outer.skills.iceball.keypos) {
                // w: 冰球
                if (outer.skills.iceball.cur_time > outer.eps)
                    return true;

                outer.cur_skill = "iceball";
                // return false;
            } else if (e.which == outer.skills.shoot.keypos) {
                // a: 普攻

                outer.cur_skill = "shoot";
            } else if (e.which == 32) {
                // 空格：加速
                if (outer.ap < outer.eps + outer.min_ap || !outer.is_moving) { // 体力值太小 或 玩家不移动时 不加速
                    outer.speednotup();
                    return true;
                }
                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_speedup();
                }

                outer.speedup();
            } else if (e.which == outer.skills.cure.keypos) {
                if (outer.skills.cure.cur_time > outer.eps)
                    return true;

                let val = outer.cure(null);
                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_cure(val);
                }

            }
        });

        this.playground.game_map.$canvas.keyup(function(e) {
            if (outer.playground.state !== "fighting" || outer.hp < outer.eps) {
                return true;
            }

            if (e.which == 32) {
                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_speednotup();
                }
                outer.speednotup();
            }
        });
    }

    speedup() {
        this.is_speed_up = true;
        this.speed = this.pre_speed * this.up_ratio;
        if (this.is_freezing) this.speed *= this.freeze_ratio;
    }

    speednotup() {
        this.is_speed_up = false;
        this.speed = this.pre_speed;
        if (this.is_freezing) this.speed *= this.freeze_ratio;
    }

    cure(given_val) {
        this.rendering_cure = true;
        this.rendering_cure_start = this.spend_time;

        var val;
        if (given_val != null) val = given_val;
        else {
            let rd = Math.random();
            let i = 1;
            for (; i < this.skills.cure.prob.length; ++ i) {
                let a = this.skills.cure.prob[i - 1], b = this.skills.cure.prob[i];
                if (rd >= a && rd < b) {
                    break;
                }
            }
            val = this.skills.cure.value[i];
        }

        this.hp = Math.min(this.hp + val, 100);
        this.radius = this.min_radius + (this.max_radius - this.min_radius) * this.hp / 100;
        this.skills.cure.cur_time = this.skills.cure.cold_time;

        this.last_cure = val;

        return val;
    }


    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.skills.fireball.r;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = this.skills.fireball.color;
        let speed = this.skills.fireball.speed;
        let move_length = this.skills.fireball.move_length;
        let damage = this.skills.fireball.damage;
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.fireballs.push(fireball);
        let radius_particle = radius, speed_particle = speed, ml_particle = move_length;
        for (let i = 0; i < 3; ++ i) {
            radius_particle *= 0.5;
            speed_particle *= 0.95;
            ml_particle *= 0.6;
            new Particle(this.playground, x, y, radius_particle, vx, vy, color, speed_particle, ml_particle, fireball, "tail");
        }
        if (this.character === "me") {
            this.skills["fireball"].cur_time = this.skills["fireball"].cold_time;
            this.cur_skill = "shoot";
        }

        return fireball;
    }

    destroy_fireball(uuid) {
        for (let i = 0; i < this.fireballs.length; ++ i) {
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid) {
                fireball.destroy();
                break;
            }
        }
    }

    shoot_iceball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.skills.iceball.r;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = this.skills.iceball.color;
        let speed = this.skills.iceball.speed;
        let move_length = this.skills.iceball.move_length;
        let damage = this.skills.iceball.damage;
        let iceball = new IceBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.iceballs.push(iceball);

        if (this.character === "me") {
            this.skills["iceball"].cur_time = this.skills["iceball"].cold_time;
            this.cur_skill = "shoot";
        }

        return iceball;
    }

    destroy_iceball(uuid) {
        for (let i = 0; i < this.iceballs.length; ++ i) {
            let iceball = this.iceballs[i];
            if (iceball.uuid === uuid) {
                iceball.destroy();
                break;
            }
        }
    }


    shoot_bullet(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.skills.shoot.r;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = this.skills.shoot.color;
        let speed = this.skills.shoot.speed;
        let move_length = this.skills.shoot.move_length;
        let damage = this.skills.shoot.damage;
        let bullet = new Bullet(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.bullets.push(bullet);

        return bullet;
    }

    destroy_bullet(uuid) {
        for (let i = 0; i < this.bullets.length; ++ i) {
            let bullet = this.bullets[i];
            if (bullet.uuid === uuid) {
                bullet.destroy();
                break;
            }
        }
    }


    blink(tx, ty) {
        let dist = this.get_dist(this.x, this.y, tx, ty);
        dist = Math.min(dist, this.skills.blink.max_dist);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += dist * Math.cos(angle);
        this.y += dist * Math.sin(angle);

        if (this.character === "me") {
            this.skills["blink"].cur_time = this.skills["blink"].cold_time;
            this.cur_skill = "shoot";
        }
        this.move_length = 0; // 闪现后静止不动
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(tx, ty, this.x, this.y);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    create_blood(pre, rd) {
        for (let i = 0; i < pre + Math.random() * rd; ++ i) {
            // 产生碰撞粒子
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.2;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length, null, "blood");
        }
    }

    is_attacked(angle, damage, weapon_name, color) {
        // player沿着angle角度被攻击损失生命值damage
        this.radius -= damage * (this.max_radius - this.min_radius);
        this.hp = Math.round( 100 * (this.radius - this.min_radius) / (this.max_radius - this.min_radius) ); // 每次被攻击后更新hp值
        if (this.hp <= 0.00001) { // 玩家去世
            this.destroy();
            return false;
        }

        // 产生碰撞粒子
        if (weapon_name === "shoot") {
            this.create_blood(5, 5);
        } else if (weapon_name === "fireball") {
            this.create_blood(15, 15);
        }

        if (weapon_name !== "iceball") {
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = damage * 100 * this.max_radius; // 伤害状态初始速度
            if (weapon_name === "fireball") {
                this.is_freezing = false;
                this.speed = Math.max(this.speed, this.pre_speed); // 恢复原始速度
            }
        } else {
            this.is_freezing = true;
            this.speed = this.pre_speed * this.freeze_ratio; // 冰冻后速度减慢
        }
    }

    receive_attack_fireball(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage, this.skills.fireball.name, this.skills.fireball.color);
    }

    receive_attack_iceball(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_iceball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage, this.skills.iceball.name, this.skills.iceball.color);
    }

    receive_attack_bullet(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_bullet(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage, this.skills.shoot.name, this.skills.shoot.color);
    }

    get_attack_idx() {
        // 0.2的概率射击玩家，0.8的概率射击ai
        if (Math.random() < 0.2) return 0;
        else return Math.floor(Math.random() * (this.playground.players.length - 1)) + 1;
    }

    update_robot_attack() {
        let fireball_prob = 1 / 300;
        let shoot_prob = 1 / 200;
        let ice_prob = 1 / 600;
        let attack_allowed = true;
        if (attack_allowed) {
            if (this.character === "robot" && this.spend_time > 5 && Math.random() < fireball_prob) {
                // 每一帧有p的概率会有某个ai进行随机射击
                let player = this.playground.players[this.get_attack_idx()];
                let tx = player.x + this.speed * this.vx * this.timedelta / 1000 * 0.3;
                let ty = player.y + this.speed * this.vy * this.timedelta / 1000 * 0.3;

                this.shoot_fireball(tx, ty);
            }

            if (this.character === "robot" && this.spend_time > 5 && Math.random() < shoot_prob) {
                let player = this.playground.players[this.get_attack_idx()];
                let tx = player.x + this.speed * this.vx * this.timedelta / 1000 * 0.3;
                let ty = player.y + this.speed * this.vy * this.timedelta / 1000 * 0.3;

                this.shoot_bullet(tx, ty);
            }

            if (this.character === "robot" && this.spend_time > 5 && Math.random() < ice_prob) {
                let player = this.playground.players[this.get_attack_idx()];
                let tx = player.x + this.speed * this.vx * this.timedelta / 1000 * 0.3;
                let ty = player.y + this.speed * this.vy * this.timedelta / 1000 * 0.3;

                this.shoot_iceball(tx, ty);
            }
        }
    }

    update_move() { // 更新玩家的移动
        if (this.damage_speed > this.eps) {
            // 被攻击后原速度归零，将由damage_x和damage_y接管
            this.vx = this.vy = 0;
            this.move_length = 0;
            // 伤害状态下的动画更新：
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            // 否则逻辑不变
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "me") {
                    this.is_moving = false;
                }
                if (this.character === "robot") {
                    // ai object 随机选择一个位置进行移动
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000 ); // 每帧应该移动的距离
                let dx = this.vx * moved;
                let dy = this.vy * moved;
                this.x += dx;
                this.y += dy;
                this.move_length -= moved;
            }
        }

    }
    update_coldtime() {
        for (let i = 0; i < this.skills_list.length; ++ i) {
            let name = this.skills_list[i];
            this.skills[name].cur_time -= this.timedelta / 1000;
            this.skills[name].cur_time = Math.max(this.skills[name].cur_time, 0);
        }
    }


    update() {
        if (this.playground.state === "preparing" || this.playground.state === "fighting") {
            this.spend_time += this.timedelta / 1000;
            if (this.character === "me") {
                this.playground.spend_time += this.timedelta / 1000;
            }
            if (this.playground.state === "fighting") {
                // 更新体力值
                if (this.is_speed_up) {
                    this.ap -= 1;
                } else {
                    this.ap += 0.066;
                }
                this.ap = Math.max(0, this.ap);
                this.ap = Math.min(100, this.ap);

                // 更新血量值
                this.hp = Math.round( 100 * (this.radius - this.min_radius) / (this.max_radius - this.min_radius) );

                // 更新胜利
                if (this.character === "me" && this.playground.players.length == 1) {
                    this.playground.state = "over";
                    if (this.playground.mode === "fast mode")
                        this.playground.sps.send_modify_score(this.username, 10);
                    this.playground.notice_board.destroy();
                    this.playground.notice_board = null;
                    this.playground.score_board.win();
                }
            }
        }
        // 更新血量值
        if (this.playground.state != "over") {
            if (this.playground.state === "waiting") {
                this.playground.notice_board.write("已就绪" + this.playground.player_count + "人");
            } else if (this.playground.spend_time < 3) {
                this.playground.state = "preparing";
                this.playground.notice_board.write("你还有" + Math.floor(4 - this.playground.spend_time) + "s时间选择位置");
            } else {
                this.playground.state = "fighting";
                if (this.playground.mode === "fast mode")
                    this.playground.notice_board.write("Fighting!!");
                else if (this.playground.mode === "survival mode")
                    this.playground.notice_board.write("你已经生存了" + Math.round(this.playground.spend_time) + "s");
            }
            if (this.character == "me" && this.playground.state === "fighting") {
                this.update_coldtime();
            }

            if (this.playground.mode === "survival mode") {
                if (this.playground.players.length < this.playground.num_of_enemies + 1) { // 生存模式不断补充敌人
                    for (let i = 0; i < this.playground.num_of_enemies + 1 - this.playground.players.length; ++ i) {
                        this.playground.players.push(
                            new Player(this.playground, this.playground.width / 2 / this.playground.scale, 0.5, 0.05, this.playground.enemies_colors[Math.floor(Math.random() * this.playground.enemies_colors.length)], 0.15, "robot")
                        );
                    }
                }
            }
            this.update_robot_attack();
            this.update_move();
            this.render();
        }
    }

    on_destroy() {
        if (this.character === "me") {
            if (this.playground.state === "fighting") {
                this.playground.state = "over";
                this.playground.notice_board.destroy();
                this.playground.notice_board = null;
                if (this.playground.mode === "fast mode") {
                    this.playground.sps.send_modify_score(this.username, -5);
                    this.playground.score_board.lose();
                } else if (this.playground.mode === "survival mode") {
                    this.playground.sps.send_modify_time(this.username, this.spend_time);
                    this.playground.score_board.survive_lose(this.spend_time);
                }
            }
        }
        for (let i = 0; i < this.playground.players.length; ++ i) {
            if (this.playground.players[i] == this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }

    render_move_to(x, y) {
        let scale = this.playground.scale;
        let dr = 0.001, maxr = 0.04;

        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, this.render_move_circle * scale, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = maxr / 15 * scale;
        this.ctx.strokeStyle = "grey";
        this.ctx.stroke();

        this.render_move_circle += dr;
        if (this.render_move_circle > maxr) this.render_move_circle = 0;
    }

    render_cure(x, y, rt) {
        let scale = this.playground.scale;

        this.ctx.save();

        let ratio = (this.spend_time - this.rendering_cure_start) / rt;
        this.ctx.font = 0.02 * scale + "px bold serif";
        this.ctx.fillStyle = "rgba(120, 255, 7, " + (1 - ratio)  + ")";
        this.ctx.textAlign = "center";
        this.ctx.fillText("+" + this.last_cure, x * scale, (y - 0.05 - 0.04 * ratio) * scale);

        this.ctx.restore();
    }

    render_skill_coldtime() {
        let scale = this.playground.scale;
        let select_ratio = 1.23;
        let select_color = "rgba(64,225,0, 1)";
        let cold_time_color = "rgba(0,0,255, 0.6)";
        let x = 1.68, dx = 0.08, y = 0.9, r = 0.03;
        for (let i = 0; i < this.skills_list.length; ++ i) {
            let name = this.skills_list[i];
            // 画选中框
            if (this.skills[name].cur_time <= this.eps && this.cur_skill === name) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(x * scale, y * scale, r * select_ratio * scale, 0, Math.PI * 2, false);
                this.ctx.fillStyle = select_color;
                this.ctx.fill();
                this.ctx.restore();
            }

            // 画图标
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.skills[name].img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
            this.ctx.restore();

            // 画冷却覆盖时间
            if (this.skills[name].cur_time > this.eps) {
                this.ctx.beginPath();
                this.ctx.moveTo(x * scale, y * scale);
                this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI * 0.5, Math.PI * 2 * (1 - this.skills[name].cur_time / this.skills[name].cold_time) - Math.PI * 0.5, true);
                this.ctx.moveTo(x * scale, y * scale);
                this.ctx.fillStyle = cold_time_color;
                this.ctx.fill();
            }

            x -= dx;
        }
    }

    render_hp_ap() {
        let scale = this.playground.scale;
        let start_pos = 1.47;
        let len = 0.23;
        let start_text = start_pos + len + 0.03;
        let start_hp_y = 0.05;
        let start_ap_y = 0.09;
        let line_w = 0.012;
        let font_w = 0.015;
        let hp_color = "rgba(255,69,69, 1)";
        let ap_color = "rgba(40,255,255, 1)";
        this.ctx.save();

        if (this.hp <= 20) {
            hp_color = "rgba(255,56,56, 1)"; // red
        } else if (this.hp <= 50) {
            hp_color = "rgba(237,171,72, 1)"; // yellow
        } else {
            hp_color = "rgba(129,255,75, 1)"; // green
        }

        // hp条
        this.ctx.beginPath();
        this.ctx.font = font_w * scale + "px bold serif";
        this.ctx.fillStyle = "rgba(255,255,255, 1)";
        this.ctx.textAlign = "center";
        this.ctx.fillText("血量值", (start_pos - font_w * 2) * scale, start_hp_y * scale);
        this.ctx.lineWidth = line_w * scale;
        this.ctx.strokeStyle = hp_color;
        this.ctx.lineTo(start_pos * scale, start_hp_y * scale);
        this.ctx.lineTo(start_pos * scale + this.hp / 100 * len * scale, start_hp_y * scale);
        this.ctx.stroke();
        this.ctx.font = font_w * scale + "2px bold serif";
        this.ctx.fillStyle = hp_color;
        this.ctx.fillText(Math.floor(this.hp), start_text * scale, start_hp_y * scale);
        this.ctx.closePath();

        // ap条
        this.ctx.beginPath();
        this.ctx.font = font_w * scale + "px bold serif";
        this.ctx.fillStyle = "rgba(255,255,255, 1)";
        this.ctx.textAlign = "center";
        this.ctx.fillText("体力值", (start_pos - font_w * 2) * scale, start_ap_y * scale);
        this.ctx.lineWidth = line_w * scale;
        this.ctx.strokeStyle = ap_color;
        this.ctx.lineTo(start_pos * scale, start_ap_y * scale);
        this.ctx.lineTo(start_pos * scale + this.ap / 100 * len * scale, start_ap_y * scale);
        this.ctx.stroke();
        this.ctx.font = font_w * scale + "2px bold serif";
        this.ctx.fillStyle = ap_color;
        this.ctx.fillText(Math.floor(this.ap), start_text * scale, start_ap_y * scale);
        this.ctx.closePath();

        this.ctx.restore();
    }

    render() {
        let scale = this.playground.scale;
        let x = this.x * scale, y = this.y * scale;

        // 画角色

        this.ctx.save();
        if (this.character !== "robot") {

            //this.ctx.beginPath();
            //this.ctx.arc(this.x * scale, this.y * scale, this.radius * 1.08 * scale, 0, Math.PI * 2, false);
            //this.ctx.fillStyle = "white";
            //this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

        this.ctx.restore();


        // 画玩家状态
        if (this.is_freezing) {
            // 画冻伤阴影
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = "rgba(0,96,255, 0.3)";
            this.ctx.fill();
        }

        if (this.playground.state === "fighting") {
            // 画血条
            let hp_color = null;

            if (this.character === "me") hp_color = "rgba(199,255,75, 1)";
            else hp_color = "red";

            this.ctx.beginPath();
            let diff = (100 - this.hp) / 100 * Math.PI * 2;
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * 1.2 * scale, 0, Math.PI * 2 - diff, false);
            this.ctx.lineWidth = 0.004 * scale;
            this.ctx.strokeStyle = hp_color;
            this.ctx.stroke();

            // 血量值
            this.ctx.font = 0.02 * scale + "px bold serif";
            this.ctx.fillStyle = hp_color;
            this.textAlign = "center";
            this.ctx.fillText(Math.floor(this.hp), x + this.radius * 1.6 * scale, y);
            this.ctx.restore();
        }



        if (this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime(); // 画技能冷却时间
            this.render_hp_ap(); // 画hp条和ap条
        }
        // 画移动特效
        let move_time = 1;
        if (this.character === "me" && this.rendering_move_to && this.spend_time - this.rendering_move_to_start - move_time < this.eps) {
            this.render_move_to(this.tox, this.toy);
        }

        // 画治疗特效
        let render_cure_time = 0.8;
        if (this.character === "me" && this.rendering_cure && this.spend_time - this.rendering_cure_start - render_cure_time < this.eps) {
            this.render_cure(this.x, this.y, render_cure_time);
        }
    }
}
class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.final_state = null;
        this.time = null;

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png";
    }

    start() {
    }

    add_listening_events() {
        let outer = this;
        if (this.playground.game_map)
            this.playground.game_map.$canvas.on('click', function() {
                outer.playground.hide();
                outer.playground.root.menu.show();
            });
    }

    win() {
        this.final_state = "win";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.final_state = "lose";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    survive_lose(time) {
        this.final_state = "survive lose";
        this.time = Math.round(time);

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    late_update() {
        this.render();
    }

    render() {
        let len = this.playground.height / 2;
        let x = this.playground.width / 2 - len / 2;
        let y = this.playground.height / 2 - len / 2;
        if (this.final_state === "win") {
            this.ctx.drawImage(this.win_img, x, y, len, len);
        } else if (this.final_state === "lose") {
            this.ctx.drawImage(this.lose_img, x, y, len, len);
        } else if (this.final_state === "survive lose") {
            this.ctx.font = "bold 48px serif";
            this.ctx.fillStyle = "red";
            this.ctx.fillText("你坚持了" + this.time + "s，辛苦了！", this.playground.width / 2, this.playground.height / 2, this.playground.width / 3);
        }
    }
}
class Bullet extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.exist = true;

        this.name = "shoot";
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();
        if (this.player.character !== "enemy")
            this.update_attack();

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; ++ i) {
            // 枚举每一个player
            let player = this.playground.players[i];
            if (this.player != player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let dist = this.get_dist(player.x, player.y, this.x, this.y);
        if (dist < this.radius + player.radius) return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage, this.name, this.color);
        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack_bullet(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }


    render() {
        let scale = this.playground.scale;

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let bullets = this.player.bullets;
        this.exist = false;
        for (let i = 0; i < bullets.length; ++ i) {
            if (bullets[i] === this) { // 删除子弹之前，将其从player的fireballs中删除
                bullets.splice(i, 1);
                break;
            }
        }
    }
}
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.exist = true;

        this.name = "fireball";
        this.eps = 0.01;

    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();
        if (this.player.character !== "enemy")
            this.update_attack();
        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; ++ i) {
            // 枚举每一个player
            let player = this.playground.players[i];
            if (this.player != player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let dist = this.get_dist(player.x, player.y, this.x, this.y);
        if (dist < this.radius + player.radius) return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage, this.name, this.color);
        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack_fireball(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }


    render() {
        let scale = this.playground.scale;

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        this.exist = false;
        for (let i = 0; i < fireballs.length; ++ i) {
            if (fireballs[i] === this) { // 删除子弹之前，将其从player的fireballs中删除
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}
class IceBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.exist = true;

        this.name = "iceball";
        this.eps = 0.01;

    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();
        if (this.player.character !== "enemy")
            this.update_attack();
        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; ++ i) {
            // 枚举每一个player
            let player = this.playground.players[i];
            if (this.player != player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let dist = this.get_dist(player.x, player.y, this.x, this.y);
        if (dist < this.radius + player.radius) return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage, this.name, this.color);
        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack_iceball(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }


    render() {
        let scale = this.playground.scale;

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let iceballs = this.player.iceballs;
        this.exist = false;
        for (let i = 0; i < iceballs.length; ++ i) {
            if (iceballs[i] === this) { // 删除子弹之前，将其从player的iceballs中删除
                iceballs.splice(i, 1);
                break;
            }
        }
    }
}
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app636.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;
            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === "attack_fireball") {
                outer.receive_attack_fireball(uuid, data.victim_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "blink") {
                outer.receive_blink(uuid, data.tx, data.ty);
            } else if (event === "shoot_bullet") {
                outer.receive_shoot_bullet(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === "attack_bullet") {
                outer.receive_attack_bullet(uuid, data.victim_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "shoot_iceball") {
                outer.receive_shoot_iceball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === "attack_iceball") {
                outer.receive_attack_iceball(uuid, data.victim_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "speedup") {
                outer.receive_speedup(uuid);
            } else if (event === "speednotup") {
                outer.receive_speednotup(uuid);
            } else if (event === "cure") {
                outer.receive_cure(uuid, data.val);
            } else if (event === "message") {
                outer.receive_message(uuid, data.username, data.text);
            }
        };
    }

    get_player(uuid) { // 通过uuid返回对应player
        let players = this.playground.players;
        for (let i = 0; i < players.length; ++ i) {
            let player = players[i];
            if (player.uuid === uuid) return player;
        }
        return null;
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_message(username, text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(uuid, username, text) {
        this.playground.chat_field.add_message(username, text);
    }

    send_speedup() {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "speedup",
            'uuid': outer.uuid,
        }));
    }

    send_speednotup() {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "speednotup",
            'uuid': outer.uuid,
        }));
    }

    receive_speedup(uuid) {
        let player = this.get_player(uuid);
        if (player) player.speedup();
    }

    receive_speednotup(uuid) {
        let player = this.get_player(uuid);

        if (player) player.speednotup();
    }

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);

        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid, // uuid与当前窗口绑定
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_shoot_iceball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_iceball",
            'uuid': outer.uuid, // uuid与当前窗口绑定
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_iceball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let iceball = player.shoot_iceball(tx, ty);
            iceball.uuid = ball_uuid;
        }
    }

    send_shoot_bullet(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_bullet",
            "uuid": outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_bullet(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let bullet = player.shoot_bullet(tx, ty);
            bullet.uuid = ball_uuid;
        }
    }

    send_attack_fireball(victim_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack_fireball",
            'uuid': outer.uuid,
            'victim_uuid': victim_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack_fireball(uuid, victim_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let victim = this.get_player(victim_uuid);
        if (attacker && victim) {
            victim.receive_attack_fireball(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_attack_iceball(victim_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack_iceball",
            'uuid': outer.uuid,
            'victim_uuid': victim_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack_iceball(uuid, victim_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let victim = this.get_player(victim_uuid);
        if (attacker && victim) {
            victim.receive_attack_iceball(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_attack_bullet(victim_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack_bullet",
            'uuid': outer.uuid,
            'victim_uuid': victim_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack_bullet(uuid, victim_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let victim = this.get_player(victim_uuid);
        if (attacker && victim) {
            victim.receive_attack_bullet(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_blink(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }
    receive_blink(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if (player) {
            player.blink(tx, ty);
        }
    }

    send_cure(val) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "cure",
            'uuid': outer.uuid,
            'val': val,
        }));
    }

    receive_cure(uuid, val) {
        let player = this.get_player(uuid);
        if (player) player.cure(val);
    }
}
class SinglePlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app636.acapp.acwing.com.cn/wss/singleplayer/");
        this.start();
    }

    start() {
    }


    send_modify_score(username, score) {
        this.ws.send(JSON.stringify({
            'event': "modify_score",
            'username': username,
            'score': score,
        }));
    }

    send_modify_time(username, time) {
        this.ws.send(JSON.stringify({
            'event': "modify_time",
            'username': username,
            'time': time,
        }));
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.num_of_enemies = 7;
        this.spend_time = 0;
        this.enemies_colors = [
                "rgba(255,229,153, 1)", // light yellow
                "rgba(255,0,125, 1)", // light pink
                "rgba(131,85,247, 1)", // purple
                "rgba(255,51,51, 1)", // red
                "rgba(189,235,161, 1)" // light green
            ];

        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }


    start() {
        let outer = this;
        let uuid = this.create_uuid(); // 和窗口绑定的uuid
        $(window).on(`resize.${uuid}`, function() {
            outer.resize();
        });

        if (this.root.AcWingOS) {
            this.root.AcWingOS.api.window.on_close(function() {
                $(window).off(`resize.${uuid}`);
            });
        }
    }

    resize() {
        let width = this.$playground.width();
        let height = this.$playground.height();
        let unit = Math.min(width / 16, height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
    }


    show(mode) {
        this.$playground.show();
        let outer = this;


        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.game_map = new GameMap(this);

        this.mode = mode;
        this.notice_board = new NoticeBoard(this);
        this.score_board = new ScoreBoard(this);
        this.player_count = 0;

        this.resize();


        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo)); // 加入玩家
        if (mode === "fast mode") {
            this.state = "preparing";
            this.sps = new SinglePlayerSocket(this);

            // 生成敌人
            let colors = this.enemies_colors;
            for (let i = 0; i < this.num_of_enemies; ++ i) {
                this.players.push(
                    new Player(this, this.width / 2 / this.scale, 0.5, 0.05, colors[Math.floor(Math.random() * colors.length)], 0.15, "robot")
                );
            }
        } else if (mode === "multi mode") {
            this.state = "waiting";
            this.chat_field = new ChatField(this);

            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid; // 只使用创建对象的窗口的uuid

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        } else if (mode === "survival mode") {
            this.state = "preparing";

            this.sps = new SinglePlayerSocket(this);
            // 生成敌人
            let colors = this.enemies_colors;
            for (let i = 0; i < this.num_of_enemies; ++ i) {
                this.players.push(
                    new Player(this, this.width / 2 / this.scale, 0.5, 0.05, colors[Math.floor(Math.random() * colors.length)], 0.15, "robot")
                );
            }

        }

    }

    hide() {
        while (this.players && this.players.length > 0) {
            this.players[0].destroy();
        }

        if (this.notice_board) {
            this.notice_board.destroy();
            this.notice_board = null;
        }

        if (this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }
        this.spend_time = 0;
        this.$playground.empty();

        this.$playground.hide();
    }
}
class Music {
    constructor(root) {
        this.root = root;
        this.$bgm = $(`<audio id="global_music" src="https://app636.acapp.acwing.com.cn/static/audio/audio.mp3" autoplay='autoplay' loop='loop'></audio>`);
        this.$bgm.hide();

        this.root.$ac_game.append(this.$bgm);
        this.music = document.getElementById("global_music");
        document.querySelector('#global_music').volume = 0.8;
    }
}
class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";

        this.$settings = $(`
<div class="ac-game-settings">

    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>

        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>

        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>

        <div class="ac-game-settings-error-message">

        </div>

        <div class="ac-game-settings-option">
            注册
        </div>

        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app636.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>AcWing一键登录</div>
        </div>
    </div>



    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>

        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>

        <div class="ac-game-settings-error-message">
        </div>

        <div class="ac-game-settings-option">
            登录
        </div>

        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app636.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>AcWing一键登录</div>
        </div>
    </div>

</div>
        `);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");
        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$register.hide();

        this.$acwing_login = this.$settings.find(".ac-game-settings-acwing img");

        this.root.$ac_game.append(this.$settings);
        this.photo = "";
        this.start();
    }

    start() {
        if (this.platform === "WEB") {
            this.getinfo_web();
            this.add_listening_events();
        } else if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function() {
            outer.web_login();
        });
    }

    web_login() {
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function() {
            outer.register();
        });

        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;

        this.$register_login.click(function() {
            outer.login();
        });

        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }


    login_on_remote() { // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            },

        });
    }


    register_on_remote() { // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload(); // 刷新页面
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() { // 在远程服务器上登出
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            $.ajax({
                url: "https://app636.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() { // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }


    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;

        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });

    }


    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });

    }
    getinfo_web() {
        let outer = this;
        // 从服务器端获取信息
        $.ajax({
            url: "https://app636.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    // outer.root.menu.hide();
                    outer.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
export class AcGame {
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);

        this.AcWingOS = AcWingOS; // AcWingOS的接口集合，有参数则在acapp执行，否则在web端


        this.music = new Music(this);

        this.settings = new Settings(this);

        this.menu = new AcGameMenu(this);

        this.playground = new AcGamePlayground(this);

        this.start();
    }
    start() {
    }
}
