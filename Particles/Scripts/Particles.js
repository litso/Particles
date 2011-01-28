
function RainingParticles()
{
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
            var image = new Image();

            //        image.src = "http://javascript-tutorials.googlecode.com/files/jsplatformer1-smiley.jpg";
            image.src = "Images/flake.png";

            ctx.save();

            ctx.drawImage(image, this.x, this.y);

            ctx.restore();
        }
    }


    //ParticleSystem creates an array of RainParticles and updates their attributes
    function ParticleSystem()
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
                    this.particles[i].setValues(Math.floor(Math.random() * this.x1) + this.x0, Math.floor(Math.random() * this.y1) + this.y0, 0, 1);
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

    function draw()
    {
        ctx.fillStyle = '#00f'; // blue
        ctx.fillRect(0, 0, 800, 600);

    //    ctx.clearRect(0, 0, 800, 600);
        ps.update();
        ps.render();
    }
}


RainingParticles.prototype.Start = function()
{
    this.RainParticle.prototype = new Particle; //inherit from Particle

    ImageParticle.prototype = new Particle; //inherit from particle

    ctx = document.getElementById("canvas").getContext("2d");

    setInterval(draw, 100);
    ps = new ParticleSystem();
    ps.init(50, 0, 0, 800, 50);
    ps.setParticlesColor("#0099ff");

}
