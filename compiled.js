AudioFX=function(){var f="0.4.0";var c=false,e=document.createElement("audio"),a=function(j){var i=e.canPlayType(j);return(i==="probably")||(i==="maybe")};if(e&&e.canPlayType){c={ogg:a('audio/ogg; codecs="vorbis"'),mp3:a("audio/mpeg;"),m4a:a("audio/x-m4a;")||a("audio/aac;"),wav:a('audio/wav; codecs="1"'),loop:(typeof e.loop==="boolean")}}var d=function(m,i,l){var k=document.createElement("audio");if(l){var j=function(){k.removeEventListener("canplay",j,false);l()};k.addEventListener("canplay",j,false)}if(i.loop&&!c.loop){k.addEventListener("ended",function(){k.currentTime=0;k.play()},false)}k.volume=i.volume||0.1;k.autoplay=i.autoplay;k.loop=i.loop;k.src=m;return k};var h=function(i){for(var j=0;j<i.length;j++){if(c&&c[i[j]]){return i[j]}}};var g=function(i){var k,j;for(k=0;k<i.length;k++){j=i[k];if(j.paused||j.ended){return j}}};var b=function(o,j,m){j=j||{};var i=j.formats||[],l=h(i),k=[];o=o+(l?"."+l:"");if(c){for(var p=0;p<(j.pool||1);p++){k.push(d(o,j,p==0?m:null))}}else{m()}return{audio:(k.length==1?k[0]:k),play:function(){var n=g(k);if(n){n.play()}},stop:function(){var r,q;for(r=0;r<k.length;r++){q=k[r];q.pause();q.currentTime=0}}}};b.version=f;b.supported=c;return b}();//boundingbox.js

