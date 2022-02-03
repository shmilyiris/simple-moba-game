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
