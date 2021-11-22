class BezierPoint {
  constructor(x, y, vel) {
    this.x = x;
    this.y = y;
    this.vel = vel
    this.dir = createVector(random([1, -1]), random([1, -1]));
  }
  
  update() {
    // update point's coordinates proportional to given velocity,
    this.x += this.vel.x * this.dir.x;
    this.y += this.vel.y * this.dir.y;
    
    // Revert the direction of point if it reaches further out from the given screen dimensions.
    if ((this.x < 0 ) || (this.x >= WIDTH)) {
      this.dir.x *= -1;
    }
    if ((this.y < 0 ) || (this.y >= HEIGHT)) {
      this.dir.y *= -1;
    }
  }
  
  draw() {
    push();
    stroke(255);
    strokeWeight(3);
    point(this.x, this.y);
    pop();
  }
}