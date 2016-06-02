#pragma strict
var mySkin : GUISkin;

var fadeTexture : Texture2D;

var comboExpiryTimeInSec = 1.15;
var deathTriggerTimeInSec = 3;
var enableGravity = true;

static var score = 0;
private var comboCount = 1;
private var lastComboTime = 0;

private var startFade = false;
private var deathToleranceThreshold = 3;
private var deathThreshold = 10;

/*
 * -clean up gui code into seperate script file
 * -fix combo and score values
 */

function Start(){
	Time.timeScale = 1;
}

function OnGUI(){
	GUI.skin = mySkin;
	displayScore();

	GUI.color = Color.black;
    GUI.color.a = Mathf.Lerp(1.0, 0.0, Time.time);
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeTexture);
	
	if(startFade){
        GUI.color = Color.black;
        if(transform.position.y >(GameLogic.maxY + deathToleranceThreshold)){
        	GUI.color.a = Mathf.Lerp(0.0, 1.0, transform.position.y*0.25 - (GameLogic.maxY + deathToleranceThreshold)*0.25);
        }
        else{
        	GUI.color.a = Mathf.Lerp(0.0, 1.0,(GameLogic.minY - deathToleranceThreshold)*0.25 - transform.position.y*0.25);
        }
        GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeTexture);
    }
}

function Update(){
    transform.Translate(Vector3.right * (GameLogic.xDistance / GameLogic.timeSpace)  * Time.deltaTime);
    
    if(enableGravity)
	    if (Input.GetButton("Jump") || Input.GetMouseButton(0)){
	    	transform.GetComponent.<Rigidbody>().velocity = Vector3(0, 10, 0);
	    }
	    else{
	    	transform.GetComponent.<Rigidbody>().velocity = Vector3(0, -10, 0);
	    }
    
    //put this code in subroutine, getting a bit costly..
    if(transform.position.y < (GameLogic.minY - deathToleranceThreshold) || transform.position.y > (GameLogic.maxY + deathToleranceThreshold)){
    	startFade = true;
    	
    	if(transform.position.y < (GameLogic.minY - deathThreshold) || transform.position.y > (GameLogic.maxY + deathThreshold)){
	    	//dead
	    	startFade = false;
	    	GameLogic.isDead = true;
    	}
    }
    else{
    	startFade = false;
    }
    
    //reset combocount, this is duplicate for visual reasons (don't want the GUI component to reset to 1 only on collision with coin)
    if ((Time.time - lastComboTime) >= comboExpiryTimeInSec){
    	comboCount = 1;
    }
}

function OnTriggerEnter( other : Collider ) {
    if (other.tag == "Coin") {
		if ((Time.time - lastComboTime) < comboExpiryTimeInSec){
        	comboCount++;
        }
        else{
        	comboCount = 1;
        }
        
        score += (5 * comboCount);
        Destroy(other.gameObject);
        
        lastComboTime = Time.time;
    }
}

function displayScore(){
	var rectWidth = 350;
	var rectHeight = 150;
	
	GUILayout.BeginArea(Rect(Screen.width-rectWidth, Screen.height-rectHeight, rectWidth, rectHeight));

		GUILayout.BeginHorizontal();
			GUILayout.Label(comboCount.ToString());
		GUILayout.EndHorizontal();
		
		GUILayout.BeginHorizontal();
			GUILayout.Label(score.ToString());
		GUILayout.EndHorizontal();

	GUILayout.EndArea();
}