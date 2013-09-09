//level.js



function Level(num) {
	var fileName = 'maps/level'+num+'.tmx';
	tmxloader.load(fileName);

	this.tiles = [];
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = tmxloader.map.width;
	this.height =  tmxloader.map.height;
	this.overlayAlpha = 0;
	this.fadeStep = 0;
	this.isFading = false;
	this.levelTime = 0;
	this.lastUpdate = 0;

	for (var x=0;x<this.width;x++)
	{
		this.tiles[x] = [];
		for (var y=0;y<this.height;y++) {
			this.tiles[x][y] = new Tile(x*32,y*32,tmxloader.map.layers[0].data[y][x]); //Tile layer
		}
	}

	for (var x=0;x<this.width;x++)
	{
		for (var y=0;y<this.height;y++) {
			switch(tmxloader.map.layers[1].data[y][x] - 64) { //Subtract the # of tiles on the first (tile) layer
				case 1: new PlayerSpawn(x,y); break;
				case 2: new Entity(x,y); break;
			}
		}
	}
}

Level.prototype.update = function() {
	if (getCurrentMs() - this.lastUpdate > 1) {
		this.levelTime++;
		this.lastUpdate = getCurrentMs();
	}
};

function renderLevel(level) {
	for (var x=0;x<level.width;x++) { //These ifs check to render tiles only on screen based on pixel values of screen size
		if (x > (((screen.xOffset + 32 - (screen.xOffset % 32)) / 32) * -1) && x < (((screen.xOffset - gamewidth - 32 - (screen.xOffset % 32)) / 32) * -1)) {
			for (var y=0;y<level.height;y++) {
				if (y > (((screen.yOffset + 32 - (screen.yOffset % 32)) / 32) * -1) && y < (((screen.yOffset - gameheight - 32 - (screen.yOffset % 32)) / 32) * -1))
					level.tiles[x][y].render();
			}
		}
	}
}

Level.prototype.start = function() {
	//TODO: Fade in the level
};

Level.prototype.fadeIn = function() {
	this.overlayAlpha = 1;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeInLevel, 50);
};

Level.prototype.fadeOut = function() {
	this.overlayAlpha = 0;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeOutLevel,50);
};

function fadeInLevel() {
	if (game.level !== null) {
		game.level.overlayAlpha-= 0.030;
		game.level.fadeStep++;
		if (game.level.fadeStep < 75 && game.level.isFading) {
			setTimeout(fadeInLevel, 50);
		}
		else {
			game.level.isFading = false;
		}
	}
}

function fadeOutLevel() {
	if (game.level !== null) {
		game.level.overlayAlpha+= 0.015;
		game.level.fadeStep++;
		if (game.level.fadeStep < 75 && game.level.isFading) {
			setTimeout(fadeOutLevel, 50);
		}
		else {
			game.level.isFading = false;
		}
	}
}

Level.prototype.drawOverlay = function() {
	ctx.fillStyle = "rgba(0, 0, 0, "+this.overlayAlpha+")";
	ctx.fillRect(0,0,gamewidth,gameheight);
};