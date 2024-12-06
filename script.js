// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Create leaves container if it doesn't exist
    if (!document.querySelector('.leaves-container')) {
        const leavesContainer = document.createElement('div');
        leavesContainer.className = 'leaves-container';
        document.querySelector('.hero').prepend(leavesContainer);
    }

    // Initialize managers
    const leafManager = new LeafManager();
    const fireflyManager = new FireflyManager();

    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add floating animation with random delay
                const delay = Math.random() * 0.5;
                entry.target.style.animationDelay = `${delay}s`;
                
                // Optional: Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        // Add floating animation class
        item.style.animationDuration = '3s';
        item.style.animationIterationCount = 'infinite';
        item.style.animationTimingFunction = 'ease-in-out';
        
        // Start observing
        timelineObserver.observe(item);
        
        // Add hover sound effect (optional)
        item.addEventListener('mouseenter', () => {
            if (window.hoverSound) {
                window.hoverSound.currentTime = 0;
                window.hoverSound.play();
            }
        });
    });

    // Optional: Subtle hover sound
    window.hoverSound = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
    window.hoverSound.volume = 0.1;

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Handle device orientation changes
    window.addEventListener('orientationchange', () => {
        // Reset any necessary styles or states
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Recalculate viewport heights
        document.documentElement.style.setProperty(
            '--vh', 
            `${window.innerHeight * 0.01}px`
        );
    });

    // Touch event handling for better mobile interaction
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    // Prevent overscroll on iOS
    document.body.addEventListener('touchmove', (e) => {
        if (navLinks.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Optimize animations for mobile
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
        // Disable or simplify animations
        document.documentElement.style.setProperty('--animation-duration', '0s');
    }

    // Handle image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
});

// Add smooth scrolling for timeline navigation
document.querySelectorAll('.timeline-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
});

// Leaf class
class Leaf {
    constructor() {
        this.node = document.createElement("div");
        this.node.className = "leaf";
        
        // Only autumn leaves and fall colors
        const leafTypes = ["🍁", "🍂"]; // Only maple and autumn leaves
        const colors = [
            "#8B0000", // Dark red
            "#8B4513", // Saddle brown
            "#CD853F", // Peru brown
            "#D2691E", // Chocolate
            "#FF8C00"  // Dark orange
        ];
        const randomIndex = Math.floor(Math.random() * leafTypes.length);
        
        this.node.innerHTML = leafTypes[randomIndex];
        this.node.style.color = colors[Math.floor(Math.random() * colors.length)];
        this.node.style.fontSize = Math.random() * 10 + 20 + 'px';
        
        // Get the position of the school name text
        const schoolName = document.querySelector('.hero-content h1');
        const schoolNameRect = schoolName.getBoundingClientRect();
        
        // Start leaves from random positions along the school name
        this.x = schoolNameRect.left + Math.random() * schoolNameRect.width;
        this.y = schoolNameRect.bottom;
        
        // Slower falling speed
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.15 + 0.05;
        
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.5;
        this.oscillationSpeed = (Math.random() * 0.01 + 0.003);
        this.oscillationDistance = Math.random() * 150 + 50;
        this.swingFactor = Math.random() * Math.PI * 2;
        this.scale = Math.random() * 0.4 + 0.6;

        this.updatePosition();
        document.querySelector('.leaves-container').appendChild(this.node);
    }

    updatePosition() {
        this.swingFactor += this.oscillationSpeed;
        const oscillation = Math.sin(this.swingFactor) * this.oscillationDistance;
        
        // Add more pronounced wind effect
        const windEffect = Math.sin(Date.now() * 0.0005) * 0.5; // Slower, stronger breeze
        this.x += this.speedX + oscillation * 0.03 + windEffect;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        this.node.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    }

    isOutOfScreen() {
        return this.y > window.innerHeight + 50;
    }
}

// Leaf Manager
class LeafManager {
    constructor() {
        this.leaves = [];
        this.lastUpdate = Date.now();
        this.spawnInterval = 500; // Spawn more frequently (0.5 seconds)
        this.lastSpawn = Date.now();
        this.maxLeaves = 20; // Allow more leaves
        
        this.update = this.update.bind(this);
        
        // Spawn first batch of leaves immediately
        for(let i = 0; i < 5; i++) { // Start with 5 leaves
            setTimeout(() => {
                this.spawnLeaf();
            }, i * 200); // Stagger initial spawns
        }
        
        requestAnimationFrame(this.update);
    }

