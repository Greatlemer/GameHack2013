#pragma strict

function OnTriggerEnter2D(other : Collider2D) {
	var controlCharacter : ControlCharacter = other.GetComponent(ControlCharacter);
	if (controlCharacter)
	{
		controlCharacter.canClimb = true;
	}
}

function OnTriggerStay2D(other : Collider2D) {
	Debug.Log("Ladder triggered!!!");
	var controlCharacter : ControlCharacter = other.GetComponent(ControlCharacter);
	if (controlCharacter)
	{
		controlCharacter.canClimb = true;
	}
}

function OnTriggerExit2D(other : Collider2D) {
	var controlCharacter : ControlCharacter = other.GetComponent(ControlCharacter);
	if (controlCharacter)
	{
		controlCharacter.canClimb = false;
	}
}