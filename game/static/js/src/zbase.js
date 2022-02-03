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