    spawnLeaf() {
        if (this.leaves.length < this.maxLeaves) {
            this.leaves.push(new Leaf());
        }
    }

    update() {
        const now = Date.now();
        this.lastUpdate = now;

        if (now - this.lastSpawn > this.spawnInterval) {
            this.spawnLeaf();
            this.lastSpawn = now;
        }

        this.leaves = this.leaves.filter(leaf => {
            leaf.updatePosition();
            if (leaf.isOutOfScreen()) {
                leaf.node.remove();
                return false;
            }
            return true;
        });

        requestAnimationFrame(this.update);
    }
}

// Firefly class
class Firefly {
    constructor(container) {
        this.node = document.createElement("div");
        this.node.className = "firefly";
        
        const rect = container.getBoundingClientRect();
        this.x = Math.random() * rect.width;
        this.y = Math.random() * rect.height;
        
        // Slower, more natural movement
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.2; // Reduced speed
        this.wanderStrength = 0.03; // Reduced turn rate
        this.glowIntensity = Math.random();
        this.glowSpeed = 0.01 + Math.random() * 0.02; // Slower glow change
        
        this.node.style.left = this.x + 'px';
        this.node.style.top = this.y + 'px';
        
        container.appendChild(this.node);
    }

    update() {
        // Smoother direction changes
        this.angle += (Math.random() - 0.5) * this.wanderStrength;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Soft bounce off edges
        const rect = this.node.parentElement.getBoundingClientRect();
        const padding = 20; // Keep fireflies away from edges
        
        if (this.x < padding) {
            this.x = padding;
            this.angle = Math.PI - this.angle + (Math.random() - 0.5) * 0.5;
        } else if (this.x > rect.width - padding) {
            this.x = rect.width - padding;
            this.angle = Math.PI - this.angle + (Math.random() - 0.5) * 0.5;
        }
        
        if (this.y < padding) {
            this.y = padding;
            this.angle = -this.angle + (Math.random() - 0.5) * 0.5;
        } else if (this.y > rect.height - padding) {
            this.y = rect.height - padding;
            this.angle = -this.angle + (Math.random() - 0.5) * 0.5;
        }

        // Update glow intensity
        this.glowIntensity += this.glowSpeed;
        if (this.glowIntensity > 1 || this.glowIntensity < 0) {
            this.glowSpeed = -this.glowSpeed;
        }

        // Apply position and glow
        this.node.style.left = this.x + 'px';
        this.node.style.top = this.y + 'px';
        this.node.style.opacity = 0.4 + this.glowIntensity * 0.6; // Never fully disappear
    }
}

// Firefly Manager
class FireflyManager {
    constructor() {
        this.fireflies = [];
        this.container = document.querySelector('.motto-block');
        
        if (this.container) {
            for (let i = 0; i < 15; i++) {
                this.fireflies.push(new Firefly(this.container));
            }
            
            this.update = this.update.bind(this);
            requestAnimationFrame(this.update);
        }
    }

    update() {
        this.fireflies.forEach(firefly => firefly.update());
        requestAnimationFrame(this.update);
    }
}

// Lightbox functionality
let currentImageIndex = 1;
const totalImages = 6;

function openLightbox(imageNumber) {
    currentImageIndex = imageNumber;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightbox.style.display = 'block';
    lightboxImg.style.opacity = '0';
    
    const newImg = new Image();
    newImg.onload = function() {
        lightboxImg.src = this.src;
        lightboxImg.style.opacity = '1';
    };
    
    const imgPath = `assets/gallery${imageNumber}`;
    const extension = (imageNumber === 1 || imageNumber === 3) ? '.jpeg' : '.jpg';
    newImg.src = imgPath + extension;
    
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex > totalImages) currentImageIndex = 1;
    if (currentImageIndex < 1) currentImageIndex = totalImages;
    
    const imgPath = `assets/gallery${currentImageIndex}`;
    const extension = (currentImageIndex === 1 || currentImageIndex === 3) ? '.jpeg' : '.jpg';
    document.getElementById('lightbox-img').src = imgPath + extension;
}
