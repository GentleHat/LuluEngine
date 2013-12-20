var entities = [];

function Entity(x,y) {
	this.x = x;
	this.y = y;
	this.layer = 1;
	entities.push(this);
}

Entity.prototype.render = function() {
	if (this.sprite !== undefined) {
		this.sprite.render(this.x,this.y);
	}
};

Entity.prototype.update = function() {

};