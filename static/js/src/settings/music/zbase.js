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
