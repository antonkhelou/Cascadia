#pragma strict
var frequency = 440;
var gain : float = 0.05;

private var increment: double = 0.0;
private var phase: double = 0.0;

private var samplingRate: int = 48000;
private var waveTableSize: int = 1024;
private var numBuffers: int = 4;

private var running: boolean = false;

function Start () {
	samplingRate = AudioSettings.outputSampleRate;
	AudioSettings.GetDSPBufferSize(waveTableSize, numBuffers);

	running = true; 
}

function Update () {
 
}

function OnAudioFilterRead(data:float[], channels:int) {
	if(!running)
        return;

	increment = frequency * 2 * System.Math.PI / samplingRate;
	
	for (var i = 0; i < data.Length; i = i + channels) {
		if(phase < Mathf.PI){
			data [i] =gain; 
		}
		else{
			data [i] =-gain; 
		}

		if (channels == 2)
			data [i+1] = data [i];
		if (phase > 2 * Mathf.PI)
			phase = phase - (2 * Mathf.PI);
			
		phase = phase + increment;
	}
}