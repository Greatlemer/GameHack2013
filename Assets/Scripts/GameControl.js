#pragma strict

var current_team = 1;
private static var characters : ControlCharacter[];
private static var activeCharacter = 0;
private static var characterCount = 0;

function Start () {

}

function Update () {
	var newCharacter : int;
	if (Input.GetButtonUp("CharacterChangeNext")) {
		newCharacter = (activeCharacter + 1) % characterCount;
		ActivateCharacter(newCharacter);
	}
	if (Input.GetButtonUp("CharacterChangePrev")) {
		newCharacter = (activeCharacter + characterCount - 1) % characterCount;
		ActivateCharacter(newCharacter);
	}
	
}

static function RegisterCharacter(newCharacter : ControlCharacter) {
	if(!characters) {
		characters = new ControlCharacter[16];
		newCharacter.Activate();
	}
	characters.SetValue(newCharacter, characterCount);
	characterCount++;
}

function ActivateCharacter(newCharacter : int) {
	characters[activeCharacter].Deactivate();
	characters[newCharacter].Activate();
	activeCharacter = newCharacter;
}