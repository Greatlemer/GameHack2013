#pragma strict

private var activeCharacter : Transform;
private var minX = -10;
private var maxX = 10;
private var minY = 4.4;
private var maxY = 5.15;

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