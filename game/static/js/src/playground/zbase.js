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
