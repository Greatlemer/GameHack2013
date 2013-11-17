#pragma strict

var projectile : GameObject;
var key : String;

function Start () {

}

function Update () {
	if (Input.GetButtonDown(key))
	{
		GameObject.Instantiate(projectile, transform.position, transform.rotation * projectile.transform.rotation);
	}
}