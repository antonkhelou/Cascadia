var mySkin : GUISkin;

//the audio clip we want to play
static var audioTrack : AudioClip;
static var frequencyMultiplier = 75;
//the listener (main camera for this example)
var listener : AudioListener;
//the number of samples we want to take
var numSamples : float = 64;
//the game object we will be using to represent our samples
var visualPrefab : GameObject;
var enableSynthesisMode = false;

static var minY = 0;
static var maxY = 5;

//how often we want to take a sample
static var timeSpace : float= 0.15;
//x-distance between each tick
static var xDistance : float = 2.25;

static var isDead = false;
private var isMenu = false;
private var isFinished = false;
 
private var volData : float[];
private var freqData : float[];
//we'll move along the z plane when placing our objects
private var curX : float = 0;

private var audioPlay: GameObject; 


private var startTime;
private var trackDuration;

/*
 * Reference on audio functions:
 * 		http://answers.unity3d.com/questions/157940/GetOutputData-and-GetSpectrumData-what-represent-the-values-returned.html
 *		http://docs.unity3d.com/Documentation/ScriptReference/AudioSource.GetSpectrumData.html
 *
 *	.GetSpectrumData (samples : float[], channel : int, window : FFTWindow)
 *		The size of the samples[] (lets call it Q ) defines the frequency resolution: each element shows the relative amplitude (0..1)
 *		of a the frequency equal to N * 24000 / Q Hertz (where N is the element index). With a 1024 array, for instance,
 *		you will have a resolution of 23.4 hertz (each element refers to a frequency 23.4 Hz higher than the previous one).
 *		This array shows all frequencies in the interval 0 - 24000 Hz.
 *
 *		Possible size values with associated frequency resolution:
 *			64 	-> 375 HZ
 *			128 -> 187.5 HZ
 *			256 -> 93.75 HZ
 *			512 -> 46.875 HZ
 *			1024 -> 23.4375 HZ
 *			2048 -> 11.71875 HZ
 *			4096 -> 5.859375 HZ
 *			8192 -> 2.9296875 HZ
 */
 
function Start() {
	isFinished = false;
	isDead = false;
		
	if(!enableSynthesisMode){
		//create audio player game object and position it at the same point as our audio listener
		audioPlay = new GameObject("audioPlay");
		audioPlay.AddComponent.<AudioSource>();
		audioPlay.transform.position = listener.transform.position;
		audioPlay.GetComponent.<AudioSource>().clip = audioTrack;
		audioPlay.GetComponent.<AudioSource>().Play();
		
		startTime = Time.time;
		trackDuration = audioPlay.GetComponent.<AudioSource>().clip.length;
		Invoke("EndGame", audioPlay.GetComponent.<AudioSource>().clip.length);
	}
 
	//prep our float arrays
	volData = new float[numSamples];
	freqData = new float[numSamples]; 
	
	
	InvokeRepeating("PlaceNewObject", 0, timeSpace);
}

function OnGUI(){
	GUI.skin = mySkin;
	displayInGameMenu();
	displaySynthesisMenu();
	displayRetryMenu();
}

function Update (){
    if(Input.GetKeyDown(KeyCode.Escape)){
    	isMenu = true;
    	if(!enableSynthesisMode)
    		audioPlay.GetComponent.<AudioSource>().Pause();
    }
}
 
function PlaceNewObject() {
	//update x position
	curX += xDistance;
 
	//get volume and frequency data
	listener.GetOutputData(volData, 0);
	listener.GetSpectrumData(freqData, 0, FFTWindow.BlackmanHarris);
 
	//apply signal processing function on the samples
	curVol = SignalRootMeanSquare(volData);
	curFreq = SignalRootMeanSquare(freqData);
 
	yPos = Mathf.Clamp(curFreq * frequencyMultiplier, 0, 5);
	
	//yPos = Mathf.Lerp(0, 6, curFreq*20);
 
	//instantiate our new visual object, adjusting x, y and z position as we go
	newVisual = Instantiate(visualPrefab, Vector3(curX, yPos, 0), transform.rotation);
}

