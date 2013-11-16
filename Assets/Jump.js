#pragma strict

var jump = false;
var jumpForce = 200;
var moveForce = 5;
var maxSpeed = 50;

function Start () {

}

function Update () {
	if (Input.GetButtonDown("Jump")) {
		jump = true;
	}
}

function FixedUpdate() {
    var h = Input.GetAxis("Horizontal");
    if(h * rigidbody2D.velocity.x < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.right * h * moveForce);
    }
	if (jump) {
		rigidbody2D.AddForce(UnityEngine.Vector2(0,jumpForce));
		jump = false;
	}
}