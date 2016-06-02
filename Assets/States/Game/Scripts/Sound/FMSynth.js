#pragma strict
var frequencyModulator : float = 440.0;
var gainModulator : float = 5.0;
var frequenyCarrier : float = 240.0;
var gainCarrier : float = 0.25;

private var wavetable: float[];

private var stepSizeModulator: float;
private var stepSizeCarrier: float;

private var pointerModulator: float;
private var pointerCarrier: float;

private var modulatorSignal:float;

private var samplingRate: float = 48000;
private var bufferSize: int = 1024;
private var numBuffers: int = 4;

private var running: boolean = false;

function Start () {
	samplingRate = AudioSettings.outputSampleRate;
	AudioSettings.GetDSPBufferSize(bufferSize, numBuffers);
	
	wavetable = new float[bufferSize];
	
	stepSizeModulator = (bufferSize * frequencyModulator) / samplingRate;
	stepSizeCarrier = (bufferSize * frequenyCarrier) / samplingRate;
	
	//Setup the wave table values for a sine wave
	for (var i = 0; i < bufferSize; i++) {
		wavetable[i] = Mathf.Sin(i * ((2 * Mathf.PI)/bufferSize));
	}
	
	pointerModulator = 0;
	pointerCarrier = 0;
	
	running = true; 
}

function Update () {

}

function OnAudioFilterRead(data:float[], channels:int) {
	if(!running)
        return; 

	for (var i = 0; i < data.Length; i = i + channels) {
		//Get the sample value for the modulator and apply deviation
		if(Mathf.Floor(pointerModulator) == pointerModulator)
			modulatorSignal = gainModulator * wavetable[pointerModulator];
		else{
			if(Mathf.Floor(pointerModulator) + 1 != bufferSize)
				modulatorSignal = gainModulator * Mathf.Lerp(wavetable[Mathf.Floor(pointerModulator)], wavetable[Mathf.Floor(pointerModulator) + 1],  pointerModulator % 1);
			else 
				modulatorSignal = gainModulator * Mathf.Lerp(wavetable[Mathf.Floor(pointerModulator)], wavetable[0],  pointerModulator % 1);
		}

		//Get and scale the sample value of the modulated carrier signal (this is because the pointerCarrier is altered with respect to the modulatorSignal. see below)
		if(Mathf.Floor(pointerCarrier) == pointerCarrier)
			data[i] = data[i] + (gainCarrier * wavetable[pointerCarrier]);
		else{
			if(Mathf.Floor(pointerCarrier) + 1 != bufferSize)
				data[i] = data[i] + (gainCarrier * Mathf.Lerp(wavetable[Mathf.Floor(pointerCarrier)], wavetable[Mathf.Floor(pointerCarrier) + 1],  pointerCarrier % 1));
			else 
				data[i] = data[i] + (gainCarrier * Mathf.Lerp(wavetable[Mathf.Floor(pointerCarrier)], wavetable[0],  pointerCarrier % 1));

		}

		//compute the step sizes within this function since the carrier or modulator frequencies can be changed while this is being executed.
		//since this function is called every 22ms, this is the max delay we can have before out sound changes
    	stepSizeModulator = (bufferSize * frequencyModulator) / samplingRate;
    	
    	//here we calcuated the step size for the modulated carrier signal
    	//we make the value absolute because the modulatorSignal value may be negative, which can bring us to a negative stepSize
		stepSizeCarrier = Mathf.Abs((bufferSize * (frequenyCarrier + (modulatorSignal * frequencyModulator))) / samplingRate);
		
		data[i + 1] = data[i];
		
		//update the pointers
		pointerModulator += stepSizeModulator;
		pointerCarrier += stepSizeCarrier;
		
		//make sure they are within wavetable size
		if (pointerModulator >= bufferSize)
			pointerModulator = pointerModulator % bufferSize;
			
		if (pointerCarrier >= bufferSize)
			pointerCarrier = pointerCarrier % bufferSize;
	}
}

function setModulatorGain(newGain){
	gainModulator = newGain;
}

function setModulatorFrequency(newFrequency){
	frequencyModulator = newFrequency;
}

function setCarrierGain(newGain){
	gainCarrier = newGain;
}

function setCarrierFrequency(newFrequency){
	frequenyCarrier = newFrequency;
}

