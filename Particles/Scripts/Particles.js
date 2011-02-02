var isRaining = false;
var rainTimeout;
var Ctx;
var ps;

var Canvas;

var canvasWidth;
var canvasHeight;

var cityImage = new Image();
cityImage.src = "Images/city.jpg";
cityImage.width = 800;
cityImage.height = 600;

function rainOffTime()
{
    var rainOffPeriod = 10000;

    return rainOffPeriod + (rainOffPeriod * Math.random());
}

function rainOnTime()
{
    var rainOnPeriod = 15000;

    return rainOnPeriod + (rainOnPeriod * Math.random());
}

function toggleRain()
{
    if (rainTimeout)
    {
        clearTimeout(rainTimeout);
        rainTimeout = undefined;
    }

    if (!isRaining)
    {
        // Its not raining... make it rain
        isRaining = true;
        rainTimeout = setInterval("toggleRain()", rainOnTime());
    }
    else
    {
        isRaining = false;
        rainTimeout = setInterval("toggleRain()", rainOffTime());
    }
}

//The Particle base class
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

    this.setValues = function (x, y, vx, vy)
    {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.time = 0;
        this.life = Math.floor(Math.random() * 50);
    }

    // renders the particle using the canvas element
    this.render = function ()
    {
        Ctx.save();
        Ctx.translate(this.x, this.y);
        Ctx.beginPath();
        Ctx.arc(0, 0, 10, 0, Math.PI * 2, true); // draw a circle
        Ctx.fill();
        Ctx.restore();
    }

}

// Used to make "steaks" of rain
function LineParticle()
{
    var maxLineHeight = 140;
    this.lineHeight = Math.max(maxLineHeight * Math.random(), 60);
    this.lineWidth = 1;

    this.setValues = function (x, y, vx, vy)
    {
        this.x = x;
        this.y = y;

        this.vx = vx; this.vy = vy;
        this.time = 0;
        this.life = Math.floor(Math.random() * 50);
    }

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

        var newX = this.x;
        var newY = this.y;
        var newHeight = this.lineHeight;

        if (newY < 0)
        {
            if (newHeight + newY < 0)
            {
                return;
            }

            newHeight += newY;
            newY = 0;
        }

        if (newHeight == 0)
        {
            return;
        }

        var myImageData = Ctx.getImageData(newX, newY, this.lineWidth, newHeight);

        Ctx.save();

        Ctx.globalCompositeOperation = "darker";

        Ctx.lineWidth = this.lineWidth;

        var numIncrements = 20;
        var increment = newHeight / numIncrements;

        // Pick numIncrements color samples

        var colors = new Array();

        var numColorPixels = myImageData.data.length / 4;
        var colorIncrement = Math.floor(numColorPixels / numIncrements);

        if (colorIncrement == 0)
        {
            return;
        }

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

            Ctx.strokeStyle = 'rgba(' + redComponent + "," + greenComponent + "," + blueComponent + "," + 1.0 + ")";

            Ctx.beginPath();
            Ctx.moveTo(newX, ((i - 1) * increment) + newY);
            Ctx.lineTo(newX, i * increment + newY);
            Ctx.stroke();
        }

        Ctx.restore();

        Ctx.globalCompositeOperation = "source-over";
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
            this.particles.push(new LineParticle());
//            this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, Math.floor(Math.random() * this.y1) + this.y0, 0, 1);

            /* set initial x position from between x0 and x1 */
            /* set initial y position from between -200 and 0 */
            this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, Math.floor(Math.random() * this.y1) + this.y0, 0, 1);
        }
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
                if (isRaining)
                {
                    /* set initial x position from between x0 and x1 */
                    /* set initial y position from between -200 and 0 */
                    this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, Math.floor(Math.random() * this.y1) + this.y0, 0, 1);
                }
                else
                {
                    /* Knock it off the screen */
                    this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, -10000, 0, 1);
                }
            }
        }
    }

    this.render = function ()
    {
        for (var i = 0; i < this.particles.length; i++) this.particles[i].render();
    }

};

// The main drawing routine, here we just draw an image.
// After we place the rain on top of the image
function MainDraw()
{
    Ctx.drawImage(cityImage, 0, 0);

    if ((canvasHeight != Canvas.height) || (canvasWidth != Canvas.width))
    {
        if (isRaining)
        {
            // Init rain
            InitRain();
        }
    }

    DrawRain();
}

function DrawRain()
{
    if (ps)
    {
        ps.update();
        ps.render();
    }
}

// The main initialize routine
function SetUp()
{
    Canvas = document.getElementById("canvas");
    Ctx = Canvas.getContext("2d");

    // frame refresh
    setInterval(MainDraw, 24);

    // Set up the rain timer
    rainTimeout = setTimeout("toggleRain()", rainOffTime());
}

function InitRain()
{
    LineParticle.prototype = new Particle; // inherit from Particle

    canvasWidth = Canvas.width;
    canvasHeight = Canvas.height;

    ps = new RainParticleSystem();
    ps.init(50, 0, -100, canvasWidth, 50);
}
