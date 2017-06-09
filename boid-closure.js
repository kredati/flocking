// Lightly adapted by Scott Richmond from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class

let createBoid = (x, y) => {

  let position = createVector(x, y),
    velocity = createVector(random(-1, 1), random(-1, 1)),
    maxSpeed = 3,
    maxForce = 0.05,
    radius = 3,
    triangle = new DirectionalTriangle(radius)

  let averageOf = (boids, property) => {
    if (!boids.length) return new p5.Vector(0, 0)

    let vectors = boids.map((boid) => boid[property])

    return vectors.reduce(
      (sum, vector) => p5.Vector.add(sum, vector),
      new p5.Vector(0, 0))
      .div(vectors.length)
  }

  let getBoidsWithin = (boids, withinDistance) => boids.filter((boid) => {
      let distance = p5.Vector.dist(position, boid.position)

      // distance > 0 is a kludge for not-self
      return distance > 0 && distance < withinDistance
    })

  // Separation
  // Method checks for nearby boids and steers away
  let separateFrom = (tooClose) => {

    if (tooClose.length === 0) return new p5.Vector(0, 0)

    // Create a single vector that steers away from too closeness,
    // but weights according to the *inverse* of the distance
    let steerAway = tooClose.reduce((away, neighbor) => {
      let difference = p5.Vector.sub(position, neighbor.position),
        distance = difference.mag()

      difference.normalize()
        .div(distance)

      return p5.Vector.add(away, difference)
    }, new p5.Vector(0, 0))

    // Once we get that vector, we have some more math to do
    steerAway.normalize()
      .mult(maxSpeed)
      .sub(velocity)
      .limit(maxForce)

    return steerAway

  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  let alignWith = (neighbors) => {

    if (neighbors.length === 0) return new p5.Vector(0, 0)

    let averageVelocity = averageOf(neighbors, 'velocity')

    averageVelocity.normalize()
      .mult(maxSpeed)

    let steer = p5.Vector.sub(averageVelocity, velocity)
      .limit(maxForce)

    return steer

  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids,
  // calculate steering vector towards that location
  let cohereWith = (neighbors) => {

    if (neighbors.length === 0) return new p5.Vector(0, 0)

    let averagePosition = averageOf(neighbors, 'position')

    let desired = p5.Vector.sub(averagePosition, position)
      .normalize()
      .mult(maxSpeed)

    let steer = p5.Vector.sub(desired, velocity)
      .limit(maxForce)

    return steer

  }

  // Method to update location
  let updatePosition = (acceleration) => {
    velocity = p5.Vector.add(velocity, acceleration)
      .limit(maxSpeed)

    position.add(velocity)
  }

  // Wraparound
  let wrapBorders = () => {
    if (position.x < -radius) position.x = width + radius
    if (position.y < -radius) position.y = height + radius
    if (position.x > width +radius) position.x = -radius
    if (position.y > height+radius) position.y = -radius
  }

  // We accumulate a new acceleration each time based on three rules
  let flockingWith = (boids) => {
    let acceleration = new p5.Vector(0, 0),
      neighborDistance = 50,
      tooCloseDistance = 25

    let neighbors = getBoidsWithin(boids, neighborDistance),
      tooClose = getBoidsWithin(neighbors, tooCloseDistance)

    let separation = separateFrom(tooClose).mult(1.5),
      alignment = alignWith(neighbors).mult(1.0),
      cohesion = cohereWith(neighbors).mult(1.0)

    // Add the force vectors to acceleration
    return acceleration
      .add(separation)
      .add(alignment)
      .add(cohesion)
  }

  let flyWith = (boids) => {
    let acceleration = flockingWith(boids)

    updatePosition(acceleration)
    wrapBorders()

    triangle.render(position, velocity.heading())
  }

  return Object.assign(self, {flyWith, position, velocity})

}