function EndGame() {
	isFinished = true;
}


/*
 * Signal Processing Functions
 *
 */

function SignalAverage(samples: float[]){
	var result = 0.0;

	for (i = 0; i < samples.Length; i++) {
		result += samples[i];
	}
	
	result = result / samples.Length;
	
	return result;
}

function SignalEnergy(samples: float[]){
	var result = 0.0;

	for (i = 0; i < samples.Length; i++) {
		result += samples[i] * samples[i];
	}
	
	return result;
}

function SignalPower(samples: float[]){
	var result = 0.0;

	for (i = 0; i < samples.Length; i++) {
		result += samples[i];
	}
	
	result = result / samples.Length;
	
	return result;
}

function SignalRootMeanSquare(samples: float[]){
	var result = 0.0;

	for (i = 0; i < samples.Length; i++) {
		result += samples[i] * samples[i];
	}
	
	result = result / samples.Length;
	
	return Mathf.Sqrt(result);
}


//not sure if this is correct, the class notes say that its the power with the mean removed but the formula looks like the mean is squared
function SignalVariance(samples: float[]){
	return (SignalPower(samples) - SignalAverage(samples));
}

function displayInGameMenu(){
	if(isMenu){
		Time.timeScale = 0;
		var rectWidth = 400;
		var rectHeight = 300;
		
		// Wrap everything in the designated GUI Area
		GUILayout.BeginArea(Rect((Screen.width-rectWidth)/2, (Screen.height-rectHeight)/2, rectWidth, rectHeight));
	
			// Begin the singular Horizontal Group
			GUILayout.BeginHorizontal();
				GUILayout.Label("Cascadia");
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Resume Game")){
					isMenu = false;
					Time.timeScale = 1;
					audioPlay.GetComponent.<AudioSource>().Play();
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Restart Game")){
					Time.timeScale = 1;
					Application.LoadLevel(1);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Exit to Main Menu")){
					Time.timeScale = 1;
					Application.LoadLevel(0);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Exit Game")){
					Application.Quit();
				}
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}
}

function displayRetryMenu(){

	if(isDead || isFinished){
		Time.timeScale = 0;
		var rectWidth = 400;
		var rectHeight = 300;
		
		// Wrap everything in the designated GUI Area
		GUILayout.BeginArea(Rect((Screen.width-rectWidth)/2, (Screen.height-rectHeight)/2, rectWidth, rectHeight));
	
			// Begin the singular Horizontal Group
			GUILayout.BeginHorizontal();
				if(isDead){
					GUILayout.Label("Terminated");
				}
				else{
					GUILayout.Label("Score: " + Character.score);
				}	
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Restart Game")){
					Time.timeScale = 1;
					Application.LoadLevel(1);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Exit to Main Menu")){
					Time.timeScale = 1;
					Application.LoadLevel(0);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Exit Game")){
					Application.Quit();
				}
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}
}

private var sineFrequency = "440";
private var sineGain = "0.0";

private var squareFrequency = "440";
private var squareGain = "0.0";

private var sawtoothFrequency = "440";
private var sawtoothGain = "0.0";

private var triangleFrequency = "440";
private var triangleGain = "0.0";

private var noiseGain = "0.0";

private var noiseWTFrequency = "440";
private var noiseWTGain = "0.0";

private var fmModulatingFrequency = "2";
private var fmModulatingGain = "5";
private var fmCarrierFrequency = "240";
private var fmCarrierGain = "0.0";

