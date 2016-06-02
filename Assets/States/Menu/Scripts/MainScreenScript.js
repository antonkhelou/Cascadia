#pragma strict

var mySkin : GUISkin;

var isMain = true;
var isPlay = false;
var isSongSelect = false;

function OnGUI(){
	GUI.skin = mySkin;
	displayMainScreen();
	displayPlayMeny();
	displaySongSelectionMenu();
}

function displayMainScreen(){
	if(isMain){
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
				if(GUILayout.Button("Play")){
					isMain = false;
					isPlay = true;
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Exit")){
					if (Application.isEditor){
						//add code to terminate execution from editor mode
					}
					else{
						Application.Quit();
					}
				}
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}
}

function displayPlayMeny(){
	if (isPlay){
		var rectWidth = 400;
		var rectHeight = 300;
		
		// Wrap everything in the designated GUI Area
		GUILayout.BeginArea(Rect((Screen.width-rectWidth)/2, (Screen.height-rectHeight)/2, rectWidth, rectHeight));
	
			// Begin the singular Horizontal Group
			GUILayout.BeginHorizontal();
				GUILayout.Label("Select a Mode");
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Normal")){
					isPlay = false;
					isSongSelect = true;
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Synthesis")){
					Application.LoadLevel(2);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Back")){
					isPlay = false;
					isMain = true;
				}
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}
}

function displaySongSelectionMenu(){
	if (isSongSelect){
		var rectWidth = 400;
		var rectHeight = 300;
		
		// Wrap everything in the designated GUI Area
		GUILayout.BeginArea(Rect((Screen.width-rectWidth)/2, (Screen.height-rectHeight)/2, rectWidth, rectHeight));
	
			// Begin the singular Horizontal Group
			GUILayout.BeginHorizontal();
				GUILayout.Label("Select a Song");
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Phaeleh - Willow")){
					GameLogic.audioTrack = Resources.Load("Audio/Phaeleh - Willow") as AudioClip;
					GameLogic.frequencyMultiplier = 80;
					Application.LoadLevel(1);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("J-One - Solar Flare")){
					GameLogic.audioTrack = Resources.Load("Audio/J-One - Solar Flare") as AudioClip;
					GameLogic.frequencyMultiplier = 83;
					Application.LoadLevel(1);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Binmaker - Dat Nu Nu")){
					GameLogic.audioTrack = Resources.Load("Audio/Binmaker - Dat Nu Nu") as AudioClip;
					GameLogic.frequencyMultiplier = 90;
					Application.LoadLevel(1);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Dave Brubeck - Quartet Take Five")){
					GameLogic.audioTrack = Resources.Load("Audio/Dave Brubeck - Quartet Take Five") as AudioClip;
					GameLogic.frequencyMultiplier = 150;
					Application.LoadLevel(1);
				}
			GUILayout.EndHorizontal();
			
			GUILayout.Space(10);
			
			GUILayout.BeginHorizontal();
				if(GUILayout.Button("Back")){
					isSongSelect = false;
					isPlay = true;
				}
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}
}