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
