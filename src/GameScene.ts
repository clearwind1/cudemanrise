/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
class GameScene extends GameUtil.BassPanel {

    private intervalarr: number[];
    private touchlayer: egret.Shape;
    private beginpointx: number;
    private beginpointy: number;
    private gamescoreT: GameUtil.MyTextField;
    private gamelevelT: GameUtil.MyTextField;
    private heightscoreT: GameUtil.MyTextField;

    public constructor() {
        super();
    }
    public init() {
        BGMPlayer._i().play(SoundName.gamebgm);
        this.intervalarr = [];
        this.initdata();
        this.showbg();
        this.addtouch();
        this.createRole();
        this.gameinterval();
    }
    private initdata() {

        GameData._i().GameScore = 1000;
        this.beginpointx = 0;
        this.beginpointy = 0;
    }
    /**
     * 显示背景
     */
    private showbg() {
        let offy: number = 400;
        let bgsky: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH - offy, 1, 0xa8ebf7);
        this.addChild(bgsky);
        let bgland: egret.Shape = GameUtil.createRect(0, this.mStageH - offy, this.mStageW, offy, 1, 0xece98d);
        this.addChild(bgland);
    }
    private addtouch() {
        let touchshap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0);
        this.addChild(touchshap);
        touchshap.$setTouchEnabled(true);
        touchshap.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let life = this.cudeman.getLife() - 1;
            this.cudeman.setLife(life);
         }, this);
    }
    private cudeman: CudeMan;
    private createRole() {
        console.log('createrole');
        this.cudeman = new CudeMan();
        this.cudeman.init({ x: this.mStageW / 2 - 50, y: this.mStageH - 150 }, 0x39cfd1, 100, 10);
        this.addChild(this.cudeman);
    }
    /**游戏定时器 */
    private gameinterval() {
        GameUtil.trace('interval');
        //this.gameover();
    }

    private checkgameover() {

        var bgameover = false;

        if (bgameover) {
            this.gameover();
        }
    }

    private touchbegin(evt: egret.TouchEvent) {

        if (GameData._i().GamePause) {
            return;
        }
        GameData._i().GamePause = true;
    }

    /**游戏结束 */
    public gameover() {
        GameUtil.trace('gameover');
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
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
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
        GameData._i().GameScore = 0;
        console.log('restart');
        //this.restart();
    }
}