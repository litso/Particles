
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


function RGBtoHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B) }
function toHex(N)
{
    if (N == null) return "00";
    N = parseInt(N); if (N == 0 || isNaN(N)) return "00";
    N = Math.max(0, N); N = Math.min(N, 255); N = Math.round(N);
    return "0123456789ABCDEF".charAt((N - N % 16) / 16)
      + "0123456789ABCDEF".charAt(N % 16);
}

function LineParticle()
{
    var maxLineHeight = 140;
    this.lineHeight = Math.max(maxLineHeight * Math.random(), 60);
    this.lineWidth = 1;

    this.render = function ()
    {
        if (this.x + this.lineWidth > canvasWidth)
        {
            return;
        }

        if (this.y + this.lineHeight > canvasHeight)
        {
            return;
        }

        var myImageData = ctx.getImageData(this.x, this.y, this.lineWidth, this.lineHeight);

        ctx.save();

        ctx.globalCompositeOperation = "darker";

        ctx.lineWidth = this.lineWidth;

        var numIncrements = 20;
        var increment = this.lineHeight / numIncrements;

        // Pick numIncrements color samples

        var colors = new Array();

        var numColorPixels = myImageData.data.length / 4;
        var colorIncrement = Math.floor(numColorPixels / numIncrements);

        for (var i = 0; i < numColorPixels; i += colorIncrement)
        {
            var element = new Array();
            element[0] = myImageData.data[i * 4];
            element[1] = myImageData.data[i * 4 + 1];
            element[2] = myImageData.data[i * 4 + 2];

            element[0] += 20;
            element[1] += 20;
            element[2] += 20;

            colors.push(element);
        }


        // Draw the line segments

        for (i = 1; i <= numIncrements; i++)
        {
            var redComponent = colors[i - 1][0];
            var greenComponent = colors[i - 1][1];
            var blueComponent = colors[i - 1][2];

            ctx.strokeStyle = 'rgba(' + redComponent + "," + greenComponent + "," + blueComponent + "," + 1.0 + ")";

            ctx.beginPath();
            ctx.moveTo(this.x, ((i - 1) * increment) + this.y);
            ctx.lineTo(this.x, i * increment + this.y);
            ctx.stroke();
        }

        ctx.restore();

        ctx.globalCompositeOperation = "source-over";
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
            this.particles.push(new LineParticle());
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

var particleImage = new Image();
particleImage.src = "Images/flake.png";

var canvasCopy;

var cityImage = new Image();
cityImage.src = "Images/city.jpg";
cityImage.width = 800;
cityImage.height = 600;


function draw()
{
//    ctx.fillStyle = '#00f'; // blue
//    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(cityImage, 0, 0);

    if ((canvasCopy.height == 0) || (canvasCopy.width == 0))
    {
        alert("Help");
    }

//    ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasWidth, canvasHeight);
//    ctx.clearRect(0, 0, 800, 600);

    ps.update();
    ps.render();
}


function Start()
{
//    var cityImage = document.getElementById("cityImage");

    canvasCopy = document.createElement("canvas");
    canvasCopy.width = cityImage.width;
    canvasCopy.height = cityImage.height;

//    $(cityImage).hide();

    RainParticle.prototype = new Particle; //inherit from Particle
    ImageParticle.prototype = new Particle; //inherit from particle
    LineParticle.prototype = new Particle; // inherit from Particle

    var canvas = document.getElementById("canvas");

    if (false)
    {
        // Disable canvas resize
        canvasWidth = $(window).width();
        canvasHeight = $(window).height();

        $(canvas).attr("height", canvasHeight);
        $(canvas).attr("width", canvasWidth);
    }
    else
    {
        canvasWidth = $(canvas).width();
        canvasHeight = $(canvas).height();
    }

    ctx = canvas.getContext("2d");

    if ((cityImage.width == 0) || (cityImage.height == 0))
    {
        alert("Here");
    }

    var copyContext = canvasCopy.getContext("2d");

    copyContext.drawImage(cityImage, 0, 0);

    ps = new RainParticleSystem();
    ps.init(50, 0, 0, canvasWidth, 50);
    ps.setParticlesColor("#0099ff");

//    ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasWidth, canvasHeight);

    // frame refresh
    setInterval(draw, 48);
}
