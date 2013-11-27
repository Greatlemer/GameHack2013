#pragma strict

// The amount of damage a particle of this type will do by default.
var baseDamage : float = 0;

// The colour of the damage that will be done by this particle.
var damageColour : Color;

// Larger values mean particle can travel further.
internal var rangeModifier : float = 1;

// Larger values mean particle does more damage.
internal var damageModifier : float = 1;

private var particles : ParticleSystem;
private var childProjectile : Projectile;

function Awake() {
}

function get Damage() {
	return baseDamage * damageModifier;
}

function setColour(newColour : Color) {
	this.setColour(newColour, false);
}

function setColour(newColour : Color, changeParticle : boolean) {
	if (changeParticle) {
		if (!this.particles) {
			this.particles = this.transform.GetComponent.<ParticleSystem>();
		}
		if (!this.childProjectile && this.transform.childCount > 0) {
			this.childProjectile = this.transform.GetChild(0).GetComponent.<Projectile>();
		}
		this.particles.startColor = newColour;
		if (this.childProjectile) {
			this.childProjectile.setColour(newColour, changeParticle);
		}
	}
	this.damageColour = newColour;
}