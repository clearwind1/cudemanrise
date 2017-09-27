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
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this) || this;
    }
    GameScene.prototype.init = function () {
        BGMPlayer._i().play(SoundName.gamebgm);
        this.intervalarr = [];
        this.initdata();
        this.showbg();
        this.addtouch();
        this.createRole();
        this.gameinterval();
    };
    GameScene.prototype.initdata = function () {
        GameData._i().GameScore = 1000;
        this.beginpointx = 0;
        this.beginpointy = 0;
    };
    /**
     * 显示背景
     */
    GameScene.prototype.showbg = function () {
        var offy = 400;
        var bgsky = GameUtil.createRect(0, 0, this.mStageW, this.mStageH - offy, 1, 0xa8ebf7);
        this.addChild(bgsky);
        var bgland = GameUtil.createRect(0, this.mStageH - offy, this.mStageW, offy, 1, 0xece98d);
        this.addChild(bgland);
    };
    GameScene.prototype.addtouch = function () {
        var _this = this;
        var touchshap = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0);
        this.addChild(touchshap);
        touchshap.$setTouchEnabled(true);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var life = _this.cudeman.getLife() - 1;
            _this.cudeman.setLife(life);
        }, this);
    };
    GameScene.prototype.createRole = function () {
        console.log('createrole');
        this.cudeman = new CudeMan();
        this.cudeman.init({ x: this.mStageW / 2 - 50, y: this.mStageH - 150 }, 0x39cfd1, 100, 10);
        this.addChild(this.cudeman);
    };
    /**游戏定时器 */
    GameScene.prototype.gameinterval = function () {
        GameUtil.trace('interval');
        //this.gameover();
    };
    GameScene.prototype.checkgameover = function () {
        var bgameover = false;
        if (bgameover) {
            this.gameover();
        }
    };
    GameScene.prototype.touchbegin = function (evt) {
        if (GameData._i().GamePause) {
            return;
        }
        GameData._i().GamePause = true;
    };
    /**游戏结束 */
    GameScene.prototype.gameover = function () {
        GameUtil.trace('gameover');
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();
    };
    /**
     *下一关
     */
    GameScene.prototype.nextlevelgame = function () {
    };
    /**重置游戏数据 */
    GameScene.prototype.reset = function () {
        this.gameinterval();
        this.restart();
    };
    /**清除定时器 */
    GameScene.prototype.clearinter = function () {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    };
    GameScene.prototype.exitgame = function () {
        GameUtil.GameScene.runscene(new StartGameScene());
    };
    GameScene.prototype.restartask = function () {
        var _this = this;
        var askcon = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);
        var bgname = 'restartbg_png';
        var gameoverbg = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);
        var bgtext = new MyBitmap(RES.getRes('restarttext_png'), 330, 80, gameoverbg);
        askcon.addChild(bgtext);
        var btname = ['yesbtn_png', 'nobtn_png'];
        var btnfun = [this.restart,];
        for (var i = 0; i < 2; i++) {
            var btn = new GameUtil.Menu(this, btname[i], btname[i], function (id) {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    _this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 175 + 290 * i, 260);
        }
    };
    GameScene.prototype.restart = function () {
        GameData._i().GameScore = 0;
        console.log('restart');
        //this.restart();
    };
    return GameScene;
}(GameUtil.BassPanel));
__reflect(GameScene.prototype, "GameScene");
//# sourceMappingURL=GameScene.js.map