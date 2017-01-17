'use strict'

// Monkey patch times on Number
Object.assign(Number.prototype, {
  times (f) {
    let that = this
    while (that--) f()
  }
})

// Shorten invocations of p5.Vector to Vector
var Vector = p5.Vector

// Monkey patch increment on Vector
Object.assign(Reflect.getPrototypeOf(new Vector()), {
  increment (amount) {
    this.x += amount
    this.y += amount
  }
})

// Define vector as a helper method to get new copies of p5.Vectors
// Note that this is weak: it works only for 2D Vectors
// (p5.Vector's handling of different argument types breaks argument forwarding)
var vector = (x, y) => new p5.Vector(x, y)
