function Screen() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = Game.width;
	this.height = Game.height;
	this.maxXOffset = (Game.level.width * 32) * -1;
	this.maxYOffset = (Game.level.height * 32) * -1;
}

Screen.prototype.update = function() {
	this.addKick();
};

Screen.prototype.scroll = function() {
	this.move(0, 0);
};

Screen.prototype.move = function(x, y) {
	if (x < 0) {
		if (this.xOffset + x > this.maxXOffset + this.width) {
			this.xOffset += x;
		}
	} else if (x > 0) {
		if (this.xOffset + x < 0) {
			this.xOffset += x;
		}
	}
	if (y < 0) {
		if (this.yOffset + y > this.maxYOffset + this.height) {
			this.yOffset += y;
		}
	} else if (y > 0) {
		if (this.yOffset + y < 0) {
			this.yOffset += y;
		}
	}
};

Screen.prototype.setXOffset = function(x) {
	this.xOffset = x;
};

Screen.prototype.setYOffset = function(y) {
	this.yOffset = y;
};