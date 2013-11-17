﻿#pragma strict

var projectile : GameObject;
var key : String;
var char_controller : ControlCharacter;

function Start() {
	char_controller = this.transform.parent.parent.GetComponent.<ControlCharacter>();
	char_controller.fire = this;
}

function Update () {
}

function Fire() {
	if (char_controller.weapon != CharacterWeapon.Paintball)
		return;
	var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
	if (!char_controller.FacingRight)
	{
		var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
		if (!gameObject.transform.root.GetComponentInChildren(ControlCharacter).FacingRight)
		{
			dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
		}
		GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
	}
	GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
}
