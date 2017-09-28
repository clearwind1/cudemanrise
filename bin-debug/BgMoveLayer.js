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
 * 背景移动层
 */
var BgMoveLayer = (function (_super) {
    __extends(BgMoveLayer, _super);
    function BgMoveLayer() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    BgMoveLayer.prototype.init = function () {
        this.moutainarr = [];
        this.bnormalspeed = true;
        this.speed = 15;
        this.curspeed = 15;
        this.totalnum = Math.ceil(GameConfig.getSW() / 200) + 2;
        for (var i = 0; i < this.totalnum; i++) {
            this.createMount(i);
        }
    };
    BgMoveLayer.prototype.createMount = function (id) {
        var mountain = new egret.Shape();
        this.addChild(mountain);
        mountain.graphics.lineStyle(1, 0x47b177);
        mountain.graphics.beginFill(0x47b177);
        mountain.graphics.moveTo(0, 0);
        mountain.graphics.lineTo(100, -200 + RandomUtils.limit(-50, 50));
        mountain.graphics.lineTo(200 + RandomUtils.limit(0, 100), 0);
        mountain.graphics.endFill();
        mountain.x = id * 200;
        this.moutainarr.push(mountain);
    };
    BgMoveLayer.prototype.move = function () {
        for (var i = 0; i < this.moutainarr.length; i++) {
            var mountain = this.moutainarr[i];
            mountain.x -= this.curspeed;
            if (mountain.x <= -300) {
                mountain.x = (this.totalnum - 2) * 200;
            }
        }
    };
    BgMoveLayer.prototype.start = function () {
        return egret.setInterval(this.move, this, 100);
    };
    BgMoveLayer.prototype.upspeed = function () {
        if (this.bnormalspeed) {
            this.bnormalspeed = false;
            this.curspeed *= 1.5;
        }
    };
    BgMoveLayer.prototype.downspeed = function () {
        if (this.bnormalspeed) {
            this.bnormalspeed = false;
            this.curspeed /= 1.5;
        }
    };
    BgMoveLayer.prototype.resumspeed = function () {
        this.bnormalspeed = true;
        this.curspeed = this.speed;
    };
    BgMoveLayer.prototype.setSpeed = function (speed) {
        this.speed = speed;
        this.curspeed = speed;
    };
    BgMoveLayer.prototype.getSpeed = function () {
        return this.curspeed;
    };
    return BgMoveLayer;
}(egret.Sprite));
__reflect(BgMoveLayer.prototype, "BgMoveLayer");
