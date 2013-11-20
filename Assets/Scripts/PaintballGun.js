#pragma strict

var projectile : GameObject;
var char_controller : ControlCharacter;

function Start() {
	char_controller = this.transform.parent.parent.GetComponent.<ControlCharacter>();
	char_controller.paintball_gun = this;
}

function Update () {
}

function StartFiring() {
	if (char_controller.weapon != CharacterWeapon.Paintball)
		return;
	var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
	if (!char_controller.FacingRight)
	{
		dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
	}
	GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
}

function CeaseFiring() {
}