function BoundingBox(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

BoundingBox.prototype.update = function(x,y) {
	this.x = x;
	this.y = y;
};

BoundingBox.prototype.setWidth = function(width) {
	this.width = width;
};

BoundingBox.prototype.setHeight = function(height) {
	this.height = height;
};

BoundingBox.prototype.wouldCollide = function(x,y,e) {
	var wouldCollide = false;
	this.x += x;
	this.y += y;
	if (this.isColliding(e)) wouldCollide = true;
	this.x -= x;
	this.y -= y;
	return wouldCollide;
};

BoundingBox.prototype.isColliding = function(e) {
	if (e === undefined) return false;
	if (this.x + this.width > e.boundingBox.x && this.x < e.boundingBox.x + e.boundingBox.width) {
		if (this.y + this.height > e.boundingBox.y && this.y < e.boundingBox.y + e.boundingBox.height) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.getDistBetween = function(e) {
	var point1a = this.x + (this.width/2);
	var point1b = this.y + (this.height/2);
	var point1 = new Point(point1a,point1b);
	var point2a = e.boundingBox.x+(e.boundingBox.width/2);
	var point2b = e.boundingBox.y+(e.boundingBox.height/2);
	var point2 = new Point(point2a,point2b);
	return point1.getDist(point2);

}

BoundingBox.prototype.isPointIn = function(x,y) {
	if (this.x === undefined || this.y === undefined || this.x === null || this.y === null) return -1;
	if (this.x + this.width > x && this.x < x) {
		if (this.y + this.height > y && this.y < y) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.destroy = function() {
	//Remove this bounding box?
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
};function FPSManager() {
	this.fps = 30;
	this.now = null;
	this.then = Date.now();
	this.interval = 1000 / this.fps;
	this.delta = null;
}//functions.js

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
};


function getCurrentMs() {
	var date = new Date();
	var ms = date.getTime() / 1000;
	return ms;
}

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}

function random(low, high) {
	var rand = (Math.random() * high) + low;
	return rand;
}

function randomInt(low, high) {
	return (Math.floor((Math.random() * high) + low));
}var canvas = null;
var ctx = null;

var Game = null; //Game engine variable

//HTML onLoad event - Loading the game
$(document).ready(function() {
	canvas = document.getElementById('canvas');
	canvas.width = 600;
	canvas.height = 450;
	//check whether browser supports getting canvas context
	if (canvas && canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		$(window).focus();
	}

	Game = new GameEngine();
	Game.loader.load();
	loop();
	Game.start();
});


function GameEngine() {
	this.settings = new Settings();
	this.ui = new UI();
	this.loader = new AssetLoader();
	this.fpsManager = new FPSManager();
	this.sound = new SoundManager();
	this.particles = new ParticleManager();
	this.started = true;
	this.level = null;
	this.input = new InputManager();
	this.currentLevel = 1;
	this.inGame = true; //Are we physically in the game level
	this.inMenu = false;
	this.loaded = false;
	this.entities = [];
}
GameEngine.prototype.toggleSound = function() {
	if (this.settings.sound) this.settings.sound = false;
	else this.settings.sound = true;
};
GameEngine.prototype.toggleParticles = function() {
	if (this.settings.particles) this.settings.particles = false;
	else this.settings.particles = true;
};
GameEngine.prototype.start = function() {
	this.started = true;
	this.inGame = true;
	this.inMenu = false;
	this.level = new Level(this.currentLevel);
	this.level.fadeIn();
	this.player = new Player();
	this.ui = new UI();
	this.screen = new Screen();
};
GameEngine.prototype.end = function() {
	this.started = false;
	this.level = null;
	this.inMenu = true;
	this.entities = [];
	this.player = null;
	this.screen = null;
	this.ui = null;
};

GameEngine.prototype.gameOver = function() {
	this.inGame = false;
	this.level.fadeOut();
	setTimeout("game.end();", 4800); //After level fadeout do game.end()
};

/* Game Loop */

function loop() {
	Game.loop();
}

GameEngine.prototype.loop = function() {
	requestAnimationFrame(loop);
	this.fpsManager.now = Date.now();
	this.fpsManager.delta = this.fpsManager.now - this.fpsManager.then;
	if (this.fpsManager.delta > this.fpsManager.interval) {
		this.fpsManager.then = this.fpsManager.now - (this.fpsManager.delta % this.fpsManager.interval);
		this.render();
	}
};

GameEngine.prototype.render = function() {
	if (!this.loaded) {
		this.ui.drawLoadingScreen();
		if (this.loader.getLoadPercent() == 100) {
			this.loaded = true;
			return;
		}
	}
	if (this.screen === null || this.screen === undefined) return;
	ctx.restore();
	ctx.fillStyle = "rgba(44, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	this.ui.draw();
	renderLevel(this.level);
	Game.screen.scroll();
	this.entities.sort(sortByEntityLayer);
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] !== null) {
			if (!(this.entities[i] instanceof Player)) this.entities[i].render();
			if (this.inGame) this.entities[i].update();
		}
	}
	this.particles.drawParticles();
	this.player.render();


	this.ui.draw();

	//Clean up arrays
	if (this.entities.length > 500) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities.clean(null);
		}
	}
	if (this.particles.length > 300) {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles.clean(null);
		}
	}
	this.level.update();
	this.input.handleInteractions();
};



GameEngine.prototype.deleteEntity = function(e) {
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] === e) {
			this.entities[i] = null;
			break;
		}
	}
};

GameEngine.prototype.debugMsg = function(str) {
	console.log("LuluEngine: " + str);
};

function sortByEntityLayer(a, b) {
	if (a === null) return 1;
	if (b === null) return -1;
	if (a.layer === undefined) a.layer = 0;
	if (b.layer === undefined) b.layer = 0;
	if (a.layer < b.layer)
		return -1;
	if (a.layer > b.layer)
		return 1;
	return 0;
}function InputManager() {
	this.mouse = new Mouse();
	this.keys = [];
}

function Mouse() {
	this.x = 0;
	this.y = 0;
	this.down = false;
}

