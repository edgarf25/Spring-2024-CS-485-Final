const flock = [];
const sprites_to_draw = [];
let alignSlider, cohesionSlider, separationSlider;


function preload() {
  bg1 = loadImage('imgs/1.jpg')
  bg2 = loadImage('imgs/2.jpg')
  bg3 = loadImage('imgs/3.jpg')
  bg4 = loadImage('imgs/4.jpg')
  bg5 = loadImage('imgs/5.jpg')
  bg6 = loadImage('imgs/6.jpg')
}


function setup() {
  createCanvas(innerWidth, innerHeight);

  $.getJSON("Penguins/animationData.json", function (data) {
    for (let i = 0; i < 10; i++) {
      flock.push(new Sprite(data, "idleSpin"));
    }
    let sprite = flock[9]
    sprite.state = "idle"
    sprite.position.x = 1400
    sprite.position.y = 600
    sprite.velocity.x = 0
    sprite.velocity.y = 0
    window.addEventListener("keydown", e => {
      sprite.cur_frame = 0;
      if (e.key === "ArrowRight" && flag === true) {
        console.log(e.key)
        sprite.velocity.x = 10
        sprite.state = "walk_E"
      } else if (e.key === "ArrowLeft" && flag === true) {
        console.log(e.key)
        sprite.velocity.x = -10
        sprite.state = "walk_W"
      } else if (e.key === "ArrowUp" && flag === true) {
        console.log(e.key)
        sprite.velocity.y = -10
        sprite.state = "walk_N"
      } else if (e.key === "ArrowDown" && flag === true) {
        console.log(e.key)
        sprite.velocity.y = 10
        sprite.state = "walk_S"
      }
      // if (sprite.clear === true) {
      //     const context = canvas.getContext('2d');
      //     context.drawImage(img, 0, 0, canvas.width, canvas.height)
      //     console.log("clear");
      // }

      console.log(e.key);
      flag = false
      sprite.clear = false
      //console.log(sprite.cur_frame);
    })
    window.addEventListener("keyup", e => {
      sprite.velocity.x = 0
      sprite.velocity.y = 0
      sprite.cur_frame = 0;
      const idle_state = ["idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown", "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight", "idleLookUp", "idleSit", "idleSpin", "idleWave"];
      const random = Math.floor(Math.random() * idle_state.length);
      sprite.state = idle_state[random]
      flag = true
    })
  });
}

let count = -1
setInterval(() => {
  count += 1
  if (count === 5)
    count = 0;
}, 200)



function draw() {

  console.log(count);
  if (count === 0)
    background(bg1)
  else if (count === 1)
    background(bg2)
  else if (count === 2)
    background(bg3)
  else if (count === 3)
    background(bg4)
  else if (count === 4)
    background(bg5)
  else if (count === 5)
    background(bg6)


  // if (count === 5)
  //   count = -1;


  for (let boid of flock) {
    boid.draw();
    boid.flock(flock);
    boid.update();
    boid.show();
    //boid.edges();
    //console.log("11");
  }

}