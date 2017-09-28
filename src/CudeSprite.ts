
/**
 * 方块类
 */
class CudeSprite extends egret.Sprite {
	protected roundframe: egret.Shape;	//外框
	protected soildcude: egret.Shape;	//实体（血量的体现）
	protected currlife: number;			//当前生命（血量）
	protected totallife: number;		//总生命（血量）
	protected position: any;			//位置
	protected framecolor: number;		//外框颜色
	protected color: number;			//颜色
	protected size: number;				//大小
	protected bcanfire: boolean;		//能否发射子弹
	protected power: number;			//攻击力
	public constructor() {
		super();
		this.position = { x: 0, y: 0 };
		this.color = 0xffffff;
		this.size = 40;
	}
	public init(pos, framecolor, color, size, totallife, bcanfire, power) {
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
	}
	private show() {
		this.drawframe();
		this.updatalife();
		this.setPosition(this.position);
	}
	//设置位置
	public setPosition(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}
	//设置大小
	public setSize(size) {
		this.size = size;
		this.drawframe();
		this.updatalife();
	}
	//获取大小
	public getSize(): number {
		return this.size;
	}
	//设置当前生命值 
	public setLife(life) {
		this.currlife = life < 0 ? 0 : life;
		this.updatalife();
	}
	//获取当前生命值 
	public getLife() {
		return this.currlife;
	}
	//开火
	public fire() {
	}
	//设置攻击力
	public setPower(power) {
		this.power = power;
	}
	//获取攻击力
	public getPower(): number {
		return this.power;
	}
	//画外框
	private drawframe() {
		this.roundframe.graphics.clear();
		this.roundframe.graphics.beginFill(0xd758e2, 1);
		this.roundframe.graphics.lineStyle(2, this.framecolor);
		let linepos = [{ s: 0, e: 0 }, { s: this.size + 2, e: 0 }, { s: this.size + 2, e: this.size + 2 }, { s: 0, e: this.size + 2 }, { s: 0, e: 0 }];
		for (let i: number = 0; i < 4; i++) {
			this.roundframe.graphics.moveTo(linepos[i].s, linepos[i].e);
			this.roundframe.graphics.lineTo(linepos[i + 1].s, linepos[i + 1].e);
		}
		this.roundframe.graphics.endFill();
	}
	//画实体
	private updatalife() {
		this.soildcude.graphics.clear();
		this.soildcude.graphics.beginFill(this.color, 1);
		this.soildcude.graphics.drawRect(1, 1, this.size * (this.currlife / this.totallife), this.size);
		this.soildcude.graphics.endFill();
	}
}

/**
 * 角色类
 */
class CudeMan extends CudeSprite {
	private benterdanger: boolean = false;
	private interval;
	public constructor() {
		super();
		this.interval = egret.setInterval(this.checklifeare, this, 500);
	}
	//检测生命区域
	public checklifeare() {
		if (GameData._i().GameOver) {
			egret.clearInterval(this.interval);
			return true;
		}

		if (this.y < GameConfig.getSH() - GameConfig.OFFY) {
			if (!this.benterdanger) {
				this.benterdanger = true;
			}
			this.offLife(1);
		} else {
			if (this.benterdanger) {
				this.benterdanger = false;
			}
		}
	}
	public setTotalLife(totalLife) {
		this.totallife = totalLife;
	}
	public getTotalLife(): number{
		return this.totallife;
	}
	public offLife(power) {
		let life = this.getLife() - power;
		this.setLife(life);
		if (life <= 0) {
			this.die();
		}
	}
	//发射子弹
	public fire() {
		if (this.bcanfire) {
			this.bcanfire = false;
			egret.setTimeout(() => { this.bcanfire = true; }, this, 500);
			this.createbullet(0, { x: 40, y: 0 }, this.power);
		}
	}
	private createbullet(type, dir, power) {
		let bullet: BulletSprite = new BulletSprite(type, dir, power);
		bullet.x = this.x + this.size;
		bullet.y = this.y + this.size / 2;
		(<GameScene>this.parent).bulletcontain.addChild(bullet);
	}
	private die() {
		console.log('life====', this.currlife);
		(<GameScene>this.parent).gameover();
	}
}

/**
 * 敌人类
 */
class CudeEnemy extends CudeSprite {
	private inter: number;
	private speed: number;
	private score: number;
	public constructor(speed, score) {
		super();
		this.speed = speed;
		this.score = score;
		this.run();
	}
	private run() {
		this.inter = egret.setInterval(() => {
			if (GameData._i().GameOver) {
				egret.clearInterval(this.inter);
				return;
			}
			this.x -= this.speed;

			let gamescene: GameScene = <GameScene>(this.parent.parent);
			for (let i: number = 0; i < gamescene.bulletcontain.numChildren; i++) {
				let bullet: BulletSprite = <BulletSprite>gamescene.bulletcontain.getChildAt(i);
				if (GameUtil.getrect(bullet).intersects(GameUtil.getrect(this,0,this.size/2))) {
					this.offlife(bullet.getPower());
					bullet.die();
					break;
				}
			}
			if (GameUtil.getrect(gamescene.cudeman).intersects(GameUtil.getrect(this))) {
				let life = gamescene.cudeman.getLife() - 1;
				gamescene.cudeman.offLife(1);
				this.die();
			}
			if (this.x <= -this.size + 5 || this.y > GameConfig.getSH() + 5 || this.y < -5) {
				this.die();
			}

		}, this, 100);
	}
	private offlife(power) {
		this.currlife -= power;
		this.setLife(this.currlife);
		if (this.currlife <= 0) {
			GameData._i().GameScore += this.score;
			GameScore._i().updatascore();
			this.die();
		}
	}
	public die() {
		egret.clearInterval(this.inter);
		this.parent.removeChild(this);
	}
}