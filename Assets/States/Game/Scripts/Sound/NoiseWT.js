#pragma strict
private var offset: float = 0;
var noiseFrequency: float = 440;
var gain : float = 0.05;

private var random = new System.Random();
private var wavetable: float[];

private var stepSize: float;
private var pointer: float;

private var modulatorSignal:float;

private var samplingRate: float = 48000;
private var bufferSize: int = 1024;
private var numBuffers: int = 4;

private var running: boolean = false;

function Start () {
	samplingRate = AudioSettings.outputSampleRate;
	AudioSettings.GetDSPBufferSize(bufferSize, numBuffers);
	
	wavetable = new float[bufferSize];
	
	
	//Setup the wave table values for a sine wave
	for (var i = 0; i < bufferSize; i++) {
		wavetable[i] = offset - 1.0f + random.NextDouble() * 2.0f;;
	}
	
	pointer = 0;
	
	running = true; 
}

function Update () {

}

function OnAudioFilterRead(data:float[], channels:int) {
	if(!running)
        return;  
        
   	stepSize = (bufferSize * noiseFrequency) / samplingRate;

	for (var i = 0; i < data.Length; i = i + channels) {
		if(Mathf.Floor(pointer) == pointer)
			data[i] = data[i] + (gain * wavetable[pointer]);
		else{
			if(Mathf.Floor(pointer) + 1 != bufferSize)
				data[i] = data[i] + (gain * Mathf.Lerp(wavetable[Mathf.Floor(pointer)], wavetable[Mathf.Floor(pointer) + 1],  pointer % 1));
			else 
				data[i] = data[i] + (gain * Mathf.Lerp(wavetable[Mathf.Floor(pointer)], wavetable[0],  pointer % 1));
		}
		
		data[i + 1] = data[i];
		
		pointer += stepSize;
		
		if (pointer >= bufferSize)
			pointer = pointer % bufferSize;
	}
}

function setGain(newGain){
	gain = newGain;
}

function setNoiseFrequency(newFrequency){
	noiseFrequency = newFrequency;
}
