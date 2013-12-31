//Using audiofx.min.js


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
};