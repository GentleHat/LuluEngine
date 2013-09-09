
function PlayerSpawn(x,y) {
	this.x = x;
	this.y = y;
	entities.push(this);
}

PlayerSpawn.prototype.render = function() {

};

PlayerSpawn.prototype.update = function() {
	if (game.inGame) {
		if (player instanceof Player) {
			player.x = this.x;
			player.y = this.y;
		}
		deleteEntity(this);
	}
};