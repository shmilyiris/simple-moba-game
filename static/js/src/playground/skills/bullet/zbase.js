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
