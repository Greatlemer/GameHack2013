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

private var aimAngle : float = 0.0;
var paintball_gun : PaintballGun;
var super_soaker : SuperSoaker;

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
}

function PreviousWeapon() {
	var newWeapon : CharacterWeapon;
	if (weapon == first_weapon) {
		newWeapon = last_weapon;
	}
	else {
		newWeapon = weapon - 1;
	}
	ChangeWeapon(newWeapon);
}

function NextWeapon() {
	var newWeapon : CharacterWeapon;
	if (weapon == last_weapon) {
		newWeapon = first_weapon;
	}
	else {
		newWeapon = weapon + 1;
	}
	ChangeWeapon(newWeapon);
}

function StartFiring() {
	super_soaker.StartFiring();
	paintball_gun.StartFiring();
}

function CeaseFiring() {
	super_soaker.CeaseFiring();
	paintball_gun.CeaseFiring();
}

function MoveHorizontally(horizontal_movement : float) {
    if(horizontal_movement * rigidbody2D.velocity.x < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.right * horizontal_movement * moveForce);
    }
    if(horizontal_movement > 0 && !FacingRight) {
    	FlipCharacter();
    }
    else if(horizontal_movement < 0 && FacingRight) {
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
    if (canClimb && vertical_movement * rigidbody2D.velocity.y < maxSpeed) {
    	rigidbody2D.AddForce(UnityEngine.Vector2.up * vertical_movement * moveForce + UnityEngine.Vector2(0.0, 9.81));
    	ChangeState(CharacterState.Climbing);
    }
    if (previousCanClimb && !canClimb) {
    	rigidbody2D.velocity.y = 0.0;
    	ChangeState(CharacterState.Idling);
    }
    previousCanClimb = canClimb;
}

function AdjustAim(aim_movement : float) {
    var weaponAnim = gameObject.transform.Find("Weapon Animation");
    if (aim_movement > 0 && aimAngle < 45.0)
    {
    	weaponAnim.transform.Rotate(UnityEngine.Vector3(0.0, 0.0, 1.0));
    	aimAngle += 1.0;
    }
    else if (aim_movement < 0 && aimAngle > -45.0)
    {
    	weaponAnim.transform.Rotate(UnityEngine.Vector3(0.0, 0.0, -1.0));
    	aimAngle -= 1.0;
    }
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
