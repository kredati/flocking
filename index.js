// Adapted by Scott Richmond for CIN360H1-S17 from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

'use strict'

let counter

let flock = []

var setup = () => {
  createCanvas(800, 600)

  let instructions =
    createP('Drag the mouse to generate new boids. (Using dumb closures.)')

  counter = createP('There are 60 boids.')

  instructions.position(10, 600)
  counter.position(600, 600)

  60..times(() => flock.push(createBoid(width/2, height/2)))
}

var draw = () => {
  background(51)
  flock.forEach((boid) => boid.flyWith(flock))
}

// Add a new boid into the System
var mouseDragged = () => {
  flock.push(createBoid(mouseX, mouseY))

  counter.html(`There are ${flock.length} boids.`)
}