InputManager.prototype.handleInteractions = function() {
	if (Game.player === null) return;
	if (this.keys[38] || this.keys[87]) { //Up arrow
		Game.player.move(0, -2);
	}
	if (this.keys[37] || this.keys[65]) { //Left Arrow
		Game.player.move(-2, 0);
	}
	if (this.keys[39] || this.keys[68]) { //right arrow
		Game.player.move(2, 0);
	}
	if (this.keys[40] || this.keys[83]) { //down arrow
		Game.player.move(0, 2);
	}
	if (this.keys[32]) { //spacebar

	}
	if (this.keys[69]) { //e

	}
	if (this.keys[70]) { //f

	}
	if (this.keys[71]) { //g

	}
	if (this.keys[82]) { //r

	}
};

$(window).load(function() {
	window.focus();
	$(window).keydown(function(evt) {
		Game.input.keys[evt.keyCode] = true;
	});
	$(window).keyup(function(evt) {
		Game.input.keys[evt.keyCode] = false;
	});
});

//Disable browsers usual function of scrolling with up/down arrow keys
document.onkeydown = function(event) {
	return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32;
};

$('#canvas').bind('contextmenu', function(e) {
	//Right click callback
	return false; //Disable usual context menu behaviour
});
$("#canvas").mousedown(function(event) {
	event.preventDefault();
	Game.input.mouse.down = true;
});
$("#canvas").mouseup(function(event) {
	Game.input.mouse.down = false;
});

//Mouse movement
$('#canvas').mousemove(function(e) {
	Game.input.mouse.x = e.pageX - this.offsetLeft;
	Game.input.mouse.y = e.pageY - this.offsetTop;
	if (Game === null) return;
	if (Game.screen !== null) {
		//mouse.x += screen.xOffset;
		//mouse.y += screen.yOffset;
	}
});

//Mouse clicks hook
$("#canvas").click(function(e) {
	window.focus();
});function Level(num) {
	var fileName = 'maps/level' + num + '.tmx';
	tmxloader.load(fileName);

	this.tiles = [];
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = tmxloader.map.width;
	this.height = tmxloader.map.height;
	this.overlayAlpha = 0;
	this.fadeStep = 0;
	this.isFading = false;
	this.levelTime = 0;
	this.lastUpdate = 0;

	for (var x = 0; x < this.width; x++) {
		this.tiles[x] = [];
		for (var y = 0; y < this.height; y++) {
			this.tiles[x][y] = new Tile(x * 32, y * 32, tmxloader.map.layers[0].data[y][x]); //Tile layer
		}
	}

	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			switch (tmxloader.map.layers[1].data[y][x] - 64) { //Subtract the # of tiles on the first (tile) layer
				case 1:
					new PlayerSpawn(x, y);
					break;
			}
		}
	}
	new PlayerSpawn(64, 64);
}

Level.prototype.update = function() {
	if (getCurrentMs() - this.lastUpdate > 1) {
		this.levelTime++;
		this.lastUpdate = getCurrentMs();
	}
};

