var entities = [];

function Entity(x,y) {
	this.x = x;
	this.y = y;
	this.layer = 1;
	entities.push(this);
}

Entity.prototype.render = function() {

};

Entity.prototype.update = function() {

};