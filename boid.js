'use strict'

// Lightly adapted (ongoing work) by Scott Richmond from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

class Boid {

  constructor (x, y) {
    // this.acceleration = createVector(0, 0)
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
      separation = this.separateFrom(boids).mult(1.5),
      alignment = this.alignWith(boids).mult(1.0),
      cohesion = this.cohereWith(boids).mult(1.0)

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
  separateFrom (boids) {
    let desiredSeparation = 25

    let tooCloseNeighbors = this.getNeighbors(boids, desiredSeparation)

    if (tooCloseNeighbors.length === 0) return new p5.Vector(0, 0)

    // Create a single vector that steers away from too closeness,
    // but weights according to the *inverse* of the distance
    let steerAway = tooCloseNeighbors.reduce((away, neighbor) => {
      let difference = p5.Vector.sub(this.position, neighbor.position),
        distance = difference.mag()

      difference.normalize()
        .div(distance)

      return p5.Vector.add(away, difference)
    }, new p5.Vector(0, 0))

    // Once we get that vector, we have a great deal more math to do
    // Divide it over the number of too close neighbors
    // Renorm it to the max speed
    // Then *subtract* it from the current velocity (steer away!)
    // And then limit it to the maximum force I'll feel
    steerAway.div(tooCloseNeighbors.length)
      .normalize()
      .mult(this.maxSpeed)
      .sub(this.velocity)
      .limit(this.maxForce)

    return steerAway

  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  alignWith (boids) {
    let neighborDistance = 50

    let neighbors = this.getNeighbors(boids, neighborDistance)

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
  cohereWith (boids) {
    let neighborDistance = 50,
      neighbors = this.getNeighbors(boids, neighborDistance)

    if (neighbors.length === 0) return new p5.Vector(0, 0)

    let averagePosition = Boid.calculateAverageOf(neighbors, 'position')

    let desired = p5.Vector.sub(averagePosition, this.position)
      .normalize()
      .mult(this.maxSpeed)

    let steer = p5.Vector.sub(desired, this.velocity)
      .limit(this.maxForce)

    return steer

  }

  getNeighbors (boids, withinDistance) {
    return boids.filter(boid => {
      let distance = p5.Vector.dist(this.position, boid.position)

      return distance > 0 && distance < withinDistance
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
