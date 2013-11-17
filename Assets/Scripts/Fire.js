#pragma strict

var projectile : GameObject;
var key : String;

function Start () {

}

function Update () {
	if (this.transform.root.GetComponentInChildren(ControlCharacter).weapon != CharacterWeapon.Paintball)
		return;
	
	if (Input.GetButtonDown(key))
	{
		GameObject.Instantiate(projectile, transform.position, transform.rotation * projectile.transform.rotation);
	}
}