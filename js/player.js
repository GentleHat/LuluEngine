//player.js

var player = null;

function Player() {
	entities.push(this);
	this.x = 1;
	this.y = 1;
	this.layer = 5; //Render the player on top of other entities
	this.rotation = 0;
	this.lastUpdate = 0;
	this.img = new Image();
	this.img.src = "images/player.png";
	this.width = 16;
	this.height = 16;
	this.scale = 1;
	this.rotation = 180;
	this.boundingBox = new BoundingBox(this.x,this.y,this.width,this.height);
}

Player.prototype.update = function() {
	this.boundingBox.update(this.x+(this.width/2)-18,this.y+(this.height/2)-18);
	if ((this.lastUpdate - getCurrentMs()) < - 1) { //Updates to do every 1 second

		this.lastUpdate = getCurrentMs();
	}
};

Player.prototype.render = function() {
	this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-mouse.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-mouse.x+screen.xOffset)*(180 / Math.PI);
	if(this.rotation < 0) { this.rotation += 360;}
	this.rotation -= 90;
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	ctx.restore();

	var middlex;
	var middley;

	if (player.x > 300 && player.x + 300 < screen.maxXOffset * -1) screen.xOffset = -(player.x-300);
	if (player.y > 225 && player.y + 225 < screen.maxYOffset * -1) screen.yOffset = -(player.y-225);

	if (screen.xOffset > 0) screen.xOffset = 0;
	if (screen.yOffset > 0) screen.yOffset = 0;
};


Player.prototype.move = function(xm,ym) {
	xm *= 1;
	ym *= 1;

	var canMove = true;
	//Collision with solid tiles
	for (var x=0;x<game.level.width;x++)
	{
		for (var y=0;y<game.level.height;y++) {
			if (game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(xm,ym,game.level.tiles[x][y])) {
					canMove = false;
				}
			}
		}
	}
	//Collision with entities of type
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Entity) {
			if (this.boundingBox.wouldCollide(xm,ym,entities[i])) {
				canMove = false;
			}
		}
	}
	if (canMove) {
		this.x += xm;
		this.y += ym;
	}
};