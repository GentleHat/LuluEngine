function Sprite(img) {
	this.img = new Image();
	this.img.src = img;
	this.scale = 1;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 30;
	this.height = 30;
	this.loaded = false;
	var _this = this;
	this.img.onload = function() {
		_this.loaded = true;
		_this.width = _this.img.width;
		_this.height = _this.img.height;
	};
}

Sprite.prototype.render = function(x,y) {
	ctx.drawImage(this.img, this.xOffset, this.yOffset, this.width-this.xOffset, this.height-this.yOffset, x, y, this.width*this.scale, this.width*this.scale);
};