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
		var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
		if (!gameObject.transform.root.GetComponentInChildren(ControlCharacter).FacingRight)
		{
			dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
		}
		GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
	}
}