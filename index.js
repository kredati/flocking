// Adapted by Scott Richmond for CIN360H1-S17 from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

'use strict'

var flock = []

var setup = () => {
  createCanvas(800, 600)

  let text = createP('Drag the mouse to generate new boids.')

  text.position(10, 600)

  60..times(() => flock.push(new Boid(width/2, height/2)))
}

var draw = () => {
  background(51)
  flock.forEach(boid => boid.flyWith(flock))
}

// Add a new boid into the System
var mouseDragged = () => {
  flock.push(new Boid(mouseX, mouseY));
}
