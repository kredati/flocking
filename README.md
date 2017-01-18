## A flock of boids.
This is adapted, not very far, from Dan Shiffman's [flocking example](https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/tree/master/chp06_agents/NOC_6_09_Flocking) from *The Nature of Code*. (Boids is his term.) The adaptation uses more modern Javascript techniques and tools, and shifts around the abstraction in what I take to be more logical ways.

## Emergent & complex behavior.
The flocking behaviors displayed here arise not from a centralized command-and-control algorithm. Instead, each boid knows how to fly with the flock. Flocking is made up, itself, of three decisions: cohering, separating, and aligning. Each is a fairly straightforward algorithm, and it's all there in boid.js.

### A technical note.
My techniques for making the code more readable (and the substance of my adaptation from Shiffman's original example) use trendy Javascript (look ma, no loops!). This may either break the demonstration in older browsers or on slower computers.
