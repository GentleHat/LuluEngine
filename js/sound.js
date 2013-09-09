//Using audiofx.min.js

if (AudioFX.supported) {
	var sound = AudioFX('sounds/soundfile', { formats: ['wav'], pool:2, volume:0.5});
}