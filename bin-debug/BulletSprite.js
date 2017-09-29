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
 * 子弹类
 */
var BulletSprite = (function (_super) {
    __extends(BulletSprite, _super);
    function BulletSprite(type, dir, power) {
        var _this = _super.call(this) || this;
        _this.init(type, dir, power);
        _this.draw();
        _this.start();
        return _this;
    }
    BulletSprite.prototype.init = function (type, dir, power) {
        this.bullettype = type;
        this.bulletdir = dir;
        this.power = power;
    };
    BulletSprite.prototype.draw = function () {
        this.graphics.beginFill(0xb4becb);
        this.graphics.drawCircle(0, 0, 10);
        this.graphics.endFill();
    };
    BulletSprite.prototype.start = function () {
        var _this = this;
        this.inter = GameUtil.setInterval(function () {
            if (GameData._i().GameOver) {
                egret.clearInterval(_this.inter);
                return;
            }
            _this.x += _this.bulletdir.x;
            _this.y += _this.bulletdir.y;
            if (_this.x > GameConfig.getSW() + 20 || _this.x < -20 || _this.y < -20 || _this.y > GameConfig.getSH() + 20) {
                _this.die();
            }
        }, this, 100);
    };
    BulletSprite.prototype.die = function () {
        egret.clearInterval(this.inter);
        this.parent.removeChild(this);
    };
    BulletSprite.prototype.getPower = function () {
        return this.power;
    };
    return BulletSprite;
}(egret.Shape));
__reflect(BulletSprite.prototype, "BulletSprite");
