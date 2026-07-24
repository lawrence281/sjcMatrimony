import React, { useEffect, useRef } from 'react';

const FireworksCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
      constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.95;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += 0.05; // Gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
      }
    }

    class Firework {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        for (let i = 0; i < 40; i++) {
          const angle = (Math.PI * 2) / 40 * i;
          const speed = Math.random() * 3 + 2;
          this.particles.push(new Particle(this.x, this.y, this.color, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
          }));
        }
      }

      draw() {
        this.particles.forEach(particle => particle.draw());
      }

      update() {
        this.particles.forEach((particle, i) => {
          if (particle.alpha > 0) {
            particle.update();
          } else {
            this.particles.splice(i, 1);
          }
        });
      }
    }

    class Rocket {
      constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.speed = Math.random() * 5 + 7;
        this.angle = Math.PI * 1.5 + (Math.random() - 0.5) * 0.2;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.velocity = {
          x: Math.cos(this.angle) * this.speed,
          y: Math.sin(this.angle) * this.speed
        };
        this.trail = [];
        this.exploded = false;
        this.targetY = Math.random() * (height * 0.4) + height * 0.1;
      }

      draw() {
        if (!this.exploded) {
           ctx.beginPath();
           ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
           ctx.fillStyle = 'white';
           ctx.fill();
        }
      }

      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.02; // Gravity slight

        if (this.y <= this.targetY && !this.exploded) {
          this.exploded = true;
          fireworks.push(new Firework(this.x, this.y, this.color));
        }
      }
    }

    let rockets = [];
    let fireworks = [];

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Solid black to prevent multi-color bg trails, but hero has its own bg
      // Actually we want transparent bg for the canvas so it sits over the hero gradient
      ctx.clearRect(0, 0, width, height);
      
      if (Math.random() < 0.03) {
        rockets.push(new Rocket());
      }

      rockets.forEach((rocket, i) => {
        rocket.update();
        rocket.draw();
        if (rocket.exploded) rockets.splice(i, 1);
      });

      fireworks.forEach((firework, i) => {
        firework.update();
        firework.draw();
        if (firework.particles.length === 0) fireworks.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6
      }}
    />
  );
};

export default FireworksCanvas;
