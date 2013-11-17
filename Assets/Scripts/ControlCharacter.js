#pragma strict

var moveForce = 5;
var maxSpeed = 50;
var FacingRight = true;
var canClimb = false;
var previousCanClimb = false;

enum CharacterType { Leader, Defender, Speedy, Sharpshooter };
enum CharacterState { Inactive, Idling, Walking, Jumping, Climbing, Shooting };
enum CharacterWeapon { Soaker, Paintball }
private var first_weapon = CharacterWeapon.Soaker;
private var last_weapon = CharacterWeapon.Paintball;

private var state = CharacterState.Inactive;
var weapon = CharacterWeapon.Soaker;
var character_type = CharacterType.Leader;
private var anims : Animator[];
private var anims_length : int;

function Awake () {
	anims = GetComponentsInChildren.<Animator>();
    anims_length = anims.length;
}

function Start () {
	var animation_trigger = 'Assign Leader';
	switch (character_type) {
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
	if (state == CharacterState.Inactive) {
		return;
	}
	var newWeapon : CharacterWeapon;
	if (Input.GetButtonUp("WeaponChangePrev")) {
		if (weapon == first_weapon) {
			newWeapon = last_weapon;
		}
		else {
			newWeapon = weapon - 1;
		}
		ChangeWeapon(newWeapon);
	}
	if (Input.GetButtonUp("WeaponChangeNext")) {
		if (weapon == last_weapon) {
			newWeapon = first_weapon;
		}
		else {
			newWeapon = weapon + 1;
		}
		ChangeWeapon(newWeapon);
	}
}

function FixedUpdate() {
	if (state == CharacterState.Inactive) {
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
    if (previousCanClimb && !canClimb) {
    	rigidbody2D.velocity.y = 0.0;
    }
    
    // Keep upright
    rigidbody2D.angularVelocity = 0.0;
    
    if(Mathf.Abs(h) > 0.1) {
    	ChangeState(CharacterState.Walking);
    }
    else {
    	ChangeState(CharacterState.Idling);
    }
    previousCanClimb = canClimb;
}

function FlipCharacter() {
	FacingRight = !FacingRight;
	var scale = transform.localScale;
	scale.x *= -1;
	transform.localScale = scale;
}

function ChangeWeapon(newWeapon : CharacterWeapon) {
	if (newWeapon == weapon) {
		return;
	}
	var animation_trigger = 'CW Super Soaker';
	switch (newWeapon) {
		case CharacterWeapon.Soaker:
			animation_trigger = 'CW Super Soaker';
			break;
		case CharacterWeapon.Paintball:
			animation_trigger = 'CW Paintball';
			break;
	}
	weapon = newWeapon;
    var idx = 0;
	for(idx = 0; idx < anims_length; idx++) {
		anims[idx].SetTrigger(animation_trigger);
	}
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