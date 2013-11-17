#pragma strict

var maxHealth : int;
var color : Color;
private var health : int;
private var power : float = 0.0;
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
	health -= numCollisionEvents * power;
	health = health < 0 ? 0 : health > maxHealth ? maxHealth : health;
	var components = new UnityEngine.Component[10];
	components = gameObject.transform.root.GetComponentsInChildren(Renderer);
	for (var component in components)
	{
		var renderer : Renderer = component as Renderer;
		renderer.material.color = Color.Lerp(color, Color.white, health * 1.0 / maxHealth);
	}
}