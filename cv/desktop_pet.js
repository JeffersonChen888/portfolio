class DesktopPet {
    constructor() {
        this.pet = document.querySelector('.desktop-pet');
        this.petImg = document.querySelector('.pet-img');
        this.x = window.innerWidth - 150;
        this.y = 50;
        this.state = 'idle';
        this.gifs = {
            idle: '../image/idle.gif',
            sleep: '../image/sleep.gif',
            walkLeft: '../image/walking_positive.gif',
            walkRight: '../image/walking_negative.gif',
            toSleep: '../image/idle_to_sleep.gif',
            fromSleep: '../image/sleep_to_idle.gif'
        };
        this.init();
        this.createParticles();
        this.handleDarkMode();
    }

    handleDarkMode() {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            this.pet.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';  // Semi-transparent dark background
        } else {
            this.pet.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';  // Semi-transparent light background
        }
        
        // Listen for dark mode changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                this.pet.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            } else {
                this.pet.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    init() {
        this.pet.style.left = `${this.x}px`;
        this.pet.style.bottom = `${this.y}px`;
        this.setupEventListeners();
        this.startBehaviorLoop();
    }

    setupEventListeners() {
        this.pet.addEventListener('click', () => this.toggleSleep());
        document.addEventListener('mousemove', (e) => this.watchMouse(e));
    }

    setState(newState) {
        this.state = newState;
        switch (newState) {
            case 'idle':
                this.petImg.src = this.gifs.idle;
                break;
            case 'sleep':
                this.petImg.src = this.gifs.sleep;
                break;
            case 'walkLeft':
                this.petImg.src = this.gifs.walkLeft;
                break;
            case 'walkRight':
                this.petImg.src = this.gifs.walkRight;
                break;
            case 'toSleep':
                this.petImg.src = this.gifs.toSleep;
                setTimeout(() => this.setState('sleep'), 800); // Adjust timing based on your GIF
                break;
            case 'fromSleep':
                this.petImg.src = this.gifs.fromSleep;
                setTimeout(() => this.setState('idle'), 800); // Adjust timing based on your GIF
                break;
        }
    }

    toggleSleep() {
        if (this.state !== 'sleep' && this.state !== 'toSleep') {
            this.setState('toSleep');
        } else if (this.state === 'sleep') {
            this.setState('fromSleep');
        }
    }

    walk(direction) {
        if (this.state === 'sleep' || this.state === 'toSleep' || this.state === 'fromSleep') return;

        if (direction === 'left') {
            this.setState('walkLeft');
            this.x = Math.max(0, this.x - 3);
        } else {
            this.setState('walkRight');
            this.x = Math.min(window.innerWidth - 150, this.x + 3);
        }
        this.pet.style.left = `${this.x}px`;
    }

    watchMouse(e) {
        if (this.state === 'sleep' || this.state === 'toSleep' || this.state === 'fromSleep') return;

        const petRect = this.pet.getBoundingClientRect();
        const petCenter = petRect.left + petRect.width / 2;
        if (Math.abs(e.clientX - petCenter) > 200) {
            this.walk(e.clientX < petCenter ? 'left' : 'right');
        } else {
            if (this.state !== 'idle') this.setState('idle');
        }
    }

    startBehaviorLoop() {
        setInterval(() => {
            if (this.state === 'idle' && Math.random() < 0.1) {
                const direction = Math.random() < 0.5 ? 'left' : 'right';
                this.walk(direction);
                setTimeout(() => {
                    if (this.state !== 'sleep') this.setState('idle');
                }, 2000);
            }
        }, 3000);
    }
}

// Initialize the pet when the page loads
window.addEventListener('load', () => {
    const pet = new DesktopPet();
});
