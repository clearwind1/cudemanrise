/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
class GameScene extends GameUtil.BassPanel {

    private intervalarr: number[];
    private touchlayer: egret.Shape;
    private beginpointx: number;
    private beginpointy: number;
    private enemycontain: egret.DisplayObjectContainer;

    public constructor() {
        super();
    }
    public init() {
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
    }
    private initdata() {
        GameData._i().GameOver = false;
        GameData._i().GameScore = 0;
        GameData._i().GameLevel = 1;
        this.beginpointx = 0;
        this.beginpointy = 0;
    }
    /**
     * 显示背景
     */
    private bgmovelayer: BgMoveLayer;
    private showbg() {
        let offy: number = GameConfig.OFFY;
        let bgsky: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH - offy, 1, 0xa8ebf7);
        this.addChild(bgsky);
        let bgland: egret.Shape = GameUtil.createRect(0, this.mStageH - offy, this.mStageW, offy, 1, 0xece98d);
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

    }
    private addtouch() {
        let touchshap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0);
        this.addChild(touchshap);
        touchshap.$setTouchEnabled(true);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
            if (GameData._i().GameOver) {
                return;
            }
            if (!this.cudeman.hitTestPoint(e.stageX, e.stageY)) {
                this.cudeman.fire();
            }

        }, this);

        touchshap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchbegin, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchmove, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_END, this.touchend, this);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchout, this);
    }
    public cudeman: CudeMan;
    public bulletcontain: egret.DisplayObjectContainer;
    private createRole() {
        //console.log('createrole');
        this.cudeman = new CudeMan();
        this.cudeman.init({ x: 145, y: this.mStageH - GameConfig.OFFY / 2 - 50 }, 0xd758e2, 0x39cfd1, 100, GameConfig.TOTALLIFE, true, 1);
        this.addChild(this.cudeman);
        this.cudeman.light();        
    }
    private gametime: number;
    private createEnemy() {
        this.gametime++;
        //console.log('gametime====', this.gametime);
        for (let i: number = 0; i < this.getenemyinfo.length; i++) {

            if (this.gametime >= this.getenemyinfo[i].starttime && this.gametime < this.getenemyinfo[i].endtime) {
                //console.log('this.getenemyinfo[i].starttime====', this.getenemyinfo[i].starttime);
                let enemy: CudeEnemy = new CudeEnemy(this.getenemyinfo[i].type);
                //console.log('this.getenemyinfo[i].type====', this.getenemyinfo[i].type);
                let posx = this.mStageW + (this.getenemyinfo[i].posx - 1) * 80;
                let posy = this.mStageH - GameConfig.OFFY / 2 - 50 + (this.getenemyinfo[i].posy - 1) * 80;
                //console.log('posx====', posx,'\nposy=====',posy);
                enemy.init({ x: posx, y: posy }, 0x195042, 0x195042, 50, 1, false, 0);
                this.enemycontain.addChild(enemy);
            }
        }
    }
    private bindkeyboard() {
        KeyBoard._i().bindfun(this, this.keyup, KEYCODE.UP);
        KeyBoard._i().bindfun(this, this.keydown, KEYCODE.DOWN);
        KeyBoard._i().bindfun(this, this.keyleft, KEYCODE.LEFT);
        KeyBoard._i().bindfun(this, this.keyright, KEYCODE.RIGHT);
        KeyBoard._i().bindfun(this, this.keyspace, KEYCODE.SPACE);
    }
    private getenemyinfo: any[];
    private readconfig() {
        let config = (RES.getRes('enemyconfig_json').level)[GameData._i().GameLevel - 1];
        for (let i: number = 0; i < config.config.length; i++) {
            let enemyconfig;

            let itype = config.config[i].type;
            let starttime = Number(config.config[i].time.split("-")[0]);
            let endtime = Number(config.config[i].time.split("-")[1]);
            let pos = config.config[i].pos.split(",");
            for (let j: number = 0; j < pos.length; j++) {
                let posx = Number(pos[j].split("-")[0]);
                let posy = Number(pos[j].split("-")[1]);

                enemyconfig = { type: itype, starttime: starttime, endtime: endtime, posx: posx, posy: posy };
                this.getenemyinfo.push(enemyconfig);
            }
        }

    }
    /**游戏定时器 */
    private gameinterval() {
        GameUtil.trace('interval');
        let inter = GameUtil.setInterval(this.createEnemy, this, 1000);
        this.intervalarr.push(inter);
        this.intervalarr.push(this.bgmovelayer.start());
        this.cudeman.start();
        //this.gameover();
    }

    private checkgameover() {

        var bgameover = false;

        if (bgameover) {
            this.gameover();
        }
    }

    private touchpoint;
    private btouch: boolean = false;
    private touchbegin(e: egret.TouchEvent) {
        if (GameData._i().GameOver) {
            return;
        }
        if (this.cudeman.hitTestPoint(e.stageX, e.stageY)) {
            this.btouch = true;
            this.touchpoint = { x: e.stageX, y: e.stageY };
        }
    }
    private touchmove(e: egret.TouchEvent) {
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
    }
    private touchend(e: egret.TouchEvent) {
        if (this.btouch) {
            this.btouch = false;
            this.bgmovelayer.resumspeed();
        }
    }
    private touchout(e: egret.TouchEvent) {
        if (this.btouch) {
            this.btouch = false;
        }
    }

    /**游戏结束 */
    public gameover() {
        GameUtil.trace('gameover');
        this.clearinter();
        GameData._i().GameOver = true;
        this.addChild(new GameOverPageShow());
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();

    }
    /**
     *下一关
     */
    private nextlevelgame() {

    }

    /**重置游戏数据 */
    public reset() {
        this.gameinterval();
        this.restart();
    }
    /**清除定时器 */
    private clearinter() {
        GameUtil.clearinterval(this.intervalarr);
    }

    private exitgame() {
        GameUtil.GameScene.runscene(new StartGameScene());
    }

    private restartask() {
        var askcon: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);

        var bgname: string = 'restartbg_png';
        var gameoverbg: MyBitmap = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);
        var bgtext: MyBitmap = new MyBitmap(RES.getRes('restarttext_png'), 330, 80, gameoverbg);
        askcon.addChild(bgtext);

        var btname: string[] = ['yesbtn_png', 'nobtn_png'];
        var btnfun: Function[] = [this.restart,];
        for (var i: number = 0; i < 2; i++) {
            var btn: GameUtil.Menu = new GameUtil.Menu(this, btname[i], btname[i], (id) => {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 175 + 290 * i, 260);
        }
    }
    public restart() {
        console.log('restart');
        this.cudeman.setPosition({ x: 145, y: this.mStageH - GameConfig.OFFY / 2 - 50 });
        this.cudeman.setLife(this.cudeman.getTotalLife());
        this.bulletcontain.removeChildren();
        this.enemycontain.removeChildren();
        this.gameinterval();
        //this.restart();
    }

    private keydown() {
        this.cudeman.setPosition({ x: this.cudeman.x, y: this.cudeman.y += 5 });
    }
    private keyleft() {
        this.cudeman.setPosition({ x: this.cudeman.x -= 5, y: this.cudeman.y });
    }
    private keyright() {
        this.cudeman.setPosition({ x: this.cudeman.x += 5, y: this.cudeman.y });
    }
    private keyup() {
        this.cudeman.setPosition({ x: this.cudeman.x, y: this.cudeman.y -= 5 });
    }
    private keyspace() {
        //this.cudeman.fire();
        GameData._i().GamePause = !GameData._i().GamePause;
    }
}
