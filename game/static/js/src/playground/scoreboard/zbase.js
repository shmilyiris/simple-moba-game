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
