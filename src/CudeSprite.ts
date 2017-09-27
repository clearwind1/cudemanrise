
class CudeSprite extends egret.Sprite {
	protected roundframe: egret.Shape;
	protected soildcude: egret.Shape;
	protected currlife: number;
	protected totallife: number;
	protected position: any;
	protected color: number;
	protected size: number;
	public constructor() {
		super();
		this.position = { x: 0, y: 0 };
		this.color = 0xffffff;
		this.size = 40;
	}
	public init(pos, color, size, totallife) {
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
	}
	private show() {
		this.drawframe();
		this.updatalife();
		this.setPosition(this.position);
	}

	public setPosition(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}

	public setSize(size) {
		this.size = size;
		this.drawframe();
		this.updatalife();
	}
	public getSize(): number {
		return this.size;
	}
	public setLife(life) {
		this.currlife = life < 0 ? 0 : life;
		this.updatalife();
	}
	public getLife() {
		return this.currlife;
	}
	private drawframe() {
		this.roundframe.graphics.clear();
		this.roundframe.graphics.beginFill(0xd758e2, 1);
		this.roundframe.graphics.lineStyle(2, 0xd758e2);
		let linepos = [{ s: 0, e: 0 }, { s: this.size + 2, e: 0 }, { s: this.size + 2, e: this.size + 2 }, { s: 0, e: this.size + 2 }, { s: 0, e: 0 }];
		for (let i: number = 0; i < 4; i++) {
			this.roundframe.graphics.moveTo(linepos[i].s, linepos[i].e);
			this.roundframe.graphics.lineTo(linepos[i + 1].s, linepos[i + 1].e);
		}
		this.roundframe.graphics.endFill();
	}
	private updatalife() {
		this.soildcude.graphics.clear();
		this.soildcude.graphics.beginFill(this.color, 1);
		this.soildcude.graphics.drawRect(1, 1, this.size * (this.currlife / this.totallife), this.size);
		this.soildcude.graphics.endFill();
	}
}

class CudeMan extends CudeSprite {

	public constructor() {
		super();
	}

}