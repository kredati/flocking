'use strict'

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

class Flock {
  // An array for all the boids
  constructor () {
    this.boids = [] // Initialize the array
  }

  run () {
    this.boids.forEach(boid => boid.run(this.boids))
  }

  addBoid (boid) {
    this.boids.push(boid)
  }
}
