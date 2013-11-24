#pragma strict

function Awake () {
	this.transform.parent.GetComponent.<CharacterWeapon>().RegisterMuzzle(this.transform);
}