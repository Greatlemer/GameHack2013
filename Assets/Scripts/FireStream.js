#pragma strict

var projectile : GameObject;
var key : String;
var projectileClone : GameObject = null;

function Start () {

}

function Update () {
	if (this.projectileClone && this.projectileClone.particleSystem.particleCount == 0)
	{
		GameObject.Destroy(this.projectileClone);
		this.projectileClone = null;
	}
	var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
	if (!gameObject.transform.root.GetComponentInChildren(ControlCharacter).FacingRight)
	{
		dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
	}
	if (this.projectileClone)
	{
		this.projectileClone.particleSystem.transform.position = transform.position;
		this.projectileClone.particleSystem.transform.rotation = dirMult * transform.rotation * projectile.transform.rotation;
	}
	if (Input.GetButtonDown(key))
	{	
		if (this.projectileClone)
		{
			this.projectileClone.particleSystem.enableEmission = true;
		}
		else
		{
			this.projectileClone = GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
		}
	}
	if (this.projectileClone && Input.GetButtonUp(key) && this.projectile.particleSystem.emissionRate > 0)
	{
		this.projectileClone.particleSystem.enableEmission = false;
	}
}