function renderLevel(level) {
	for (var x = 0; x < Game.level.width; x++) { //These ifs check to render tiles only on screen based on pixel values of screen size
		if (x > (((Game.screen.xOffset + 32 - (Game.screen.xOffset % 32)) / 32) * -1) && x < (((Game.screen.xOffset - 600 - 32 - (Game.screen.xOffset % 32)) / 32) * -1)) {
			for (var y = 0; y < Game.level.height; y++) {
				if (y > (((Game.screen.yOffset + 32 - (Game.screen.yOffset % 32)) / 32) * -1) && y < (((Game.screen.yOffset - 450 - 32 - (Game.screen.yOffset % 32)) / 32) * -1))
					Game.level.tiles[x][y].render();
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

Level.prototype.fadeIn = function() {
	//ambience1.play();
	this.overlayAlpha = 1;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeInLevel, 50);
};

Level.prototype.fadeOut = function() {
	Game.sound.ambience1.stop();
	this.overlayAlpha = 0;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeOutLevel, 50);
};

function fadeInLevel() {
	if (Game.level !== null) {
		Game.level.overlayAlpha -= 0.030;
		Game.level.fadeStep++;
		if (Game.level.fadeStep < 75 && Game.level.isFading) {
			setTimeout(fadeInLevel, 50);
		} else {
			Game.level.isFading = false;
		}
	}
}

function fadeOutLevel() {
	if (Game.level !== null) {
		Game.level.overlayAlpha += 0.015;
		Game.level.fadeStep++;
		if (Game.level.fadeStep < 75 && Game.level.isFading) {
			setTimeout(fadeOutLevel, 50);
		} else {
			Game.level.isFading = false;
		}
	}
}

Level.prototype.drawOverlay = function() {
	ctx.fillStyle = "rgba(0, 0, 0, " + this.overlayAlpha + ")";
	ctx.fillRect(0, 0, 600, 450);
};function AssetLoader() {
	//this.callback = callback;
	this.assets = [
		"img/player.png"
	];
	this.assetsLoaded = 0;
	this.totalAssets = 1;
}

AssetLoader.prototype.load = function() {
	var _this = this;
	for (var i = 0; i < this.assets.length; i++) {
		if (this.assets[i].indexOf(".png" != -1)) {
			var img = new Image();
			img.src = this.assets[i];
			img.onload = function() {
				_this.assetsLoaded++;
				console.log("Assets loaded:" + _this.assetsLoaded);
			};
		}
	}
};

AssetLoader.prototype.getLoadPercent = function() {
	var percent = (this.assetsLoaded / this.totalAssets) * 100;
	if (percent > 100) percent = 100;
	if (percent < 0) percent = 0;
	if (isNaN(percent)) percent = 0;
	return percent;
};function ParticleManager() {
	this.particles = [];
}

ParticleManager.prototype.drawParticles = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].render();
		this.particles[i].update();
	}
};

ParticleManager.prototype.deleteParticle = function(p) {
	for (var i = 0; i < this.particles.length; i++) {
		if (this.particles[i] == p) {
			this.particles.splice(i, 1);
			break;
		}
	}
};

//Particle System - Red blood particles that fade out
ParticleManager.prototype.createBloodParticles = function(x, y) {
	var particleCount = Math.floor((Math.random() * 25)) + 5;
	while (particleCount--) {
		this.particles.push(new Particle(x, y, 122, 7, 1, random(0, Math.PI * 2), random(0.3, 2.5), 0.8, 0.9, 0.9, 30));
	}
};

/* Particle Object */

function Particle(x, y, r, g, b, angle, speed, friction, alpha, decay, lifetime) {
	this.x = x;
	this.y = y;
	this.lifeTime = lifetime;
	this.timeAlive = 0;
	this.r = r;
	this.g = g;
	this.b = b;
	this.coordinates = [];
	this.coordinateCount = 10;
	this.angle = angle;
	this.speed = speed;
	this.friction = friction;
	this.alpha = alpha;
	this.decay = decay;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x, this.y]);
	}
	Game.particles.particles.push(this);
}

Particle.prototype.render = function() {
	if (!Game.settings.particles) return;
	//TODO: Do not render offscreen particles. An onscreen check may be too costly, perhaps don't create them if offscreen?
	//Will have to look into the best way to do this. Reducing the number of particles is also a perf optimization possibility
	//Upper limit on number of particles perhaps?
	//ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	//ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	//ctx.lineTo( this.x+screen.xOffset, this.y+screen.yOffset );
	ctx.fillStyle = "#B21";
	ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ');';
	//ctx.beginPath();
	//ctx.arc(this.x+screen.xOffset,this.y+screen.yOffset, 9, 0, 2 * Math.PI, false);
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 2, 2);
	//ctx.fill();
};

Particle.prototype.update = function() {
	if (!Game.settings.particles) return;
	this.coordinates.pop();
	this.coordinates.unshift([this.x, this.y]);
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed;
	this.alpha *= this.decay;
	this.speed *= this.friction;
	this.timeAlive++;
	if (this.timeAlive >= this.lifeTime) {
		Game.particles.deleteParticle(this);
	}
};function Player() {
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
};function PlayerSpawn(x, y) {
	this.x = x;
	this.y = y;
	Game.entities.push(this);
}

