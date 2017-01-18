'use strict'

// Lightly adapted by Scott Richmond from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class

class Boid {

  constructor (x, y) {
    this.position = createVector(x, y)

    this.velocity = createVector(random(-1, 1), random(-1, 1))

    this.maxSpeed = 3
    this.maxForce = 0.05

    this.radius = 3

    this.triangle = new DirectionalTriangle(this.radius)
  }

  flyWith (boids) {
    let acceleration = this.flockingWith(boids)

    this.updatePosition(acceleration)
    this.wrapBorders()

    this.triangle.render(this.position, this.velocity.heading())
  }

  // We accumulate a new acceleration each time based on three rules
  flockingWith (boids) {
    let acceleration = new p5.Vector(0, 0),
      neighborDistance = 50,
      tooCloseDistance = 25

    let neighbors = this.getBoidsWithin(boids, neighborDistance),
      tooClose = this.getBoidsWithin(neighbors, tooCloseDistance)

    let separation = this.separateFrom(tooClose).mult(1.5),
      alignment = this.alignWith(neighbors).mult(1.0),
      cohesion = this.cohereWith(neighbors).mult(1.0)

    // Add the force vectors to acceleration
    return acceleration.add(separation)
      .add(alignment)
      .add(cohesion)
  }

  // Method to update location
  updatePosition (acceleration) {
    this.velocity = p5.Vector.add(this.velocity, acceleration)
      .limit(this.maxSpeed)

    this.position.add(this.velocity)
  }

  // Wraparound
  wrapBorders () {
    if (this.position.x < -this.radius) this.position.x = width + this.radius
    if (this.position.y < -this.radius) this.position.y = height + this.radius
    if (this.position.x > width +this.radius) this.position.x = -this.radius
    if (this.position.y > height+this.radius) this.position.y = -this.radius
  }

  // Separation
  // Method checks for nearby boids and steers away
  separateFrom (tooClose) {

    if (tooClose.length === 0) return new p5.Vector(0, 0)

    // Create a single vector that steers away from too closeness,
    // but weights according to the *inverse* of the distance
    let steerAway = tooClose.reduce((away, neighbor) => {
      let difference = p5.Vector.sub(this.position, neighbor.position),
        distance = difference.mag()

      difference.normalize()
        .div(distance)

      return p5.Vector.add(away, difference)
    }, new p5.Vector(0, 0))

    // Once we get that vector, we have some more math to do
    steerAway.normalize()
      .mult(this.maxSpeed)
      .sub(this.velocity)
      .limit(this.maxForce)

    return steerAway

  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  alignWith (neighbors) {

    if (neighbors.length === 0) return new p5.Vector(0, 0)

    let averageVelocity = Boid.calculateAverageOf(neighbors, 'velocity')

    averageVelocity.normalize()
      .mult(this.maxSpeed)

    let steer = p5.Vector.sub(averageVelocity, this.velocity)
      .limit(this.maxForce)

    return steer

  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids,
  // calculate steering vector towards that location
  cohereWith (neighbors) {

    if (neighbors.length === 0) return new p5.Vector(0, 0)

    let averagePosition = Boid.calculateAverageOf(neighbors, 'position')

    let desired = p5.Vector.sub(averagePosition, this.position)
      .normalize()
      .mult(this.maxSpeed)

    let steer = p5.Vector.sub(desired, this.velocity)
      .limit(this.maxForce)

    return steer

  }

  getBoidsWithin (boids, withinDistance) {
    return boids.filter(boid => {
      let distance = p5.Vector.dist(this.position, boid.position)

      return boid !== this && distance < withinDistance
    })
  }

  static calculateAverageOf(boids, property) {
    if (!boids.length) return new p5.Vector(0, 0)

    let vectors = boids.map(boid => boid[property])

    return vectors.reduce(
      (sum, vector) => p5.Vector.add(sum, vector),
      new p5.Vector(0, 0))
      .div(vectors.length)
  }
}
