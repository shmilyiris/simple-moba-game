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