PlayerSpawn.prototype.render = function() {

};

PlayerSpawn.prototype.update = function() {
	if (Game.inGame) {
		if (Game.player instanceof Player) {
			Game.player.x = this.x;
			Game.player.y = this.y;
		}
		Game.deleteEntity(this);
	}
};//point.js

function Point(x,y) {
	this.x = x;
	this.y = y;
}

Point.prototype.getDist = function(point) {
	var xs = 0;
	var ys = 0;

	xs = point.x - this.x;
	xs = xs * xs;

	ys = point.y - this.y;
	ys = ys * ys;

	return Math.sqrt( xs + ys );
};
function Screen() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 600;
	this.height = 450;
	this.maxXOffset = Game.level.width * 32 * -1;
	this.maxYOffset = Game.level.height * 32 * -1;
}

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

Screen.prototype.setOffset = function(x, y) {
	if (x > this.maxXOffset) x = this.maxXOffset;
	if (y > this.maxYOffset) y = this.maxYOffset;
	if (x > 0) x = 0;
	if (y > 0) y = 0;
	this.xOffset = x;
	this.yOffset = y;
};function Settings() {
	this.sound = true;
	this.particles = true;
}

Settings.prototype.toggle = function(str) {

};//Using audiofx.min.js


function SoundManager() {
	this.sounds = [{
		filename: 'sound.wav',
		name: 'asound'
	}, {
		filename: 'sound2.wav',
		name: 'asound2'
	}];

	this.totalAssets = 29;

	if (!AudioFX.supported)
		console.log("Browser does not support AudioFX (likely html5 audio unsupported)");
}

SoundManager.prototype.load = function() {
	var onload = function() {
		Game.loader.assetsLoaded++;
		console.log("Sound asset loaded");
	};
	for (var i = 1; i < this.sounds.length; i++) {
		this.sounds[i].sound = AudioFX('sounds/' + this.sounds[i].filename, {
			formats: ['wav'],
			pool: 2,
			volume: 0.9
		}, onload);
	}
};

SoundManager.prototype.playSound = function(name) {
	if (!Game.settings.sound) return;
	for (var i = 0; i < this.sounds.length; i++) {
		if (this.sounds[i].name === name) {
			this.sounds[i].sound.play();
			return;
		}
	}
};function Sprite(img) {
	this.img = new Image();
	this.img.src = img;
	this.scale = 1;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 1;
	this.height = 1;
	this.rotation = 0;
	this.frameWidth = 16;
	this.frameHeight = 16;
	this.loaded = false;
	this.rotation = 0;
	this.alpha = 1;
	this.fadeAmount = 0;
	var _this = this;
	this.img.onload = function() {
		_this.loaded = true;
		_this.width = _this.img.width;
		_this.height = _this.img.height;
	};
}

Sprite.prototype.render = function(x, y) {
	ctx.drawImage(this.img, this.xOffset, this.yOffset, this.width, this.height, x, y, this.width * this.scale, this.width * this.scale);
};
Sprite.prototype.renderOnScreen = function(x, y) {
	//Check if the entity is on Game.screen, and draw if so
	if (x + Game.screen.xOffset < Game.screen.width && x + Game.screen.xOffset > 0) {
		if (y + Game.screen.yOffset < Game.screen.height && y + Game.screen.yOffset > 0) {
			this.drawImage(x + Game.screen.xOffset, y + Game.screen.yOffset);
		}
	}
};

Sprite.prototype.drawImage = function(x, y) {
	if (this.fadeAmount !== 0) {
		this.alpha += this.fadeAmount;
		if (this.alpha >= 1) {
			this.fadeAmount = 0;
			if (this.onFadeIn !== undefined) this.onFadeIn();
			this.alpha = 1;
		}
		if (this.alpha <= 0) {
			this.fadeAmount = 0;
			if (this.onFadeOut !== undefined) this.onFadeOut();
			this.alpha = 0;
		}
	}
	if (this.rotation === 0) {
		ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, x, y, this.frameWidth * this.scale, this.frameWidth * this.scale);
	} else {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(degToRad(this.rotation));
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameWidth * this.scale);
		ctx.restore();
	}
};

