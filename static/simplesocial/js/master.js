  var canvas  = document.getElementById('canvas');
    ctx = canvas.getContext('2d'),
    WIDTH = 0,
    HEIGHT = 0,
    worms = [];

  var c1 = 43,
    c1S = 1,
    c2 = 205,
    c2S = 1,
    c3 = 255,
    c3S = 1,
    colorspeed1, colorspeed2, colorspeed3,
    maxColor1, maxColor2, maxColor3,
    minColor1, minColor2, minColor3,
    iteration = 0,
    maxIteration = 9999,
    baseGCO,
    resetAlpha = 0,
    symmetryType;

  function initVariables(){
    population = Math.floor(Math.random()*150)+30;
    colorspeed1 = Math.random()*2;
    colorspeed2 = Math.random()*2;
    colorspeed3 = Math.random()*2;
    maxColor1 = Math.floor(Math.random()*100)+155;
    maxColor2 = Math.floor(Math.random()*100)+155;
    maxColor3 = Math.floor(Math.random()*100)+155;
    minColor1 = Math.floor(Math.random()*100);
    minColor2 = Math.floor(Math.random()*100);
    minColor3 = Math.floor(Math.random()*100);
    symmetryType = 2//Math.floor(Math.random()*3);
  }

  initVariables();

  function Worm(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = Math.floor(Math.random()*8)+3;
      this.radiusReductionSpeed = (Math.ceil(Math.random()*5)+4) / 1000;
    this.breathingDir = 1;
    this.speed = Math.floor(Math.random()*10)/10;
    this.direction = Math.floor(Math.random()*360);
    this.stepCounter = 0;
    this.changeDirectionFrequency   = getRandomInt(1,200);
    this.turner                     = getRandomInt(0,1) == 0 ? -1 : 1;
    this.turnerAmp                  = getRandomInt(1,2);
      this.a = Math.random()/2;
    this.color = "rgba("+c1+","+c2+","+c3+", "+this.a+")";
      this.style = Math.random() > .5 ? "fill" : "stroke";
      this.isAlive = true;
      if (symmetryType == 0) this.isSymmetrical = false;
      else if (symmetryType == 1) this.isSymmetrical = Math.random() > .5 ? true: false;
      else if (symmetryType == 2) this.isSymmetrical = true;
  }

  Worm.prototype.move = function() {
    var next_x = this.x + Math.cos(degToRad(this.direction))*this.speed,
          next_y = this.y + Math.sin(degToRad(this.direction))*this.speed;

      // Limites du canvas
      if (next_x >= (WIDTH - this.r)) {
          maxIteration = iteration;
          next_x = WIDTH - this.r;
          this.direction = getRandomInt(90,270,this.direction);
      }
      else if (next_x <= this.r) {
          maxIteration = iteration;
          next_x = this.r;
          var except = [90,270];
          this.direction = getRandomInt(0,360,except);
      }
      if (next_y >= (HEIGHT - this.r)) {
          maxIteration = iteration;
          next_y = HEIGHT - this.r;
          this.direction = getRandomInt(180,360,this.direction);
      }
      else if (next_y <= this.r) {
          maxIteration = iteration;
          next_y = this.r;
          this.direction = getRandomInt(0,180,this.direction);
      }

      this.x = next_x;
      this.y = next_y;

      this.stepCounter++;

      if (this.changeDirectionFrequency && this.stepCounter == this.changeDirectionFrequency ) {
          this.turner *= -1;
          this.turnerAmp = getRandomInt(1,2);
          this.stepCounter = 0;
          this.changeDirectionFrequency = getRandomInt(1,200);
      }

      this.direction+=this.turner*this.turnerAmp;

      this.r -= this.radiusReductionSpeed;
      if (this.r <= 0) {
          this.r = 0;
          this.isAlive = false;
      }
    this.draw();
  };

  Worm.prototype.draw = function() {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      if (this.style == "fill") {
       ctx.fillStyle = this.color;
       ctx.fill();
      } else {
          ctx.strokeStyle = this.color;
          ctx.stroke();
      }
    ctx.closePath();
    this.color = "rgba("+c1+","+c2+","+c3+","+this.a+")";

      if (this.isSymmetrical) {
          var distFromCenter_X = Math.abs(WIDTH/2 - this.x);
          distFromCenter_X *= this.x >= WIDTH/2 ? -1 : 1;

          var distFromCenter_Y = Math.abs(HEIGHT/2 -this.y);
          distFromCenter_Y *= this.y >= HEIGHT/2 ? -1 : 1;

          ctx.beginPath();
          ctx.arc(WIDTH/2 + distFromCenter_X, HEIGHT/2 + distFromCenter_Y, this.r, 0, 2 * Math.PI, false);
          if (this.style == "fill") {
             ctx.fillStyle = this.color;
             ctx.fill();
          } else {
              ctx.strokeStyle = this.color;
              ctx.stroke();
          }
          ctx.closePath();
          this.color = "rgba("+c1+","+c2+","+c3+","+this.a+")";
      }
  };

  setCanvasSize();

  function setCanvasSize() {
    WIDTH = document.documentElement.clientWidth,
      HEIGHT = document.documentElement.clientHeight;

    canvas.setAttribute("width", WIDTH);
    canvas.setAttribute("height", HEIGHT);
  }

  window.onresize = setCanvasSize;

  function init(){
    defineGCO();
    for (var i = 0; i < population; i++) {
      worms[i] = new Worm(i, WIDTH/2, HEIGHT/2);
    }
    animate();
  }

  function defineGCO() {
    var gco = Math.random();
    if (gco <= 1) ctx.globalCompositeOperation = "screen";
    if (gco <= .25) ctx.globalCompositeOperation = "luminosity";
    baseGCO = ctx.globalCompositeOperation;
    console.log(ctx.globalCompositeOperation);
  }

  init();

  function animate() {
    iteration++;
    requestAnimationFrame(animate);

    var allAreDead = true;
    for (var i in worms) {
      if (worms[i].isAlive) {
        worms[i].move();
        allAreDead = false;
      }
    }
    if (allAreDead && maxIteration == 9999) maxIteration = iteration;

    // if (iteration >= maxIteration) {
    //   ctx.globalCompositeOperation = "source-over";
    //   ctx.fillStyle = "rgba(0,0,0,"+resetAlpha+")";
    //   resetAlpha+=.01;
    //   ctx.fillRect(0,0,WIDTH,HEIGHT);
    //   ctx.globalCompositeOperation = baseGCO;

    if (resetAlpha > 1.2) {
      reset();
      return;
    }

    changeColor();

  }
  //
  // function reset() {
  //   ctx.clearRect(0,0,WIDTH,HEIGHT);
  //   resetAlpha = 0;
  //   defineGCO();
  //   iteration = 0;
  //   maxIteration = 9999;
  //   for (var i = 0; i < population; i++) {
  //     delete worms[i];
  //   }
  //   worms = [];
  //   initVariables();
  //
  //   for (var i = 0; i < population; i++) {
  //     worms[i] = new Worm(i, WIDTH/2, HEIGHT/2);
  //   }
  //
  // }

  function getRandomInt(min, max, except) {
      var i = Math.floor(Math.random() * (max - min + 1)) + min;
      if (typeof except == "undefined") return i;
      else if (typeof except == 'number' && i == except) return getRandomInt(min, max, except);
      else if (typeof except == "object" && (i >= except[0] && i <= except[1])) return getRandomInt(min, max, except);
      else return i;
  }

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  function changeColor(){
    if (c1 <= 0 || c1 >= maxColor1) {
      c1S *= -1;
      if (c1 > maxColor1) c1 = maxColor1;
      if (c1 < minColor1) c1 = minColor1;
    }
    if (c2 <= minColor2 || c2 >= maxColor2) {
      c2S *= -1;
      if (c2 > maxColor2) c2 = maxColor2;
      if (c2 < minColor2) c2 = minColor2;
    }
    if (c3 <= 0 || c3 >= maxColor3) {
      c3S *= -1;
      if (c3 > maxColor3) c3 = maxColor3;
      if (c3 < minColor3) c3 = minColor3;
    }
    c1 += Math.floor(colorspeed1 * c1S);
    c2 += Math.floor(colorspeed2 * c2S);
    c3 += Math.floor(colorspeed3 * c3S);
  }

  document.addEventListener("click", function (e) {
    document.getElementById('note').style.display = "none";
    maxIteration = iteration;
  });

