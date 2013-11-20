#pragma strict

var projectile : GameObject;
var key : String;
var projectileClone : GameObject = null;
var char_controller : ControlCharacter;

function Start() {
	char_controller = this.transform.parent.parent.GetComponent.<ControlCharacter>();
	char_controller.firestream = this;
}

function Update () {
}

function Fire() {
	if (char_controller.weapon != CharacterWeapon.Soaker)
		return;
		
	if (this.projectileClone && this.projectileClone.particleSystem.particleCount == 0)
	{
		GameObject.Destroy(this.projectileClone);
		this.projectileClone = null;
	}
	var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
	if (!char_controller.FacingRight)
	{
		dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
	}
	if (this.projectileClone)
	{
		this.projectileClone.particleSystem.transform.position = transform.position;
		this.projectileClone.particleSystem.transform.rotation = dirMult * transform.rotation * projectile.transform.rotation;
	}	
	if (this.projectileClone)
	{
		this.projectileClone.particleSystem.enableEmission = true;
	}
	else
	{
		this.projectileClone = GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
	}
}

function CeaseFire() {
	if (this.projectileClone && this.projectile.particleSystem.emissionRate > 0)
	{
		this.projectileClone.particleSystem.enableEmission = false;
	}
}