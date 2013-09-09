
var canvas = null;
var ctx = null;
var game = null;
var entities = [];

var gamewidth = 600;
var gameheight = 450;

//HTML onLoad event - Loading the game
$(document).ready(function() {
	canvas = document.getElementById('canvas');
	canvas.width = gamewidth;
	canvas.height = gameheight;
	//check whether browser supports getting canvas context
	if (canvas && canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.fillStyle="#000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}

	game = new Game();
	loop();
});

function Game() {
	this.level = null;
	this.currentLevel = 1;
	this.inGame = true; //Are we physically in the game level
}

Game.prototype.start = function() {
	this.inGame = true;
	this.level = new Level(this.currentLevel);
	this.level.fadeIn();
	player = new Player();
	screen = new Screen();
	ui = new UI();
};
Game.prototype.end = function() {
	this.level = null;
	entities = [];
	player = null;
	screen = null;
	ui = null;
};

Game.prototype.gameOver = function() {
	this.inGame = false;
	this.level.fadeOut();
	setTimeout("game.end();",4800); //After level fadeout do game.end()
};

/* Game Loop */
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function loop()
{
	requestAnimationFrame(loop);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
		then = now - (delta % interval);
		draw();
		update();
    }
}

function draw() {
	if (screen === null) return;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ui.draw();
	game.level.update();
	renderLevel(game.level);
	screen.scroll();

	//Sort entities by layer property before rendering
	entities.sort(sortByLayer);
	for (var i=0;i<entities.length;i++) {
		if (entities[i] !== null) {
			if (!(entities[i] instanceof Player)) entities[i].render();
			if (game.inGame) entities[i].update();
		}
	}

    player.render();
    game.level.drawOverlay();
    ui.draw();
    ctx.restore();
    //Clean up arrays
    if (entities.length > 400) {
		for (var i=0;i<entities.length;i++) {
			entities.clean(null);
		}
	}
	if (particles.length > 400) {
		for (var i=0;i<particles.length;i++) {
			particles.clean(null);
		}
	}
}

function sortByLayer(a,b) {
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

function deleteEntity(e) {
	for (var i=0;i<entities.length;i++) {
		if (entities[i] === e) {
			entities[i] = null; //Just null the value, it will be removed once the array gets too big
			break;
		}
	}
}

function update() {
	handleInteractions(); //input.js
}
