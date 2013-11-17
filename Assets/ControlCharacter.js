#pragma strict

var moveForce = 5;
var maxSpeed = 50;
var FacingRight = true;
var canClimb = false;

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
    var v = Input.GetAxis("Vertical");
    if (canClimb && v * rigidbody2D.velocity.y < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.up * v * moveForce + UnityEngine.Vector2(0.0, 9.81));
    }
    if (!canClimb) {
    	rigidbody2D.velocity.y = 0.0;
    }
    var anim = GetComponentInChildren(Animator);
    if(Mathf.Abs(h) > 0.1) {
    	anim.SetTrigger('Walking');
    }
    else {
    	anim.SetTrigger('Idle');
    }
}

function FlipCharacter() {
	FacingRight = !FacingRight;
	var scale = transform.localScale;
	scale.x *= -1;
	transform.localScale = scale;
}
