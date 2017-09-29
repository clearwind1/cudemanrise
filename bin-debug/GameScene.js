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
        var _this = _super.call(this) || this;
        _this.btouch = false;
        return _this;
    }
    GameScene.prototype.init = function () {
        BGMPlayer._i().play(SoundName.gamebgm);
        this.getenemyinfo = [];
        this.intervalarr = [];
        this.gametime = 0;
        this.readconfig();
        this.initdata();
        this.showbg();
        this.addtouch();
        this.createRole();
        this.createEnemy();
        this.bindkeyboard();
        this.gameinterval();
    };
    GameScene.prototype.initdata = function () {
        GameData._i().GameOver = false;
        GameData._i().GameScore = 0;
        GameData._i().GameLevel = 1;
        this.beginpointx = 0;
        this.beginpointy = 0;
    };
    GameScene.prototype.showbg = function () {
        var offy = GameConfig.OFFY;
        var bgsky = GameUtil.createRect(0, 0, this.mStageW, this.mStageH - offy, 1, 0xa8ebf7);
        this.addChild(bgsky);
        var bgland = GameUtil.createRect(0, this.mStageH - offy, this.mStageW, offy, 1, 0xece98d);
        this.addChild(bgland);
        this.bgmovelayer = new BgMoveLayer();
        this.bgmovelayer.x = 0;
        this.bgmovelayer.y = this.mStageH - offy;
        this.addChild(this.bgmovelayer);
        this.bgmovelayer.setSpeed(15);
        this.addChild(GameScore._i());
        this.bulletcontain = new egret.DisplayObjectContainer();
        this.addChild(this.bulletcontain);
        this.enemycontain = new egret.DisplayObjectContainer();
        this.addChild(this.enemycontain);
    };
    GameScene.prototype.addtouch = function () {
        var _this = this;
        var touchshap = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0);
        this.addChild(touchshap);
        touchshap.$setTouchEnabled(true);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (GameData._i().GameOver) {
                return;
            }
            if (!_this.cudeman.hitTestPoint(e.stageX, e.stageY)) {
                _this.cudeman.fire();
            }
        }, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchbegin, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchmove, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_END, this.touchend, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchout, this);
    };
    GameScene.prototype.createRole = function () {
        //console.log('createrole');
        this.cudeman = new CudeMan();
        this.cudeman.init({ x: 145, y: this.mStageH - GameConfig.OFFY / 2 - 50 }, 0xd758e2, 0x39cfd1, 100, GameConfig.TOTALLIFE, true, 1);
        this.addChild(this.cudeman);
        this.cudeman.light();
    };
    GameScene.prototype.createEnemy = function () {
        this.gametime++;
        //console.log('gametime====', this.gametime);
        for (var i = 0; i < this.getenemyinfo.length; i++) {
            if (this.gametime >= this.getenemyinfo[i].starttime && this.gametime < this.getenemyinfo[i].endtime) {
                //console.log('this.getenemyinfo[i].starttime====', this.getenemyinfo[i].starttime);
                var enemy = new CudeEnemy(this.getenemyinfo[i].type);
                //console.log('this.getenemyinfo[i].type====', this.getenemyinfo[i].type);
                var posx = this.mStageW + (this.getenemyinfo[i].posx - 1) * 80;
                var posy = this.mStageH - GameConfig.OFFY / 2 - 50 + (this.getenemyinfo[i].posy - 1) * 80;
                //console.log('posx====', posx,'\nposy=====',posy);
                enemy.init({ x: posx, y: posy }, 0x195042, 0x195042, 50, 1, false, 0);
                this.enemycontain.addChild(enemy);
            }
        }
    };
    GameScene.prototype.bindkeyboard = function () {
        KeyBoard._i().bindfun(this, this.keyup, KEYCODE.UP);
        KeyBoard._i().bindfun(this, this.keydown, KEYCODE.DOWN);
        KeyBoard._i().bindfun(this, this.keyleft, KEYCODE.LEFT);
        KeyBoard._i().bindfun(this, this.keyright, KEYCODE.RIGHT);
        KeyBoard._i().bindfun(this, this.keyspace, KEYCODE.SPACE);
    };
    GameScene.prototype.readconfig = function () {
        var config = (RES.getRes('enemyconfig_json').level)[GameData._i().GameLevel - 1];
        for (var i = 0; i < config.config.length; i++) {
            var enemyconfig = void 0;
            var itype = config.config[i].type;
            var starttime = Number(config.config[i].time.split("-")[0]);
            var endtime = Number(config.config[i].time.split("-")[1]);
            var pos = config.config[i].pos.split(",");
            for (var j = 0; j < pos.length; j++) {
                var posx = Number(pos[j].split("-")[0]);
                var posy = Number(pos[j].split("-")[1]);
                enemyconfig = { type: itype, starttime: starttime, endtime: endtime, posx: posx, posy: posy };
                this.getenemyinfo.push(enemyconfig);
            }
        }
    };
    /**游戏定时器 */
    GameScene.prototype.gameinterval = function () {
        GameUtil.trace('interval');
        var inter = GameUtil.setInterval(this.createEnemy, this, 1000);
        this.intervalarr.push(inter);
        this.intervalarr.push(this.bgmovelayer.start());
        this.cudeman.start();
        //this.gameover();
    };
    GameScene.prototype.checkgameover = function () {
        var bgameover = false;
        if (bgameover) {
            this.gameover();
        }
    };
    GameScene.prototype.touchbegin = function (e) {
        if (GameData._i().GameOver) {
            return;
        }
        if (this.cudeman.hitTestPoint(e.stageX, e.stageY)) {
            this.btouch = true;
            this.touchpoint = { x: e.stageX, y: e.stageY };
        }
    };
    GameScene.prototype.touchmove = function (e) {
        if (this.btouch) {
            this.cudeman.setPosition({ x: e.stageX - this.cudeman.getSize() / 2, y: e.stageY - this.cudeman.getSize() / 2 });
            // if (e.stageX - (this.cudeman.x + this.cudeman.getSize() / 2) >= this.cudeman.getSize() / 2) {
            //     this.bgmovelayer.upspeed();
            // } else if (e.stageX - (this.cudeman.x + this.cudeman.getSize() / 2) <= -(this.cudeman.getSize() / 2)) {
            //     this.bgmovelayer.downspeed();
            // } else {
            //     this.bgmovelayer.resumspeed();
            // }
        }
    };
    GameScene.prototype.touchend = function (e) {
        if (this.btouch) {
            this.btouch = false;
            this.bgmovelayer.resumspeed();
        }
    };
    GameScene.prototype.touchout = function (e) {
        if (this.btouch) {
            this.btouch = false;
        }
    };
    /**游戏结束 */
    GameScene.prototype.gameover = function () {
        GameUtil.trace('gameover');
        this.clearinter();
        GameData._i().GameOver = true;
        this.addChild(new GameOverPageShow());
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
        console.log('restart');
        this.cudeman.setPosition({ x: 145, y: this.mStageH - GameConfig.OFFY / 2 - 50 });
        this.cudeman.setLife(this.cudeman.getTotalLife());
        this.bulletcontain.removeChildren();
        this.enemycontain.removeChildren();
        this.gameinterval();
        //this.restart();
    };
    GameScene.prototype.keydown = function () {
        this.cudeman.setPosition({ x: this.cudeman.x, y: this.cudeman.y += 5 });
    };
    GameScene.prototype.keyleft = function () {
        this.cudeman.setPosition({ x: this.cudeman.x -= 5, y: this.cudeman.y });
    };
    GameScene.prototype.keyright = function () {
        this.cudeman.setPosition({ x: this.cudeman.x += 5, y: this.cudeman.y });
    };
    GameScene.prototype.keyup = function () {
        this.cudeman.setPosition({ x: this.cudeman.x, y: this.cudeman.y -= 5 });
    };
    GameScene.prototype.keyspace = function () {
        //this.cudeman.fire();
        GameData._i().GamePause = !GameData._i().GamePause;
    };
    return GameScene;
}(GameUtil.BassPanel));
__reflect(GameScene.prototype, "GameScene");
