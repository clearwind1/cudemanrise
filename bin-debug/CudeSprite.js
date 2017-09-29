var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 方块类
 */
var CudeSprite = (function (_super) {
    __extends(CudeSprite, _super);
    function CudeSprite() {
        var _this = _super.call(this) || this;
        _this.position = { x: 0, y: 0 };
        _this.color = 0xffffff;
        _this.size = 40;
        return _this;
    }
    CudeSprite.prototype.init = function (pos, framecolor, color, size, totallife, bcanfire, power) {
        this.roundframe = new egret.Shape();
        this.addChild(this.roundframe);
        this.soildcude = new egret.Shape();
        this.addChild(this.soildcude);
        this.position = pos;
        this.framecolor = framecolor;
        this.color = color;
        this.size = size;
        this.totallife = totallife;
        this.currlife = totallife;
        this.bcanfire = bcanfire;
        this.power = power;
        this.show();
    };
    CudeSprite.prototype.show = function () {
        this.drawframe();
        this.updatalife();
        this.setPosition(this.position);
    };
    //设置位置
    CudeSprite.prototype.setPosition = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    };
    //设置大小
    CudeSprite.prototype.setSize = function (size) {
        this.size = size;
        this.drawframe();
        this.updatalife();
    };
    //获取大小
    CudeSprite.prototype.getSize = function () {
        return this.size;
    };
    //设置当前生命值 
    CudeSprite.prototype.setLife = function (life) {
        this.currlife = life < 0 ? 0 : life;
        this.updatalife();
    };
    //获取当前生命值 
    CudeSprite.prototype.getLife = function () {
        return this.currlife;
    };
    //开火
    CudeSprite.prototype.fire = function () {
    };
    //设置攻击力
    CudeSprite.prototype.setPower = function (power) {
        this.power = power;
    };
    //获取攻击力
    CudeSprite.prototype.getPower = function () {
        return this.power;
    };
    //画外框
    CudeSprite.prototype.drawframe = function () {
        this.roundframe.graphics.clear();
        this.roundframe.graphics.beginFill(0xd758e2, 1);
        this.roundframe.graphics.lineStyle(2, this.framecolor);
        var linepos = [{ s: 0, e: 0 }, { s: this.size + 2, e: 0 }, { s: this.size + 2, e: this.size + 2 }, { s: 0, e: this.size + 2 }, { s: 0, e: 0 }];
        for (var i = 0; i < 4; i++) {
            this.roundframe.graphics.moveTo(linepos[i].s, linepos[i].e);
            this.roundframe.graphics.lineTo(linepos[i + 1].s, linepos[i + 1].e);
        }
        this.roundframe.graphics.endFill();
    };
    //画实体
    CudeSprite.prototype.updatalife = function () {
        this.soildcude.graphics.clear();
        this.soildcude.graphics.beginFill(this.color, 1);
        this.soildcude.graphics.drawRect(1, 1, this.size * (this.currlife / this.totallife), this.size);
        this.soildcude.graphics.endFill();
    };
    CudeSprite.prototype.light = function () {
        GameUtil.light(this.roundframe, this.color);
    };
    return CudeSprite;
}(egret.Sprite));
__reflect(CudeSprite.prototype, "CudeSprite");
/**
 * 角色类
 */
var CudeMan = (function (_super) {
    __extends(CudeMan, _super);
    function CudeMan() {
        var _this = _super.call(this) || this;
        _this.benterdanger = false;
        return _this;
    }
    //检测生命区域
    CudeMan.prototype.start = function () {
        this.interval = GameUtil.setInterval(this.checklifeare, this, 500);
    };
    CudeMan.prototype.checklifeare = function () {
        if (GameData._i().GameOver) {
            egret.clearInterval(this.interval);
            return true;
        }
        if (this.y < GameConfig.getSH() - GameConfig.OFFY) {
            if (!this.benterdanger) {
                this.benterdanger = true;
            }
            this.offLife(1);
        }
        else {
            if (this.benterdanger) {
                this.benterdanger = false;
            }
        }
    };
    CudeMan.prototype.setTotalLife = function (totalLife) {
        this.totallife = totalLife;
    };
    CudeMan.prototype.getTotalLife = function () {
        return this.totallife;
    };
    CudeMan.prototype.offLife = function (power) {
        var life = this.getLife() - power;
        this.setLife(life);
        if (life <= 0) {
            this.die();
        }
    };
    //发射子弹
    CudeMan.prototype.fire = function () {
        var _this = this;
        if (this.bcanfire) {
            this.bcanfire = false;
            egret.setTimeout(function () { _this.bcanfire = true; }, this, 500);
            this.createbullet(0, { x: 40, y: 0 }, this.power);
        }
    };
    CudeMan.prototype.createbullet = function (type, dir, power) {
        var bullet = new BulletSprite(type, dir, power);
        bullet.x = this.x + this.size;
        bullet.y = this.y + this.size / 2;
        this.parent.bulletcontain.addChild(bullet);
    };
    CudeMan.prototype.die = function () {
        //console.log('life====', this.currlife);
        this.benterdanger = false;
        this.parent.gameover();
    };
    return CudeMan;
}(CudeSprite));
__reflect(CudeMan.prototype, "CudeMan");
/**
 * 敌人类
 */
var CudeEnemy = (function (_super) {
    __extends(CudeEnemy, _super);
    function CudeEnemy(type) {
        var _this = _super.call(this) || this;
        var speed = [15, 18, 25, 30];
        var score = [10, 15, 35, 80];
        _this.speed = speed[type];
        _this.score = score[type];
        _this.run();
        return _this;
    }
    CudeEnemy.prototype.run = function () {
        var _this = this;
        this.inter = GameUtil.setInterval(function () {
            if (GameData._i().GameOver) {
                egret.clearInterval(_this.inter);
                return;
            }
            _this.x -= _this.speed;
            var gamescene = (_this.parent.parent);
            for (var i = 0; i < gamescene.bulletcontain.numChildren; i++) {
                var bullet = gamescene.bulletcontain.getChildAt(i);
                if (_this && GameUtil.getrect(bullet).intersects(GameUtil.getrect(_this, _this.size / 2, _this.size / 2))) {
                    _this.offlife(bullet.getPower());
                    bullet.die();
                    break;
                }
            }
            var cudemanrect = new egret.Rectangle(gamescene.cudeman.x, gamescene.cudeman.y, gamescene.cudeman.getSize(), gamescene.cudeman.getSize());
            if (_this && cudemanrect.intersects(GameUtil.getrect(_this, _this.size / 2, _this.size / 2))) {
                var life = gamescene.cudeman.getLife() - 1;
                gamescene.cudeman.offLife(1);
                _this.die();
            }
            if (_this.x <= -_this.size + 5 || _this.y > GameConfig.getSH() + 5 || _this.y < -5) {
                _this.die();
            }
        }, this, 100);
    };
    CudeEnemy.prototype.offlife = function (power) {
        this.currlife -= power;
        this.setLife(this.currlife);
        if (this.currlife <= 0) {
            GameData._i().GameScore += this.score;
            GameScore._i().updatascore();
            this.die();
        }
    };
    CudeEnemy.prototype.die = function () {
        egret.clearInterval(this.inter);
        this.parent.removeChild(this);
    };
    return CudeEnemy;
}(CudeSprite));
__reflect(CudeEnemy.prototype, "CudeEnemy");
