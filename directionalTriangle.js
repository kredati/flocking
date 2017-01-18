'use strict'

// Draws a triangle of specified size, pointing in the specified heading
class DirectionalTriangle {

  constructor (radius) {
    this.radius = radius,
    this.fillColor = color(255, 255, 255, 100)
  }

  render (position, heading) {
    fill(this.fillColor)
    noStroke()

    push()
      translate(position.x, position.y)
      rotate(heading)
      this.drawTriangle()
    pop()
  }

  drawTriangle () {
    beginShape()
      vertex(this.radius * 2, 0)
      vertex(-this.radius * 2, this.radius)
      vertex(-this.radius * 2, -this.radius)
    endShape(CLOSE)
  }

}
