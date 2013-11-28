#pragma strict

private var activeCharacter : Transform;
public var maxX = 9.2;
public var minX = -9.2;

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

function Update() {
	this.UpdateX();
}