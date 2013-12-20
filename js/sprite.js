function Sprite(img) {
	this.img = new Image();
	this.img.src = img;
	this.scale = 1;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 180;
	this.height = 327;
	this.loaded = false;
	var _this = this;
	this.img.onload = function() {
		_this.loaded = true;
		//0_this.width = _this.img.width;
		//_this.height = _this.img.height;
	};
}

Sprite.prototype.render = function(x, y) {
	//TODO: Do not draw this sprite if it is offscreen
	ctx.drawImage(this.img, this.xOffset, this.yOffset, this.width, this.height, x, y, this.width * this.scale, this.width * this.scale);
	this.xOffset += 180;
	if (this.xOffset >= 1134) this.xOffset = 0;
};