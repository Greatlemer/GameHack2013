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
	if (Input.GetButtonDown(key))
	{
		if (this.projectileClone)
		{
			this.projectileClone.particleSystem.enableEmission = true;
		}
		else
		{
			this.projectileClone = GameObject.Instantiate(projectile, transform.position, transform.rotation * projectile.transform.rotation);
		}
	}
	if (this.projectileClone && Input.GetButtonUp(key) && this.projectile.particleSystem.emissionRate > 0)
	{
		this.projectileClone.particleSystem.enableEmission = false;
	}
}