function MainMenu() {
	this.landingScreen = new LandingScreen("img/landing.png");
	this.buttons = [];
	this.inMenu = true;
}

MainMenu.prototype.render = function() {
	if (this.landingScreen.active) {
		this.landingScreen.render();
		this.landingScreen.update();
	} else {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].render();
		}
		this.inMenu = false; //No menu yet, just landing
	}
};

MainMenu.prototype.update = function() {
	if (this.landingScreen.active) {
		this.landingScreen.update();
	} else {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].render();
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