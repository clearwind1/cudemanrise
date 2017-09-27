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
var CudeSprite = (function (_super) {
    __extends(CudeSprite, _super);
    function CudeSprite() {
        var _this = _super.call(this) || this;
        _this.position = { x: 0, y: 0 };
        _this.color = 0xffffff;
        _this.size = 40;
        return _this;
    }
    CudeSprite.prototype.init = function (pos, color, size, totallife) {
        this.roundframe = new egret.Shape();
        this.addChild(this.roundframe);
        this.soildcude = new egret.Shape();
        this.addChild(this.soildcude);
        this.position = pos;
        this.color = color;
        this.size = size;
        this.totallife = totallife;
        this.currlife = totallife;
        this.show();
    };
    CudeSprite.prototype.show = function () {
        this.drawframe();
        this.updatalife();
        this.setPosition(this.position);
    };
    CudeSprite.prototype.setPosition = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    };
    CudeSprite.prototype.setSize = function (size) {
        this.size = size;
        this.drawframe();
        this.updatalife();
    };
    CudeSprite.prototype.getSize = function () {
        return this.size;
    };
    CudeSprite.prototype.setLife = function (life) {
        this.currlife = life < 0 ? 0 : life;
        this.updatalife();
    };
    CudeSprite.prototype.getLife = function () {
        return this.currlife;
    };
    CudeSprite.prototype.drawframe = function () {
        this.roundframe.graphics.clear();
        this.roundframe.graphics.beginFill(0xd758e2, 1);
        this.roundframe.graphics.lineStyle(2, 0xd758e2);
        var linepos = [{ s: 0, e: 0 }, { s: this.size + 2, e: 0 }, { s: this.size + 2, e: this.size + 2 }, { s: 0, e: this.size + 2 }, { s: 0, e: 0 }];
        for (var i = 0; i < 4; i++) {
            this.roundframe.graphics.moveTo(linepos[i].s, linepos[i].e);
            this.roundframe.graphics.lineTo(linepos[i + 1].s, linepos[i + 1].e);
        }
        this.roundframe.graphics.endFill();
    };
    CudeSprite.prototype.updatalife = function () {
        this.soildcude.graphics.clear();
        this.soildcude.graphics.beginFill(this.color, 1);
        this.soildcude.graphics.drawRect(1, 1, this.size * (this.currlife / this.totallife), this.size);
        this.soildcude.graphics.endFill();
    };
    return CudeSprite;
}(egret.Sprite));
__reflect(CudeSprite.prototype, "CudeSprite");
var CudeMan = (function (_super) {
    __extends(CudeMan, _super);
    function CudeMan() {
        return _super.call(this) || this;
    }
    return CudeMan;
}(CudeSprite));
__reflect(CudeMan.prototype, "CudeMan");
//# sourceMappingURL=CudeSprite.js.map