Sprite.prototype.fadeOut = function(callback) {
	this.onFadeOut = callback;
	this.fadeAmount = -0.05;
};

Sprite.prototype.fadeIn = function(callback) {
	this.onFadeIn = callback;
	this.fadeAmount = 0.05;
};var tileSheet = new Image();
tileSheet.src = "img/tilesheet.png";

function Tile(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.boundingBox = new BoundingBox(this.x, this.y, 32, 32);
	if (this.id > 1) this.solid = true; //Specify which tile ID's should be solid here
}

Tile.prototype.setColor = function(color) {
	this.color = color;
};

Tile.prototype.render = function() {
	var xOffset = ((this.id - 1) % 4) * 32;
	var yOffset = Math.floor(((this.id - 1) / 4)) * 32;
	ctx.drawImage(tileSheet, xOffset, yOffset, 32, 32, this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 32, 32);
};

function isSolidTile(x, y) {
	if (Game.level.tiles[x][y] === undefined) return;
	if (Game.level.tiles[x][y] === null) return;
	if (Game.level.tiles[x][y].solid) return true;
	else return false;
}/**
 * tmx-loader.js  - A Javascript loader for the TMX File Format.
 *
 * 	Currenty Supports: 
 *						- Map
 *						- Layers
 *						- Tile Data (CSV only)
 *
 * 	Depends on: Jquery for file loading and XML parsing
 *
 */
 
var tmxloader = {}

tmxloader.trim  = function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

tmxloader.Map = function(width,height,tileWidth,tileHeight,layers,properties){
	this.width = width;
	this.height = height;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.tilesets = new Array();
	this.layers = new Array(layers);
	this.properties = properties;
}

tmxloader.Tileset = function(firstgid, name, tileWidth,tileHeight,src,width,height,properties){
	this.firstGid = firstgid;
	this.name = name;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.src = src;
	this.width = width;
	this.height = height;
	this.properties = properties;
}

tmxloader.Layer = function(layerName,width,height,properties){
	this.name = layerName;
	this.width = width;
	this.height = height;
	this.data  = new Array(height);
	this.properties = properties;
	
	for(var d = 0;d < height;++d){
		this.data[d] = new Array(width);
	}
	
	this.loadCSV = function(data){
		var layerData = tmxloader.trim(data).split('\n');		
		for(var x = 0; x <layerData.length; ++x){
			var line = tmxloader.trim(layerData[x]);
			var entries = line.split(',');
			for(var e = 0;e <width;++e){
				this.data[x][e] = entries[e];
			}
		}
	}	
}

tmxloader.Object = function(objectname, type, x, y, width, height,properties){
	this.name = objectname;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.type  = type;
	this.properties = properties;
}


tmxloader.ObjectGroup = function(groupname,width,height,properties){
	this.name = groupname;
	this.width = width;
	this.height = height;
	this.objects  = new Array();
	this.properties = properties;
}

tmxloader.parseProperties = function($xml){
     var properties = new Array();
	 $xml.find('properties:first ').each(function(){	
	 	$xml.find('property').each(function(){	
	 		console.log("Processing Property: " + $(this).attr("name") + " =  "+  $(this).attr("value"));
	 		properties[''+$(this).attr("name")+''] = $(this).attr("value");
	 	});
	 });
	 return properties;
}

