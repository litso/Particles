
//The Particle class
function Particle()
{

    //particle position
    this.x = 0;
    this.y = 0;

    //particle velocity
    this.vx = 0;
    this.vy = 0;

    this.time = 0; //the time elapsed since the particle was created
    this.life = 0; //the amount of time the particle is going to live
    this.color = "#000000";

    this.setValues = function (x, y, vx, vy)
    {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.time = 0;
        this.life = Math.floor(Math.random() * 50);
    }

    this.setColor = function (color)
    {
        this.color = color;
    }

    // renders the particle using the canvas element
    this.render = function ()
    {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true); // draw a circle
        ctx.fill();
        ctx.restore();
    }

}

// RainParticle inherits from Particle and overloads the render function to draw a drop instead of a circle
function RainParticle()
{

    this.render = function ()
    {
        var m = 0.9; // particle size
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0 * m, 5 * m, 0 * m, 10 * m, 5 * m, 15 * m);
        ctx.bezierCurveTo(10 * m, 20 * m, 12 * m, 26 * m, 10 * m, 30 * m);
        ctx.bezierCurveTo(6 * m, 40 * m, -6 * m, 40 * m, -10 * m, 30 * m);
        ctx.bezierCurveTo(-12 * m, 26 * m, -10 * m, 20 * m, -5 * m, 15 * m);
        ctx.bezierCurveTo(0 * m, 10 * m, 0 * m, 5 * m, 0 * m, 0 * m);
        ctx.fill();
        ctx.restore();
    }

}

function ImageParticle()
{
    this.render = function ()
    {
        ctx.save();

        ctx.drawImage(particleImage, this.x, this.y);

        ctx.restore();
    }
}

function LineParticle()
{
    this.render = function ()
    {
        ctx.save();


        var lineWidth = 1;
        var lineHeight = 140;

        var gradient1 = ctx.createLinearGradient(this.x, this.y, this.x, this.y + lineHeight);

        gradient1.addColorStop(0, 'transparent');
        gradient1.addColorStop(0.5, '#000');
        gradient1.addColorStop(1, 'transparent');


        ctx.strokeStyle = gradient1;

        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, lineHeight + this.y);
        ctx.stroke();


        ctx.restore();
    }
}


//RainParticleSystem creates an array of RainParticles and updates their attributes
function RainParticleSystem()
{

    //origin rectangle of the this.particles
    this.x0;
    this.y0;
    this.x1;
    this.y1;

    this.n = 0;
    this.particles = [];
    this.gravity = 0.01;

    this.init = function (n, x0, y0, x1, y1)
    {
        this.n = n;
        this.x0 = x0; this.y0 = y0;
        this.x1 = x1; this.y1 = y1;
        this.gravity = 1;
        for (var i = 0; i < n; i++)
        {
            //            this.particles.push(new RainParticle());

            // RMM
            this.particles.push(new ImageParticle());
            this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, Math.floor(Math.random() * this.y1) + this.y0, 0, 1)
        }
    }

    this.setParticlesColor = function (color)
    {
        for (var i = 0; i < this.particles.length; i++) this.particles[i].setColor(color);
    }

    //update the attributes of every particle
    this.update = function ()
    {
        for (var i = 0; i < this.particles.length; i++)
        {
            if (this.particles[i].time < this.particles[i].life)
            {
                this.particles[i].vy = this.particles[i].vy + this.gravity;
                this.particles[i].x = this.particles[i].x + this.particles[i].vx;
                this.particles[i].y = this.particles[i].y + this.particles[i].vy;
                this.particles[i].time += 1;
            }
            else
            {
                //                this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, Math.floor(Math.random() * this.y1) + this.y0, 0, 1);

                // RMM Changed so particles start flush at the top of the screen
                this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, 0, 0, 1);

            }
        }
    }

    this.render = function ()
    {
        for (var i = 0; i < this.particles.length; i++) this.particles[i].render();
    }

};

var ctx;
var ps;


var canvasWidth;
var canvasHeight;

var cityImage = new Image();
cityImage.src = "Images/city.png";

var particleImage = new Image();
particleImage.src = "Images/flake.png";

function draw()
{
//    ctx.fillStyle = '#00f'; // blue
//    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(cityImage, 0, 0);

//    ctx.clearRect(0, 0, 800, 600);
    ps.update();
    ps.render();
}


function Start()
{
    this.RainParticle.prototype = new Particle; //inherit from Particle

    ImageParticle.prototype = new Particle; //inherit from particle

    var canvas = document.getElementById("canvas");


    canvasWidth = $(window).width();
    canvasHeight = $(window).height();

    $(canvas).attr("height", canvasHeight);
    $(canvas).attr("width", canvasWidth);

//        ctx.globalCompositeOperation = "lighter";


    ctx = canvas.getContext("2d");

    setInterval(draw, 100);
    ps = new RainParticleSystem();
    ps.init(50, 0, 0, canvasWidth, 50);
    ps.setParticlesColor("#0099ff");

}
