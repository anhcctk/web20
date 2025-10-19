// ===================
// MAIN VARIABLES
// ===================

let currentPhotoIndex = 0;

// ===================
// INITIALIZATION
// ===================

document.addEventListener('DOMContentLoaded', function() {
    initializeGiftBox();
    initializeFlipCards();
    initializePhotoStack();
    initializeLetter();
    startFloatingHearts();
    optimizeForMobile();
});

// ===================
// GIFT BOX FUNCTIONALITY
// ===================

function initializeGiftBox() {
    const giftBox = document.getElementById('giftBox');
    const giftBoxScreen = document.getElementById('giftBoxScreen');
    const contentScreen = document.getElementById('contentScreen');
    
    // Add both click and touch events for mobile
    giftBox.addEventListener('click', handleGiftBoxOpen);
    giftBox.addEventListener('touchstart', handleGiftBoxOpen);
    
    function handleGiftBoxOpen(e) {
        e.preventDefault(); // Prevent double firing
        
        // Add opening animation
        giftBox.classList.add('opening');
        
        // Play opening sound effect (if audio is available)
        playOpeningSound();
        
        // Create confetti explosion
        setTimeout(() => {
            createConfettiExplosion();
        }, 500);
        
        // Start background music
        setTimeout(() => {
            startBackgroundMusic();
        }, 800);
        
        // Transition to content screen
        setTimeout(() => {
            giftBoxScreen.classList.remove('active');
            contentScreen.classList.add('active');
        }, 2000);
    }
}

function createConfettiExplosion() {
    // Use canvas-confetti library
    const count = 200;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

function playOpeningSound() {
    // Create a simple sound effect using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio context not available');
    }
}

function startBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(e => {
        console.log('Auto-play prevented by browser');
    });
}

// ===================
// FLIP CARDS FUNCTIONALITY
// ===================

function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach((card, index) => {
        // Add both click and touch events
        card.addEventListener('click', handleCardFlip);
        card.addEventListener('touchstart', handleCardFlip);
        
        function handleCardFlip(e) {
            e.preventDefault(); // Prevent double firing
            
            // Create sparkle effect
            createSparkleEffect(card);
            
            // Play flip sound
            playFlipSound();
            
            setTimeout(() => {
                createMiniConfetti(card);
            }, 400);
        }
    });
}