function displaySynthesisMenu(){
	if(enableSynthesisMode){
		var rectWidth = Screen.width / 7;
		var rectHeight = 150;
		var obj : GameObject = GameObject.Find("GameLogic");
		
		// Wrap everything in the designated GUI Area
		GUILayout.BeginArea(Rect(rectWidth * 0,0, rectWidth, rectHeight));
			// Begin the singular Horizontal Group
			GUILayout.BeginVertical();
				GUILayout.Label("Sine");
				sineFrequency = GUILayout.TextField(sineFrequency);
				sineGain = GUILayout.TextField (sineGain);
				if(GUILayout.Button("Apply")){
					var objScript1 : Sine = obj.GetComponent(Sine);
					objScript1.setGain(float.Parse(sineGain));
					objScript1.setFrequency(float.Parse(sineFrequency));
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(rectWidth * 1,0, rectWidth, rectHeight));
			GUILayout.BeginVertical();
				GUILayout.Label("Square");
				squareFrequency = GUILayout.TextField(squareFrequency);
				squareGain = GUILayout.TextField(squareGain);
				if(GUILayout.Button("Apply")){
					var objScript2 : Square = obj.GetComponent(Square);
					objScript2.setGain(float.Parse(squareGain));
					objScript2.setFrequency(float.Parse(squareFrequency));
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(rectWidth * 2,0, rectWidth, rectHeight));
			GUILayout.BeginVertical();
				GUILayout.Label("Triangle");
				triangleFrequency = GUILayout.TextField(triangleFrequency);
				triangleGain = GUILayout.TextField(triangleGain);
				if(GUILayout.Button("Apply")){
					var objScript3 : Triangle = obj.GetComponent(Triangle);
					objScript3.setGain(float.Parse(triangleGain));
					objScript3.setFrequency(float.Parse(triangleFrequency));
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(rectWidth * 3,0, rectWidth, rectHeight));
			GUILayout.BeginVertical();
				GUILayout.Label("Sawtooth");
				sawtoothFrequency = GUILayout.TextField(sawtoothFrequency);
				sawtoothGain = GUILayout.TextField(sawtoothGain);
				if(GUILayout.Button("Apply")){
					var objScript4 : Sawtooth = obj.GetComponent(Sawtooth);
					objScript4.setGain(float.Parse(sawtoothGain));
					objScript4.setFrequency(float.Parse(sawtoothFrequency));
				}
			GUILayout.EndVertical();;
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(rectWidth * 4,0, rectWidth, rectHeight));
			GUILayout.BeginVertical();
				GUILayout.Label("Noise");
				noiseGain = GUILayout.TextField(noiseGain);
				if(GUILayout.Button("Apply")){
					var objScript5 : Noise = obj.GetComponent(Noise);
					objScript5.setGain(float.Parse(noiseGain));
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(rectWidth * 5,0, rectWidth, rectHeight));
			GUILayout.BeginVertical();
				GUILayout.Label("NoiseWT");
				noiseWTFrequency = GUILayout.TextField(noiseWTFrequency);
				noiseWTGain = GUILayout.TextField(noiseWTGain);
				if(GUILayout.Button("Apply")){
					var objScript6 : NoiseWT = obj.GetComponent(NoiseWT);
					objScript6.setGain(float.Parse(noiseWTGain));
					objScript6.setNoiseFrequency(float.Parse(noiseWTFrequency));
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(rectWidth * 6,0, rectWidth, rectHeight));
			GUILayout.BeginVertical();
				GUILayout.Label("FM Synth");
				fmModulatingFrequency = GUILayout.TextField(fmModulatingFrequency);
				fmModulatingGain = GUILayout.TextField(fmModulatingGain);
				fmCarrierFrequency = GUILayout.TextField(fmCarrierFrequency);
				fmCarrierGain = GUILayout.TextField(fmCarrierGain);
				if(GUILayout.Button("Apply")){
					var objScript7 : FMSynth = obj.GetComponent(FMSynth);
					objScript7.setModulatorGain(float.Parse(fmModulatingGain));
					objScript7.setModulatorFrequency(float.Parse(fmModulatingFrequency));
					objScript7.setCarrierGain(float.Parse(fmCarrierGain));
					objScript7.setCarrierFrequency(float.Parse(fmCarrierFrequency));
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
	}
}