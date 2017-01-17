// Adapted by Scott Richmond for CIN360H1-S17 from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

'use strict'

var flock,
  text

function setup() {
  text = createP("Drag the mouse to generate new boids.")
  text.position(10,600)

  createCanvas(800,600)

  // Create a flock with 60 Boids!
  flock = new Flock()
  60..times(() => flock.addBoid(new Boid(width/2, height/2)))
}

function draw() {
  background(51);
  flock.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX,mouseY));
}
