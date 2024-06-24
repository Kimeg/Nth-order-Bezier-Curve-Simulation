// parameters associated with rendering process
let WIDTH = 800;
let HEIGHT = 600;

let colors;

let fc = 0;

let DELAY = 1;

let VELOCITY;

let _time = 0;
let time_min = 0;
let time_max = 1;

// number of control points
let N = 10;

// objects to manage data processing
let _bezier = {};
let points = [];
let bezier_path = [];


function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  VELOCITY = createVector(random(1, 3), random(1, 3));
  initialize_colors();
  //demo();
  randomize_points();
}

function initialize_colors() {
    colors = [
      color(255, 0, 0),
      color(0, 255, 0),
      color(0, 0, 255),
      color(255, 0, 255),
      color(255, 255, 0),
      color(0, 255, 255),
  ];
}

function demo() {
  let p1 = createVector(WIDTH/4, HEIGHT/4);
  let p2 = createVector(WIDTH*2/5, HEIGHT*3/4);
  let p3 = createVector(WIDTH*3/5, HEIGHT*3/4);
  let p4 = createVector(WIDTH*3/4, HEIGHT/4);
  let p5 = createVector(WIDTH/2, HEIGHT/4);
  let p6 = createVector(WIDTH/2, HEIGHT*3/4);
  
  points = [p1, p2, p3, p4, p5, p6];   
}

function randomize_points() {
  for (let i=0; i<N; i++) {
    //points.push(createVector(random(WIDTH), random(HEIGHT)));
    points.push(new BezierPoint(random(WIDTH), random(HEIGHT), VELOCITY));
  }
}

function linear_interpolation(p1, p2, t) {
  let x = p1.x + (p2.x - p1.x)*t;
  let y = p1.y + (p2.y - p1.y)*t;
  return createVector(x, y);
}

function rec_bezier(pts, t, depth) {
  if (pts.length==1){
    return;
  }
  
  for (let i=0; i<pts.length-1; i++) {
    let p = linear_interpolation(pts[i], pts[i+1], t);
    if (_bezier.hasOwnProperty(depth)) {
      _bezier[depth].push(p);
    } else {
      _bezier[depth] = [p];  
    }
  }
  rec_bezier(_bezier[depth], t, depth+1);
}

function reverseArray(arr) {
  let temp = [];
  for (let i=arr.length-1; i>=0; i--) {
    temp.push(arr[i]);
  }
  return temp;
}

function update_points() {
  for (var p of points) {
    p.update();
  }
}

function draw_points() {
  for (var p of points) {
    p.draw();
  }
}

function draw_bezier_components(t) {
  count = 0;
  let cv = map(t, time_min, time_max, 0, 255);
  for (var key in _bezier){
    if (key==N-1) {
      bezier_path.push(createVector(_bezier[key][0].x, _bezier[key][0].y));  
    }
    
    n = _bezier[key].length;
    
    for (var p of _bezier[key]) {
      //stroke(colors[count%colors.length]);
      push();
      stroke(color(random(cv, 255), 255-cv, cv));
      strokeWeight(4);
      point(p.x, p.y);
      pop();
    }
    count++;
    if (n==1) {
      continue;
    }
    
    for (let i=0; i<n-1; i++) {
      let p1 = _bezier[key][i];
      let p2 = _bezier[key][i+1];
      let x1 = p1.x;
      let y1 = p1.y;
      let x2 = p2.x;
      let y2 = p2.y;
      
      push();
      stroke(100);
      strokeWeight(1);
      line(x1, y1, x2, y2);
      pop();
    }
  }
  
  for (var p of bezier_path) {
    push();
    stroke(255, 0, 0);
    strokeWeight(4);
    point(p.x, p.y);
    pop();
  }
}

function draw() {
  // Increment frame count
  fc++;
  
  // Skip rendering process while frame count is less than given delay value
  if (fc < DELAY){
    return;
  }
  
  // Reset frame count
  fc = 0;
  
  background(0);
  
  // Sort points in reverse order if _time reaches given max time value.
  // time_max is the exact moment when the initial control point arrives at the last one.
  // This reverse sorting process has an effect of all control points "bouncing" back and forth within their computational range.
  if (_time>=time_max){
    _time = time_min;
    points = reverseArray(points);
    bezier_path = [];
  }
  
  // dictionary to store control point objects
  _bezier = {0: points}
  
  // Recursive method to update control points' positions using Bezier curve algorithm on Nth degree, where N is a given number of control points.
  // 
  rec_bezier(points, _time, 1);
  
  // Render control points and their associated geometrical components;
  draw_points();
  draw_bezier_components(_time);
  
  // Increment _time during rendering process
  _time += 0.01;
}