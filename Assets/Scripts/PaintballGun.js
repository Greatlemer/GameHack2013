#pragma strict

var projectile : GameObject;

class PaintballGun extends CharacterWeapon {

	function Awake() {
		this.weaponId = 1;
		super.Awake();
	}

	function StartFiring(powerModifier : float, rangeModifier : float, facingRight : boolean) {
		var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
		if (!facingRight)
		{
			dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
		}
		var transform = this.muzzle;
		GameObject.Instantiate(this.projectile, transform.position, dirMult * transform.rotation * this.projectile.transform.rotation);
	}

	function CeaseFiring() {
	}
}