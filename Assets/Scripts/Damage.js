#pragma strict

var maxHealth : int;
private var health : int;
private var power = 0;
private var collisionEvents = new ParticleSystem.CollisionEvent[16];
private var particles = new ParticleSystem.Particle[1000];

function Start () {
	health = maxHealth;
}

function Update () {

}

function OnParticleCollision(other : GameObject)
{
	var particleSystem : ParticleSystem;
	particleSystem = other.GetComponent(ParticleSystem);
	
	var safeLength = particleSystem.safeCollisionEventSize;
	if (collisionEvents.Length < safeLength)
	{
		collisionEvents = new ParticleSystem.CollisionEvent[safeLength];
	}
	
	var numCollisionEvents = particleSystem.GetCollisionEvents(gameObject, collisionEvents);
	
	if (other && other.GetComponent(Power))
	{
		power = other.GetComponent(Power).power;
	}
	health -= numCollisionEvents / 10.0 * power;
	health = health < 0 ? 0 : health > maxHealth ? maxHealth : health;
	gameObject.renderer.material.color = Color.Lerp(Color.red, Color.white, health / 100.0);
}