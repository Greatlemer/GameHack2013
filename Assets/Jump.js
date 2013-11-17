#pragma strict

var moveForce = 5;
var maxSpeed = 50;

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
}