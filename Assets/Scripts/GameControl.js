#pragma strict

var current_team = 1;
private static var characters : ControlCharacter[];
private static var activeCharacter = 0;
private static var characterCount = 0;
private static var activeCamera : CameraControl;

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
	if (Input.GetButtonDown("Fire")) {
		characters[activeCharacter].StartFiring();
	}
	if (Input.GetButtonUp("Fire")) {
		characters[activeCharacter].CeaseFiring();
	}
	if (Input.GetButtonUp("WeaponChangePrev")) {
		characters[activeCharacter].PreviousWeapon();
	}
	if (Input.GetButtonUp("WeaponChangeNext")) {
		characters[activeCharacter].NextWeapon();
	}
    var horizontal_input = Input.GetAxis("Horizontal");
    characters[activeCharacter].MoveHorizontally(horizontal_input);
    var vertical_input = Input.GetAxis("Vertical");
    characters[activeCharacter].MoveVertically(vertical_input);
    var aim_input = Input.GetAxis("Aim");
    characters[activeCharacter].AdjustAim(aim_input);
}

static function RegisterCharacter(newCharacter : ControlCharacter) {
	if(!characters) {
		characters = new ControlCharacter[16];
		newCharacter.Activate();
		if (activeCamera) {
			activeCamera.ChangeFocus(newCharacter);
		}
	}
	characters.SetValue(newCharacter, characterCount);
	characterCount++;
}

static function RegisterCamera(newCamera : CameraControl) {
	activeCamera = newCamera;
	if (characters) {
		activeCamera.ChangeFocus(characters[activeCharacter]);
	}
}

function ActivateCharacter(newCharacter : int) {
	characters[activeCharacter].Deactivate();
	characters[newCharacter].Activate();
	activeCharacter = newCharacter;
	activeCamera.ChangeFocus(characters[activeCharacter]);
}