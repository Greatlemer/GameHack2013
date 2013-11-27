#pragma strict

private var collisionEvents : ParticleSystem.CollisionEvent[];
private var character : ControlCharacter;

function Start () {
	this.character = this.transform.parent.GetComponent.<ControlCharacter>();
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
	this.character.TakeDamage(damageDelivered, projectile.damageColour);
}