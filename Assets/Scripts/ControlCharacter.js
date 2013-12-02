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
private var animators : Animator[];
private var animatorCount : int;

private var aimAngle : float = 0.0;
private var weaponController : Weapon;

private var groundCollider : Transform;

private var horizontalMovement : float;
private var verticalMovement : float;
private var aimMovement : float;

var jumping : boolean = false;

var canJump : boolean = true;
var onGround : boolean = true;

function Awake () {
	animators = GetComponentsInChildren.<Animator>();
    animatorCount = animators.length;
    this.weaponController = this.GetComponentInChildren.<Weapon>();
    this.groundCollider = this.transform.Find("Ground Collider").transform;
    if (!this.facingRight) {
    	this.facingRight = true;
    	this.FlipCharacter();
    }
    super.Awake();
}

function Start () {
	var animationTrigger = 'Is Leader';
	switch (this.characterType) {
		case CharacterType.Defender:
			animationTrigger = 'Is Defender';
			break;
		case CharacterType.Leader:
			animationTrigger = 'Is Leader';
			break;
		case CharacterType.Sharpshooter:
			animationTrigger = 'Is Sharpshooter';
			break;
		case CharacterType.Speedy:
			animationTrigger = 'Is Speedy';
			break;
	}
    var idx = 0;
	for(idx = 0; idx < animatorCount; idx++) {
		animators[idx].SetBool(animationTrigger, true);
	}
	
	GameControl.RegisterCharacter(this);
}

function Update () {
	var wasOnGround = this.onGround;
	this.onGround = Physics2D.Linecast(this.groundCollider.position, this.transform.position, 1 << LayerMask.NameToLayer("Ground"));
	if (this.jumping && this.rigidbody2D.velocity.y <= 0) {
		this.jumping = false;
	}
	this.canJump = !this.jumping && this.onGround;
	if (this.stunned) {
		this.TakeDamage(this.recoveryRate);
	}
    var idx = 0;
	for(idx = 0; idx < animatorCount; idx++) {
		animators[idx].SetBool("Character Active", this.state != CharacterState.Inactive);
	}
}

function FixedUpdate ()
{
	this.MoveHorizontally();
	this.MoveVertically();
	this.AdjustAim();
}

function MoveHorizontally(horizontalMovement : float) {
	this.horizontalMovement = horizontalMovement;
}

function MoveHorizontally() {
	if (this.stunned) {
		return;
	}
    if(horizontalMovement * rigidbody2D.velocity.x < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.right * horizontalMovement * moveForce);
    }
    if(horizontalMovement > 0 && !facingRight) {
    	FlipCharacter();
    }
    else if(horizontalMovement < 0 && facingRight) {
    	FlipCharacter();
    }
    
    if(Mathf.Abs(horizontalMovement) > 0.1) {
    	ChangeState(CharacterState.Walking);
    }
    else if(state == CharacterState.Walking) {
    	ChangeState(CharacterState.Idling);
    }
    var idx = 0;
	for(idx = 0; idx < animatorCount; idx++) {
		animators[idx].SetFloat("Horizontal Movement", rigidbody2D.velocity.x);
	}
}

function MoveVertically(verticalMovement : float) {
	this.verticalMovement = verticalMovement;
}

function MoveVertically() {
	if (this.stunned) {
		return;
	}
	if (this.canClimb && !this.onGround && Mathf.Abs(verticalMovement) <= 0.2) {
		// Add a force to counter gravity.
	    rigidbody2D.AddForce(UnityEngine.Vector2(0.0, 9.81));
	    // Then make sure that movement stops.
		rigidbody2D.velocity.y = 0.0;
	}
	else if (canClimb && Mathf.Abs(verticalMovement) > 0.2) {
	    if (verticalMovement * rigidbody2D.velocity.y < maxSpeed) {
	    	rigidbody2D.AddForce(UnityEngine.Vector2.up * verticalMovement * moveForce + UnityEngine.Vector2(0.0, 9.81));
	    	ChangeState(CharacterState.Climbing);
	    }
	}
	else if (canJump && verticalMovement > 0.2) {
	    rigidbody2D.AddForce(UnityEngine.Vector2.up * jumpForce + UnityEngine.Vector2(0.0, 9.81));
	    this.jumping = true;
	    this.canJump = false;
	}
    else if (previousCanClimb && state == CharacterState.Climbing) {
    	rigidbody2D.velocity.y = 0.0;
    	ChangeState(CharacterState.Idling);
    }
    previousCanClimb = canClimb;
    var idx = 0;
	for(idx = 0; idx < animatorCount; idx++) {
		animators[idx].SetBool("Can Climb", this.canClimb);
		animators[idx].SetBool("On Ground", this.onGround);
		animators[idx].SetFloat("Vertical Movement", rigidbody2D.velocity.y);
	}
}

function AdjustAim(aimMovement : float) {
	this.aimMovement = aimMovement;
}

function AdjustAim() {
	if (this.stunned) {
		return;
	}
    if (aimMovement > 0 && aimAngle < 45.0)
    {
    	weaponController.transform.Rotate(UnityEngine.Vector3(0.0, 0.0, 1.0));
    	aimAngle += 1.0;
    }
    else if (aimMovement < 0 && aimAngle > -45.0)
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
	state = newState;
}

function Activate() {
	ChangeState(CharacterState.Idling);
}

function Deactivate() {
	this.aimMovement = 0;
	this.verticalMovement = 0;
	this.horizontalMovement = 0;
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