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
