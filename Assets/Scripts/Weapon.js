#pragma strict
static var MAX_WEAPONS : int = 16;

class CharacterWeapon extends MonoBehaviour {
	var weaponId : int = Weapon.MAX_WEAPONS;
	protected var weaponController : Weapon = null;
	private var spriteRenderer : SpriteRenderer = null;
	protected var muzzle : Transform;

	function Activate() {
		this.spriteRenderer.enabled = true;
	}
		
	function Deactivate() {
		this.spriteRenderer.enabled = false;
		this.CeaseFiring();
	}
	
	function StartFiring(powerModifier : float, rangeModifier : float, facingRight : boolean, paintColour : Color) {
	}
	
	function CeaseFiring() {
	}

	function Awake() {
		this.weaponController = this.transform.parent.GetComponent.<Weapon>();
		this.spriteRenderer = this.GetComponent.<SpriteRenderer>();
		if (this.weaponController) {
			this.weaponController.RegisterWeapon(this);
		}
	}
	
	function RegisterMuzzle(muzzle : Transform) {
		this.muzzle = muzzle;
	}
}

private var weapons : CharacterWeapon[];
private var weaponCount : int = 0;
private var activeWeapon : int = 0;

function RegisterWeapon(newWeapon : CharacterWeapon) {
	if(!weapons) {
		weapons = new CharacterWeapon[MAX_WEAPONS];
	}
	var insertPosition = weaponCount;
	for (var idx : int = weaponCount - 1; idx >= 0; idx--) {
		if (weapons[idx].weaponId < newWeapon.weaponId) {
			break;
		}
		weapons[insertPosition] = weapons[idx];
		insertPosition--;
	}
	weapons.SetValue(newWeapon, insertPosition);
	weaponCount++;
	newWeapon.Deactivate();
}

function Start() {
	ActivateWeapon(activeWeapon);
}

function PreviousWeapon() {
	var newWeapon = (activeWeapon + weaponCount - 1) % weaponCount;
	ActivateWeapon(newWeapon);
}

function NextWeapon() {
	var newWeapon = (activeWeapon + 1) % weaponCount;
	ActivateWeapon(newWeapon);
}

function StartFiring(powerModifier : float, rangeModifier : float, facingRight : boolean, paintColour : Color) {
	weapons[activeWeapon].StartFiring(powerModifier, rangeModifier, facingRight, paintColour);
}

function CeaseFiring() {
	weapons[activeWeapon].CeaseFiring();
}

function ActivateWeapon(newWeapon : int) {
	weapons[activeWeapon].Deactivate();
	activeWeapon = newWeapon;
	weapons[activeWeapon].Activate();
}