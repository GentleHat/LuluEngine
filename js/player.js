function Player() {
	Game.entities.push(this);
	this.x = 1;
	this.y = 1;
	this.layer = 5; //Render the player on top of other entities
	this.rotation = 0;
	this.lastUpdate = 0;
	this.sprite = new Sprite("img/player.png");
	this.width = 16;
	this.height = 16;
	this.scale = 1;
	this.rotation = 180;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
}

Player.prototype.update = function() {
	this.boundingBox.update(this.x + (this.width / 2) - 18, this.y + (this.height / 2) - 18);
	if ((this.lastUpdate - getCurrentMs()) < -1) { //Updates to do every 1 second

		this.lastUpdate = getCurrentMs();
	}
};

Player.prototype.render = function() {
	this.rotation = Math.atan2(this.y + Game.screen.yOffset - (this.height / 2) - Game.input.mouse.y, this.x + Game.screen.xOffset - (this.width / 2) - Game.input.mouse.x) * (180 / Math.PI);
	if (this.rotation < 0) {
		this.rotation += 360;
	}
	this.rotation -= 90;
	this.sprite.rotation = this.rotation;
	this.sprite.renderOnScreen(this.x, this.y);

	//300 and 225 here are the canvas height/width divided by 2
	if (this.x > 300 && this.x + 300 < Game.screen.maxXOffset * -1) Game.screen.xOffset = -(this.x - 300);
	if (this.y > 225 && this.y + 225 < Game.screen.maxYOffset * -1) Game.screen.yOffset = -(this.y - 225);

	if (Game.screen.xOffset > 0) Game.screen.xOffset = 0;
	if (Game.screen.yOffset > 0) Game.screen.yOffset = 0;
};


Player.prototype.move = function(xm, ym) {
	xm *= 1;
	ym *= 1;

	var canMove = true;
	//Collision with solid tiles
	for (var x = 0; x < Game.level.width; x++) {
		for (var y = 0; y < Game.level.height; y++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(xm, ym, Game.level.tiles[x][y])) {
					canMove = false;
				}
			}
		}
	}
	//Collision with entities of type
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Entity) {
			if (this.boundingBox.wouldCollide(xm, ym, Game.entities[i])) {
				canMove = false;
			}
		}
	}
	if (canMove) {
		this.x += xm;
		this.y += ym;
	}
};