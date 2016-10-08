
import THREE = require("three")

import { b2Utils } from "./";
import { Box2D } from "../thirdparty/box2d";

/**
 * Base class for an object that has three.js visuals and a Box2D body.
 * Visual elements should be parented to 'this.transform'. The position of
 * 'this.transform' is automatically updated to match the body.
 */
export class PhysicsLinkedObject
{
	public transform: THREE.Object3D;
	public body: Box2D.b2Body;

	constructor(body: Box2D.b2Body)
	{
		this.transform = new THREE.Object3D();

		b2Utils.AllObjects.push(this);
		
		if (body)
		{
			this.body = body;
			this.body.SetUserData(this);
		}
	}

	/**
	 * Destroys this object.
	 */
	public destroy(): void
	{
		if (this.transform && this.transform.parent)
		{
			this.transform.parent.remove(this.transform);
			delete this.transform;
		}

		var index = b2Utils.AllObjects.indexOf(this);
		if (index >= 0)
		{
			b2Utils.AllObjects.splice(index, 1);
		}

		this.destroyBody();
	}

	/**
	 * Destroys the body associated with this object.
	 */
	public destroyBody(): void
	{
		if (this.body)
		{
			this.body.GetWorld().DestroyBody(this.body);
			this.body = undefined;
		}
	}

	/**
	 * Updates this object once per frame.
	 */
	public update(deltaSec: number): void
	{
		this.syncTransformToBody();
	}

	/**
	 * Moves the THREE transform to match the body position.
	 */
	public syncTransformToBody(): void
	{
		if (this.body)
		{
			var physicsPos = this.body.GetPosition();
			this.transform.position.set(
				physicsPos.x * b2Utils.B2_SCALE, physicsPos.y * b2Utils.B2_SCALE, this.transform.position.z);
			this.transform.rotation.z = this.body.GetAngle();
		}
	}

	/**
	 * Moves the body position to match the THREE transform.
	 */
	public syncBodyToTransform(): void
	{
		if (this.body)
		{
			b2Utils.tempVector2.x = this.transform.position.x / b2Utils.B2_SCALE;
			b2Utils.tempVector2.y = this.transform.position.y / b2Utils.B2_SCALE;
			this.body.SetPositionAndAngle(b2Utils.tempVector2, this.transform.rotation.z);
		}
	}

	/**
	 * Applies the specified impulse to the center of the body, but does not allow it to
	 * increase the velocity above 'maxSpeed'. If the velocity is already above that, it can stay there.
	 * @param {Box2D.b2Vec2} impulse
	 * @param {Number} maxSpeed
	 */
	public applyLinearImpulseWithVelocityCap(impulse: Box2D.b2Vec2, maxSpeed: number): void
	{
		if (impulse.x == 0 && impulse.y == 0) return;
		
		var velocity = this.body.GetLinearVelocity();
		var velocityLength = velocity.Length();
		this.body.ApplyImpulse(impulse, this.body.GetPosition());
		this.limitSpeed(Math.max(maxSpeed, velocityLength));
	}

	/**
	 * Reduces the object's velocity to be no greater than the specified speed.
	 * @param {Number} maxSpeed
	 */
	public limitSpeed(maxSpeed: number): void
	{
		var postVelocity = this.body.GetLinearVelocity();
		var postVelocityLength = postVelocity.Length();
		if (postVelocityLength > maxSpeed)
		{
			postVelocity.x = maxSpeed * postVelocity.x / postVelocityLength;
			postVelocity.y = maxSpeed * postVelocity.y / postVelocityLength;
			this.body.SetLinearVelocity(postVelocity);
		}
	}

	/**
	 * Called by box2d when this object starts touching another.
	 * You cannot create or destroy bodies in here.
	 * @param {Box2D.b2Contact} contact
	 * @param {Box2D.b2Fixture} otherFixture
	 */
	public onBeginContact(contact: Box2D.b2Contact, otherFixture: Box2D.b2Fixture): void
	{

	}

	/**
	 * Called by box2d when this object stops touching another.
	 * You cannot create or destroy bodies in here.
	 * @param {Box2D.b2Contact} contact
	 * @param {Box2D.b2Fixture} otherFixture
	 */
	public onEndContact(contact: Box2D.b2Contact, otherFixture: Box2D.b2Fixture): void
	{

	}

	/**
	 * Called by box2d each frame this body is touching another body, before the response is calculated.
	 * The response can be disabled here.
	 * You cannot create or destroy bodies in here.
	 * @param {Box2D.b2Contact} contact
	 * @param {Box2D.b2Manifold} oldManifold
	 * @param {Box2D.b2Fixture} otherFixture
	 */
	public onPreSolve(contact: Box2D.b2Contact, oldManifold: Box2D.b2Manifold, otherFixture: Box2D.b2Fixture): void
	{

	}

	/**
	 * Called by box2d each frame this body is touching another body, after the response is calculated.
	 * You cannot create or destroy bodies in here.
	 * @param {Box2D.b2Contact} contact
	 * @param {Box2D.b2Impulse} impulse
	 * @param {Box2D.b2Fixture} otherFixture
	 */
	public onPostSolve(contact: Box2D.b2Contact, impulse: Box2D.b2ContactImpulse, otherFixture: Box2D.b2Fixture): void
	{

	}
};
