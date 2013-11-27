#pragma strict

var projectile : GameObject;

class SuperSoaker extends CharacterWeapon {
	private var projectileClone : GameObject = null;
	
	function Awake() {
		this.weaponId = 0;
		super.Awake();
	}

	function StartFiring(powerModifier : float, rangeModifier : float, facingRight : boolean, paintColour : Color) {
		var projectileDetails = this.projectile.GetComponent.<Projectile>();
		projectileDetails.setColour(Color.white);
		projectileDetails.damageModifier = powerModifier;
		var dirMult : UnityEngine.Quaternion = UnityEngine.Quaternion.identity;
		if (!facingRight)
		{
			dirMult = UnityEngine.Quaternion.AngleAxis(180, UnityEngine.Vector3(0.0, 1.0, 0.0));
		}
		var transform = this.muzzle;
		if (this.projectileClone && this.projectileClone.particleSystem.particleCount == 0)
		{
			GameObject.Destroy(this.projectileClone);
			this.projectileClone = null;
		}
		if (this.projectileClone)
		{
			this.projectileClone.particleSystem.transform.position = transform.position;
			this.projectileClone.particleSystem.transform.rotation = dirMult * transform.rotation * projectile.transform.rotation;
		}	
		if (this.projectileClone)
		{
			this.projectileClone.particleSystem.enableEmission = true;
		}
		else
		{
			this.projectileClone = GameObject.Instantiate(projectile, transform.position, dirMult * transform.rotation * projectile.transform.rotation);
		}
	}

	function CeaseFiring() {
		if (this.projectileClone && this.projectile.particleSystem.emissionRate > 0)
		{
			this.projectileClone.particleSystem.enableEmission = false;
		}
	}
}