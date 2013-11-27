#pragma strict

class DamagableObject extends MonoBehaviour {
	public var maxHealth = 100;
	private var currentHealth : float = maxHealth;
	protected var stunned : boolean = false;
	private var damageColour : Color = Color.white;
	private var spriteRenderer : SpriteRenderer;

	final function TakeDamage(damageTaken : float, damageColour : Color) {
		if (damageColour != Color.white) {
			this.damageColour = damageColour;
		}
		this.TakeDamage(damageTaken);
	}

	final protected function TakeDamage(damageTaken : float) {
		this.currentHealth -= damageTaken;
		if (this.currentHealth <= 0) {
			this.currentHealth = 0;
			this.stunned = true;
		}
		else if (this.currentHealth >= this.maxHealth) {
			this.currentHealth = this.maxHealth;
			this.stunned = false;
		}
		if (this.spriteRenderer) {
			this.spriteRenderer.color = Color.Lerp(this.damageColour, Color.white, this.currentHealth * 1.0 / this.maxHealth);
		}
	}
	
	function Awake() {
		this.currentHealth = this.maxHealth;
    	this.spriteRenderer = this.transform.GetComponentInChildren.<SpriteRenderer>();
	}
}

private var collisionEvents : ParticleSystem.CollisionEvent[];
private var damagable : DamagableObject;

function Start () {
	this.damagable = this.transform.parent.GetComponent.<DamagableObject>();
}

function OnParticleCollision(other : GameObject)
{
	if (!other) {
		return;
	}
	var projectile = other.GetComponent.<Projectile>();
	if (!projectile) {
		return;
	}

	var particleSystem : ParticleSystem = other.GetComponent(ParticleSystem);
	var safeLength = particleSystem.safeCollisionEventSize;

	if (!collisionEvents || collisionEvents.Length < safeLength)
	{
		collisionEvents = new ParticleSystem.CollisionEvent[safeLength];
	}
	
	var numCollisionEvents = particleSystem.GetCollisionEvents(gameObject, collisionEvents);
	
	var damageDelivered = numCollisionEvents * projectile.Damage;
	this.damagable.TakeDamage(damageDelivered, projectile.damageColour);
}