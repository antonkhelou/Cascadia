#pragma strict
var frequency = 440;
var gain : float = 0.05;

private var samplingRate: float = 48000;
private var bufferSize: int = 1024;
private var numBuffers: int = 4;

private var running: boolean = false;

private var stepSize: float;
private var wavetable: float[];

private var pointer: float;

function Start () {
	samplingRate = AudioSettings.outputSampleRate;
	AudioSettings.GetDSPBufferSize(bufferSize, numBuffers);
	
	wavetable = new float[bufferSize];
	stepSize = (bufferSize * frequency) / samplingRate;
	
	//Setup the wave table values for a sine wave
	for (var i = 0; i < bufferSize; i++) {
		wavetable[i] = Mathf.Sin(i * ((2 * Mathf.PI)/bufferSize));
	}
	
	pointer = 0;
	running = true; 
}

function Update () {
 
}

function OnAudioFilterRead(data:float[], channels:int) {
	if(!running)
        return;  
        
   	stepSize = (bufferSize * frequency) / samplingRate;

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

function setFrequency(newFrequency){
	frequency = newFrequency;
}
