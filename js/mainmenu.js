function MainMenu() {
	this.landingScreen = new LandingScreen("img/landing.png");
	this.menuBackground = new Image();
	this.menuBackground.src = "img/mainmenu.png";
	this.buttons = [];
	this.inMenu = true;

	this.buttons.push(new Button(Game.width / 2 - 50, Game.height / 2 - 25, 100, 50, "Play", function() {
		Game.mainMenu.inMenu = false;
	}));
}

MainMenu.prototype.render = function() {
	if (this.landingScreen.active) {
		this.landingScreen.render();
	} else {
		ctx.drawImage(this.menuBackground, 0, 0);
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].render();
		}
	}
};

MainMenu.prototype.update = function() {
	if (this.landingScreen.active) {
		this.landingScreen.update();
	} else {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].update();
		}
	}
};


function LandingScreen(img) {
	this.img = new Image();
	this.img.src = img;
	var _this = this;
	this.loaded = false;
	this.img.onload = function() {
		_this.loaded = true;
	};
	this.active = true;
}

LandingScreen.prototype.render = function() {
	if (this.loaded)
		ctx.drawImage(this.img, 0, 0);
};

LandingScreen.prototype.update = function() {

	if (Game.input.mouse.down) {
		this.active = false;
	}
};

function Button(x, y, width, height, text, func) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.text = text;
	this.func = func;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
}

Button.prototype.render = function() {
	ctx.fillStyle = "#333333";
	ctx.fillRect(this.x, this.y, this.width, this.height);
	ctx.textAlign = "center";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
};

Button.prototype.update = function() {
	if (Game.input.mouse.down) {
		if (this.boundingBox.isPointIn(Game.input.mouse.x, Game.input.mouse.y)) {
			this.func();
		}
	}
};