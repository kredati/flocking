'use strict'

// Lightly adapted (ongoing work) by Scott Richmond from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x,y) {
  this.acceleration = createVector(0,0)
  this.velocity = createVector(random(-1,1),random(-1,1))
  this.position = createVector(x,y)
  this.r = 3.0
  this.maxspeed = 3    // Maximum speed
    this.maxforce = 0.05 // Maximum steering force

  this.run = function(boids) {
    this.flock(boids)
    this.update()
    this.borders()
    this.render()
  }

  // We accumulate a new acceleration each time based on three rules
  this.flock = function(boids) {
    var separation = this.separate(boids)   // Separation
    var alignment = this.align(boids)      // Alignment
    var cohesion = this.cohesion(boids)   // Cohesion
    // Arbitrarily weight these forces
    separation.mult(1.5)
    alignment.mult(1.0)
    cohesion.mult(1.0)
    // Add the force vectors to acceleration
    this.applyForce(separation)
    this.applyForce(alignment)
    this.applyForce(cohesion)
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force)
  }

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration)
    // Limit speed
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0)
  };

  this.render = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90)
    fill(200, 200, 200, 100)
    noStroke()
    push()
    translate(this.position.x,this.position.y)
    rotate(theta)
    beginShape()
    vertex(0, -this.r*2)
    vertex(-this.r, this.r*2)
    vertex(this.r, this.r*2)
    endShape(CLOSE)
    pop()
  };

  // Wraparound
  this.borders = function() {
    if (this.position.x < -this.r)  this.position.x = width +this.r
    if (this.position.y < -this.r)  this.position.y = height+this.r
    if (this.position.x > width +this.r) this.position.x = -this.r
    if (this.position.y > height+this.r) this.position.y = -this.r
  };

  // Separation
  // Method checks for nearby boids and steers away
  this.separate = function(boids) {
    var desiredseparation = 25.0
    var steer = createVector(0,0)
    var count = 0
    // For every boid in the system, check if it's too close
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position,boids[i].position)
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position,boids[i].position)
        diff.normalize()
        diff.div(d)        // Weight by distance
        steer.add(diff)
        count++           // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count)
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize()
      steer.mult(this.maxspeed)
      steer.sub(this.velocity)
      steer.limit(this.maxforce)
    }
    return steer
  };

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  this.align = function(boids) {
    var neighbordist = 50
    var sum = createVector(0,0)
    var count = 0
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity)
        count++
      }
    }
    if (count > 0) {
      sum.div(count)
      sum.normalize()
      sum.mult(this.maxspeed)
      var steer = p5.Vector.sub(sum,this.velocity)
      steer.limit(this.maxforce)
      return steer
    } else {
      return createVector(0,0)
    }
  };

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  this.cohesion = function (boids) {
    let neighborDisance = 50,
      neighborCount = 0

    let neighbors = boids.filter((boid) => {
      let distance = p5.Vector.dist(this.position, boid.position)
      return (distance < 50)
    })

    if (neighbors.length === 0) return new p5.Vector(0, 0)

    let sum = neighbors.reduce((vector, neighbor) => {
      return p5.Vector.add(vector, neighbor.position)
    }, new p5.Vector(0, 0))

    return this.seek(sum.div(neighbors.length))

  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {
    var desired = p5.Vector.sub(target,this.position)  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize()
    desired.mult(this.maxspeed)
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired,this.velocity)
    steer.limit(this.maxforce)  // Limit to maximum steering force
    return steer
  };
}