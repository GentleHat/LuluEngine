var canvas = null;
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
}