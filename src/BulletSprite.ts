
/**
 * 子弹类
 */
class BulletSprite extends egret.Shape{
	private bullettype;
	private bulletdir;
	private inter;
	private power;
	public constructor(type,dir,power) {
		super();
		this.init(type,dir,power);
		this.draw();
		this.start();
	}
	private init(type,dir,power) {
		this.bullettype = type;
		this.bulletdir = dir;
		this.power = power;
	}
	private draw() {
		this.graphics.beginFill(0xb4becb);
		this.graphics.drawCircle(0, 0, 10);
		this.graphics.endFill();
	}
	private start() {
		this.inter = egret.setInterval(() => {
			if (GameData._i().GameOver) {
				egret.clearInterval(this.inter);
				return;
			}
			this.x += this.bulletdir.x;
			this.y += this.bulletdir.y;
			if (this.x > GameConfig.getSW() + 20 || this.x < -20 || this.y < -20 || this.y > GameConfig.getSH() + 20) {
				this.die();
			}
		}, this, 100);
	}
	public die() {
		egret.clearInterval(this.inter);
		this.parent.removeChild(this);
	}

	public getPower():number {
		return this.power;
	}
}