﻿#pragma strict

var moveForce = 5;
var maxSpeed = 50;
var FacingRight = true;

function Start () {
}

function Update () {
	if (!gameObject.activeSelf) {
		return;
	}
}

function FixedUpdate() {
	if (!gameObject.activeSelf) {
		return;
	}
    var h = Input.GetAxis("Horizontal");
    if(h * rigidbody2D.velocity.x < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.right * h * moveForce);
    }
    if(h > 0 && !FacingRight) {
    	FlipCharacter();
    }
    if(h < 0 && FacingRight) {
    	FlipCharacter();
    }
    if(Mathf.Abs(h) > 0.1) {
    	var anim = GetComponentInChildren(Animator);
    	anim.SetTrigger('Character.Walking');
    }
}

function FlipCharacter() {
	FacingRight = !FacingRight;
	var scale = transform.localScale;
	scale.x *= -1;
	transform.localScale = scale;
}