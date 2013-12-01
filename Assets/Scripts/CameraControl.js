#pragma strict

private var activeCharacter : Transform;
private var minX = -13.6;
private var maxX = 13.6;
private var minY = 3.25;
private var maxY = 8.23;

function Awake () {
	GameControl.RegisterCamera(this);
}

function ChangeFocus(newCharacter : ControlCharacter) {
	this.activeCharacter = newCharacter.transform;
	this.UpdateX();
}

function UpdateX() {
	var newX = this.activeCharacter.position.x;
	newX = Mathf.Clamp(newX, minX, maxX);
	this.transform.position.x = newX;
}

function UpdateY() {
	var newY = this.activeCharacter.position.y;
	newY = Mathf.Clamp(newY, minY, maxY);
	this.transform.position.y = newY;
}

function Update() {
	this.UpdateX();
	this.UpdateY();
}