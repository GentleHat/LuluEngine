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