#pragma strict

class ControlCharacter extends DamagableObject {
}

var moveForce = 5;
var jumpForce = 250;
var maxSpeed = 50;
internal var canClimb = false;
internal var previousCanClimb = false;
var rangeModifier = 1;
var powerModifier = 1;
var recoveryRate : float = -5;
var paintColour : Color;

enum CharacterType { Leader, Defender, Speedy, Sharpshooter };
enum CharacterState { Inactive, Idling, Walking, Jumping, Climbing, Shooting };


public var facingRight = true;
private var state = CharacterState.Inactive;
var characterType = CharacterType.Leader;
private var anims : Animator[];
private var anims_length : int;

private var aimAngle : float = 0.0;
private var weaponController : Weapon;

private var groundCollider : Transform;

var canJump : boolean = true;

function Awake () {
	anims = GetComponentsInChildren.<Animator>();
    anims_length = anims.length;
    this.weaponController = this.GetComponentInChildren.<Weapon>();
    this.groundCollider = this.transform.Find("Ground Collider").transform;
    if (!this.facingRight) {
    	this.facingRight = true;
    	this.FlipCharacter();
    }
    super.Awake();
}

function Start () {
	var animation_trigger = 'Assign Leader';
	switch (this.characterType) {
		case CharacterType.Defender:
			animation_trigger = 'Assign Defender';
			break;
		case CharacterType.Leader:
			animation_trigger = 'Assign Leader';
			break;
		case CharacterType.Sharpshooter:
			animation_trigger = 'Assign Sharpshooter';
			break;
		case CharacterType.Speedy:
			animation_trigger = 'Assign Speedy';
			break;
	}
    var idx = 0;
	for(idx = 0; idx < anims_length; idx++) {
		anims[idx].SetTrigger(animation_trigger);
	}
	
	GameControl.RegisterCharacter(this);
}

function Update () {
	this.canJump = Physics2D.Linecast(this.groundCollider.position, this.transform.position, 1 << LayerMask.NameToLayer("Ground"));
	if (this.stunned) {
		this.TakeDamage(this.recoveryRate);
	}
}

function MoveHorizontally(horizontal_movement : float) {
	if (this.stunned) {
		return;
	}
    if(horizontal_movement * rigidbody2D.velocity.x < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.right * horizontal_movement * moveForce);
    }
    if(horizontal_movement > 0 && !facingRight) {
    	FlipCharacter();
    }
    else if(horizontal_movement < 0 && facingRight) {
    	FlipCharacter();
    }
    
    if(Mathf.Abs(horizontal_movement) > 0.1) {
    	ChangeState(CharacterState.Walking);
    }
    else if(state == CharacterState.Walking) {
    	ChangeState(CharacterState.Idling);
    }
}

function MoveVertically(vertical_movement : float) {
	if (this.stunned) {
		return;
	}
	if (canClimb && Mathf.Abs(vertical_movement) < 0.2) {
		rigidbody2D.velocity.y = 0.0;
	}
	else if (canClimb) {
	    if (vertical_movement * rigidbody2D.velocity.y < maxSpeed) {
	    	rigidbody2D.AddForce(UnityEngine.Vector2.up * vertical_movement * moveForce + UnityEngine.Vector2(0.0, 9.81));
	    	ChangeState(CharacterState.Climbing);
	    }
	}
	else if (canJump && vertical_movement > 0) {
	    rigidbody2D.AddForce(UnityEngine.Vector2.up * jumpForce + UnityEngine.Vector2(0.0, 9.81));
	    this.canJump = false;
	}
    else if (previousCanClimb && state == CharacterState.Climbing) {
    	rigidbody2D.velocity.y = 0.0;
    	ChangeState(CharacterState.Idling);
    }
    previousCanClimb = canClimb;
}

function AdjustAim(aim_movement : float) {
	if (this.stunned) {
		return;
	}
    if (aim_movement > 0 && aimAngle < 45.0)
    {
    	weaponController.transform.Rotate(UnityEngine.Vector3(0.0, 0.0, 1.0));
    	aimAngle += 1.0;
    }
    else if (aim_movement < 0 && aimAngle > -45.0)
    {
    	weaponController.transform.Rotate(UnityEngine.Vector3(0.0, 0.0, -1.0));
    	aimAngle -= 1.0;
    }
}

function FlipCharacter() {
	facingRight = !facingRight;
	var scale = transform.localScale;
	scale.x *= -1;
	transform.localScale = scale;
}

function ChangeState(newState : CharacterState) {
	if (newState == state) {
		return;
	}
	var animation_trigger = 'Inactive';
	switch (newState) {
		case CharacterState.Inactive:
			animation_trigger = 'Inactive';
			break;
		case CharacterState.Idling:
			animation_trigger = 'Idle';
			break;
		case CharacterState.Walking:
			animation_trigger = 'Walk';
			break;
		case CharacterState.Jumping:
			animation_trigger = 'Jump';
			break;
		case CharacterState.Climbing:
			animation_trigger = 'Climb';
			break;
		case CharacterState.Shooting:
			animation_trigger = 'Shoot';
			break;
	}
	state = newState;
    var idx = 0;
	for(idx = 0; idx < anims_length; idx++) {
		anims[idx].SetTrigger(animation_trigger);
	}
}

function Activate() {
	ChangeState(CharacterState.Idling);
}

function Deactivate() {
	ChangeState(CharacterState.Inactive);
}

function StartFiring() {
	if (this.stunned) {
		return;
	}
	this.weaponController.StartFiring(this.powerModifier, this.rangeModifier, this.facingRight, this.paintColour);
}

function CeaseFiring() {
	this.weaponController.CeaseFiring();
}

function NextWeapon() {
	if (this.stunned) {
		return;
	}
	this.weaponController.NextWeapon();
}

function PreviousWeapon() {
	if (this.stunned) {
		return;
	}
	this.weaponController.PreviousWeapon();
}