tmxloader.load = function(url){

		var result;
		 $.ajax({
		    url: url,
		    type: 'get',
		    dataType: 'html',
		    async: false,
		    success: function(data) {
		        result = data;
		    } 
		 });

		 var xmlDoc = jQuery.parseXML( result );
		 $xml = $(xmlDoc);
		 $version = $xml.find("map").attr("version");
		 console.log('Parsing...' + $version);
		 $width = $xml.find("map").attr("width");
		 $height = $xml.find("map").attr("height");
		 
		 $tilewidth = $xml.find("map").attr("tilewidth");
		 $tileheight = $xml.find("map").attr("tileheight");
		 var properties = tmxloader.parseProperties($xml);
		 tmxloader.map = new tmxloader.Map($width,$height,$tilewidth,$tileheight, $xml.find('layer').length,properties);
		 
		 console.log('Creating Map...' +  tmxloader.map.width + " x " + tmxloader.map.height + " Tiles: " +  tmxloader.map.tileWidth + " x " +  tmxloader.map.tileHeight);
		 
		 console.log("Found " + $xml.find('layer').length + " Layers");
		 var layerCount = 0;
		 $xml.find('layer').each(function(){			
			console.log("Processing Layer: " + $(this).attr("name"));
			$data = $(this).find("data");
			
			$lwidth = $(this).attr("width");
		 	$lheight = $(this).attr("height");
		 	var properties = tmxloader.parseProperties($(this));
		 	tmxloader.map.layers[layerCount] = new tmxloader.Layer($(this).attr("name"),$lwidth,$lheight,properties);
		
			if($data.attr("encoding") =="csv"){
				console.log("Processing CSV");
				var eData = $data.text();
				tmxloader.map.layers[layerCount].loadCSV(eData);
				
			} else {
				console.log("Unsupported Encoding Scheme");
			}
			
			
			
			++layerCount;
		
		 });
		 
		$xml.find('tileset').each(function(){	
			 $firstgid = $(this).attr("firstgid");
			 $name = $(this).attr("name");
			 $tilewidth = $(this).attr("tilewidth");
			 $tileheight = $(this).attr("tileheight");
			 
				$image =  $(this).find('image');
				$src = $image.attr("source");
				$width = $image .attr("width");
			 	$height = $image .attr("height"); 
			 	var properties = tmxloader.parseProperties($(this));
			 tmxloader.map.tilesets.push(new tmxloader.Tileset($firstgid,$name,$tilewidth,$tileheight,$src,$width,$height,properties));
		 });
		 
		 $xml.find('objectgroup').each(function(){	
		 
		 		

			$lwidth = $(this).attr("width");
		 	$lheight = $(this).attr("height");
		 	$numobjects =  $(this).find('object').length;
		 	tmxloader.map.objectgroup = new Object();
		 	console.log("Processing Object Group: " + $(this).attr("name") + " with " + $numobjects + " Objects");
		 	var properties = tmxloader.parseProperties($(this));
		 	tmxloader.map.objectgroup[''+$(this).attr("name")+''] = new tmxloader.ObjectGroup($(this).attr("name"),$lwidth,$lheight,properties);
		
			$objectGroupName = $(this).attr("name");
				 $xml.find('object').each(function(){
				 	$objectname =  $(this).attr("name");
				 	$objecttype =  $(this).attr("type");
				 	$objectx = $(this).attr("x");
				 	$objecty = $(this).attr("y");
				 	$objectwidth = $(this).attr("width");
				 	$objectheight = $(this).attr("height");
				 	console.log("Processing Object: " + $objectname);
				 	var properties = tmxloader.parseProperties($(this));
				 	tmxloader.map.objectgroup[''+$objectGroupName+''].objects.push(new tmxloader.Object($objectname, $objecttype , $objectx, $objecty, $objectwidth,  $objectheight,properties) );
				 });

		 } );
		 
}	
function UI() {

}

UI.prototype.draw = function() {

};

UI.prototype.drawLoadingScreen = function() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	ctx.textAlign = 'center';
	ctx.fillStyle = "#FFF";
	ctx.font = 'normal 20px arial';
	ctx.fillText("Loading...", canvas.width / 2, canvas.height / 4);
	ctx.fillRect(130, canvas.height / 3, Game.loader.getLoadPercent() * 3, 30);
	ctx.fillText(Math.floor(Game.loader.getLoadPercent()) + "%", canvas.width / 2, canvas.height / 2);
};

UI.prototype.handleInput = function() {
	//Onclick handler

};