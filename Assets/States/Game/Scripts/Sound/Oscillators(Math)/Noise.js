#pragma strict
// un-optimized version of a noise generator
private var offset: float = 0;
var gain: float = 0.05;
var random = new System.Random();

function OnAudioFilterRead(data:float[], channels:int) {
	for (var i = 0; i < data.Length; i = i + channels) {
		data [i] = data [i] + (gain * (offset - 1.0f + random.NextDouble() * 2.0f));
		if (channels == 2)
			data [i + 1] = data [i];
	}
}

function Start () {

}

function Update () {

}

function setGain(newGain){
	gain = newGain;
}