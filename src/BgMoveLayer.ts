
/**
 * 背景移动层
 */
class BgMoveLayer extends egret.Sprite {
	private moutainarr: any[];
	private totalnum: number;
	private speed: number;
	private curspeed: number;
	private bnormalspeed: boolean;
	public constructor() {
		super();
		this.init();
	}
	private init() {
		this.moutainarr = [];
		this.bnormalspeed = true;
		this.speed = 15;
		this.curspeed = 15;
		this.totalnum = Math.ceil(GameConfig.getSW() / 200) + 2;
		for (let i: number = 0; i < this.totalnum; i++) {
			this.createMount(i);
		}
	}
	private createMount(id) {
		let mountain: egret.Shape = new egret.Shape();
		this.addChild(mountain);
		mountain.graphics.lineStyle(1, 0x47b177);
		mountain.graphics.beginFill(0x47b177);
		mountain.graphics.moveTo(0, 0);
		mountain.graphics.lineTo(100, -200 + RandomUtils.limit(-50, 50));
		mountain.graphics.lineTo(200 + RandomUtils.limit(0, 100), 0);
		mountain.graphics.endFill();
		mountain.x = id * 200;
		this.moutainarr.push(mountain);
	}

	private move() {
		for (let i: number = 0; i < this.moutainarr.length; i++) {
			let mountain: egret.Shape = this.moutainarr[i];
			mountain.x -= this.curspeed;
			if (mountain.x <= -300) {
				mountain.x = (this.totalnum - 2) * 200;
			}
		}
	}
	public start(): number {
		return GameUtil.setInterval(this.move, this, 100);
	}
	public upspeed() {
		if (this.bnormalspeed) {
			this.bnormalspeed = false;
			this.curspeed *= 1.5;
		}
	}
	public downspeed() {
		if (this.bnormalspeed) {
			this.bnormalspeed = false;
			this.curspeed /= 1.5;
		}
	}
	public resumspeed() {
		this.bnormalspeed = true;
		this.curspeed = this.speed;
	}
	public setSpeed(speed) {
		this.speed = speed;
		this.curspeed = speed;
	}
	public getSpeed(): number{
		return this.curspeed;
	}
}