function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkles = ['✨', '🌟', '💫', '⭐'];
    
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: sparkleOut 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        // Random direction
        const angle = (i * 60) * Math.PI / 180;
        const distance = 50 + Math.random() * 30;
        
        sparkle.style.setProperty('--x', Math.cos(angle) * distance + 'px');
        sparkle.style.setProperty('--y', Math.sin(angle) * distance + 'px');
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Add sparkle animation CSS if not exists
    if (!document.querySelector('#sparkle-styles')) {
        const style = document.createElement('style');
        style.id = 'sparkle-styles';
        style.textContent = `
            @keyframes sparkleOut {
                0% {
                    transform: translate(0, 0) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--x), var(--y)) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    confetti({
        particleCount: 30,
        spread: 60,
        origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#ff9a9e', '#fecfef', '#a8edea', '#fed6e3']
    });
}

function playFlipSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// ===================
// PHOTO STACK FUNCTIONALITY
// ===================

function initializePhotoStack() {
    const photos = document.querySelectorAll('.photo');
    const photoInstruction = document.querySelector('.photo-instruction');
    
    photos.forEach((photo, index) => {
        // Add both click and touch events
        photo.addEventListener('click', handlePhotoClick);
        photo.addEventListener('touchstart', handlePhotoClick);
        
        function handlePhotoClick(e) {
            e.preventDefault(); // Prevent double firing
            
            if (!photo.classList.contains('removed') && index === currentPhotoIndex) {
                // Mark as removed
                photo.classList.add('removed');
                
                // Update z-indices for remaining photos
                updatePhotoStack();
                
                // Play swoosh sound
                playSwooshSound();
                
                // Increment current index
                currentPhotoIndex++;
                
                // Create flying hearts
                createFlyingHearts(photo);
                
                // Check if all photos are viewed
                if (currentPhotoIndex >= photos.length) {
                    // Show restart button after a delay
                    setTimeout(() => {
                        showRestartButton();
                    }, 2000);
                }
            }
        }
    });
}

function showRestartButton() {
    const photoSection = document.querySelector('.photo-stack-section');
    const existingButton = document.getElementById('restartPhotosBtn');
    
    if (!existingButton) {
        const restartButton = document.createElement('div');
        restartButton.id = 'restartPhotosBtn';
        restartButton.className = 'restart-button';
        restartButton.innerHTML = `
            <div class="restart-content">
                <h3>🔄 Xem lại kỷ niệm</h3>
                <p>Chạm để xem lại từ đầu</p>
            </div>
        `;
        
        photoSection.appendChild(restartButton);
        
        // Add click event for restart
        restartButton.addEventListener('click', restartPhotoStack);
        restartButton.addEventListener('touchstart', restartPhotoStack);
        
        // Animate button appearance
        setTimeout(() => {
            restartButton.classList.add('visible');
        }, 100);
    }
}

function restartPhotoStack(e) {
    e.preventDefault();
    
    const photos = document.querySelectorAll('.photo');
    const restartButton = document.getElementById('restartPhotosBtn');
    
    // Reset current index
    currentPhotoIndex = 0;
    
    // Remove all photos with stagger effect
    photos.forEach((photo, index) => {
        setTimeout(() => {
            photo.classList.remove('removed');
            photo.style.transform = `rotate(${(index - 1) * 2}deg) translate(${index * 3}px, ${index * 5}px)`;
            photo.style.zIndex = photos.length - index;
        }, index * 200);
    });
    
    // Hide restart button
    if (restartButton) {
        restartButton.classList.remove('visible');
        setTimeout(() => {
            restartButton.remove();
        }, 300);
    }
    
    // Play restart sound
    playRestartSound();
    
    // Create celebration effect
    confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff9a9e', '#fecfef', '#a8edea']
    });
}

function updatePhotoStack() {
    const remainingPhotos = document.querySelectorAll('.photo:not(.removed)');
    remainingPhotos.forEach((photo, index) => {
        photo.style.zIndex = remainingPhotos.length - index;
        photo.style.transform = `rotate(${(index - 1) * 2}deg) translate(${index * 3}px, ${index * 5}px)`;
    });
}

function playSwooshSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('Audio context not available');
    }
}

function createFlyingHearts(element) {
    const rect = element.getBoundingClientRect();
    const hearts = ['💖', '💕', '💗', '💝'];
    
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: ${Math.random() * 10 + 15}px;
            pointer-events: none;
            z-index: 1000;
            animation: heartFly ${Math.random() * 2 + 2}s ease-out forwards;
        `;
        
        document.body.appendChild(heart);
        
        const angle = Math.random() * 360 * Math.PI / 180;
        const distance = Math.random() * 100 + 50;
        
        heart.style.setProperty('--x', Math.cos(angle) * distance + 'px');
        heart.style.setProperty('--y', Math.sin(angle) * distance - 50 + 'px');
        
        setTimeout(() => heart.remove(), 4000);
    }
    
    // Add heart fly animation CSS if not exists
    if (!document.querySelector('#heart-fly-styles')) {
        const style = document.createElement('style');
        style.id = 'heart-fly-styles';
        style.textContent = `
            @keyframes heartFly {
                0% {
                    transform: translate(0, 0) scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translate(calc(var(--x) * 0.5), calc(var(--y) * 0.5)) scale(1) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--x), var(--y)) scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================
// LETTER FUNCTIONALITY
// ===================

function initializeLetter() {
    const letterEnvelope = document.getElementById('letterEnvelope');
    const letterContent = document.getElementById('letterContent');
    const letterInstruction = document.getElementById('letterInstruction');
    
    // Add both click and touch events
    letterEnvelope.addEventListener('click', handleLetterOpen);
    letterEnvelope.addEventListener('touchstart', handleLetterOpen);
    
    function handleLetterOpen(e) {
        e.preventDefault(); // Prevent double firing
        
        // Add opening animation
        letterEnvelope.classList.add('opening');
        
        // Hide instruction with fade
        letterInstruction.style.transition = 'opacity 0.5s ease';
        letterInstruction.style.opacity = '0';
        setTimeout(() => {
            letterInstruction.style.display = 'none';
        }, 500);
        
        // Add envelope shaking effect
        letterEnvelope.classList.add('shaking');
        
        // Show letter content with typewriter effect
        setTimeout(() => {
            letterContent.classList.add('visible');
            playPaperSound();
            animateLetterText();
        }, 1200);
        
        // Create gentle confetti
        setTimeout(() => {
            createLetterConfetti();
        }, 1500);
        
        // Stop shaking
        setTimeout(() => {
            letterEnvelope.classList.remove('shaking');
        }, 1000);
    }
}

function animateLetterText() {
    const letterPaper = document.querySelector('.letter-paper');
    const paragraphs = letterPaper.querySelectorAll('p');
    const signature = letterPaper.querySelector('.letter-signature');
    
    // Add typewriter effect to paragraphs
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.classList.add('typewriter');
        }, index * 800);
    });
    
    // Animate signature
    setTimeout(() => {
        signature.classList.add('signature-animate');
    }, paragraphs.length * 800 + 500);
}

function createLetterConfetti() {
    // Create multiple small confetti bursts
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 30,
                spread: 35,
                origin: { 
                    x: 0.5 + (Math.random() - 0.5) * 0.3, 
                    y: 0.8 
                },
                colors: ['#fffef7', '#d63384', '#ff9a9e', '#fecfef'],
                shapes: ['square'],
                scalar: 0.6,
                gravity: 0.8
            });
        }, i * 300);
    }
}

function playPaperSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create paper rustling sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio context not available');
    }
}

function playRestartSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play ascending notes for restart
        const frequencies = [261, 329, 392, 523]; // C, E, G, C
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3 + index * 0.1);
            
            oscillator.start(audioContext.currentTime + index * 0.1);
            oscillator.stop(audioContext.currentTime + 0.3 + index * 0.1);
        });
    } catch (e) {
        console.log('Audio context not available');
    }
}

// ===================
// FLOATING HEARTS
// ===================

function startFloatingHearts() {
    setInterval(createFloatingHeart, 3000);
}

function createFloatingHeart() {
    const hearts = ['💖', '💕', '💗', '💝', '❤️'];
    const heart = document.createElement('div');
    
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * window.innerWidth + 'px';
    
    document.getElementById('floatingHearts').appendChild(heart);
    
    setTimeout(() => heart.remove(), 4000);
}

// ===================
// UTILITY FUNCTIONS
// ===================

// Smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Console messages
console.log('🎁 Chiếc Hộp Quà 20/10 Kỹ Thuật Số đã sẵn sàng! 🎁');
console.log('💖 Được tạo với tình yêu dành cho ngày Phụ nữ Việt Nam 💖');

// Handle visibility change to pause/resume background music
document.addEventListener('visibilitychange', function() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (document.hidden) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play().catch(e => {
            console.log('Auto-play prevented by browser');
        });
    }
});

// Keyboard shortcuts (Easter eggs)
document.addEventListener('keydown', function(e) {
    // Press 'L' for instant love confetti
    if (e.key.toLowerCase() === 'l') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff9a9e', '#fecfef', '#a8edea', '#fed6e3'],
            shapes: ['heart']
        });
    }
    
    // Press 'S' for sparkles
    if (e.key.toLowerCase() === 's') {
        createScreenSparkles();
    }
});

function createScreenSparkles() {
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            font-size: ${Math.random() * 20 + 10}px;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleOut 2s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    }
}

// ===================
// MOBILE OPTIMIZATION
// ===================

function optimizeForMobile() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Optimize viewport for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add mobile-specific styles
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
        
        // Optimize touch targets
        const touchTargets = document.querySelectorAll('.gift-box, .flip-card, .photo, .letter-envelope');
        touchTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });
        
        // Reduce animations for better performance
        if (window.DeviceMotionEvent === undefined) {
            document.body.classList.add('reduce-animations');
        }
    }
    
    // Optimize for low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.body.classList.add('low-end-device');
    }
}