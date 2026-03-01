document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.reveal');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // Navbar Background Change on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 12, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 12, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Canvas Thread/Fiber Animation
    initCanvasAnimation();
});

function initCanvasAnimation() {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Thread particles
    const threads = [];
    const threadCount = Math.min(window.innerWidth / 15, 80); // Responsive count

    class Thread {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 1.5 + 0.5;
            this.color = Math.random() > 0.8 
                ? 'rgba(212, 175, 55, 0.4)'  // Gold
                : 'rgba(255, 255, 255, 0.15)'; // White
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < threadCount; i++) {
        threads.push(new Thread());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw and update threads
        for (let i = 0; i < threads.length; i++) {
            threads[i].update();
            threads[i].draw();

            // Connect threads if close (weaving effect)
            for (let j = i + 1; j < threads.length; j++) {
                const dx = threads[i].x - threads[j].x;
                const dy = threads[i].y - threads[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(threads[i].x, threads[i].y);
                    ctx.lineTo(threads[j].x, threads[j].y);
                    
                    // Opacity based on distance
                    const opacity = 1 - (dist / 150);
                    
                    // Some gold connections, some white
                    if (threads[i].color.includes('212') || threads[j].color.includes('212')) {
                        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.3})`;
                    } else {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
                    }
                    
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}
