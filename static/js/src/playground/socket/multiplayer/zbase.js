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
