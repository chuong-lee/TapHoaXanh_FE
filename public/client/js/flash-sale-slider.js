class FlashSaleSlider {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.slider-track');
        this.items = container.querySelectorAll('.slider-item');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.dots = container.querySelectorAll('.dot-btn');
        
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.totalSlides = this.items.length;
        this.maxIndex = Math.max(0, this.totalSlides - this.itemsPerView);
        
        this.init();
    }
    
    getItemsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 4; // Desktop
        if (width >= 768) return 3;  // Tablet
        if (width >= 576) return 2;  // Small tablet
        return 1; // Mobile
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlider();
        this.updateDots();
        this.updateNavigationButtons();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            }
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            const newItemsPerView = this.getItemsPerView();
            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.maxIndex = Math.max(0, this.totalSlides - this.itemsPerView);
                this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                this.updateSlider();
                this.updateDots();
                this.updateNavigationButtons();
            }
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
            this.updateDots();
            this.updateNavigationButtons();
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
            this.updateDots();
            this.updateNavigationButtons();
        }
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
        this.updateDots();
        this.updateNavigationButtons();
    }
    
    updateSlider() {
        const translateX = -(this.currentIndex * (100 / this.itemsPerView));
        this.track.style.transform = `translateX(${translateX}%)`;
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.maxIndex;
        
        this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
        this.nextBtn.classList.toggle('disabled', this.currentIndex === this.maxIndex);
    }
}

// Auto-play functionality
class AutoPlaySlider extends FlashSaleSlider {
    constructor(container, interval = 5000) {
        super(container);
        this.interval = interval;
        this.autoPlayTimer = null;
        this.isPaused = false;
        
        this.startAutoPlay();
        this.setupAutoPlayControls();
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (!this.isPaused) {
                if (this.currentIndex >= this.maxIndex) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex++;
                }
                this.updateSlider();
                this.updateDots();
                this.updateNavigationButtons();
            }
        }, this.interval);
    }
    
    setupAutoPlayControls() {
        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.isPaused = true;
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });
        
        // Pause on touch
        this.container.addEventListener('touchstart', () => {
            this.isPaused = true;
        });
        
        this.container.addEventListener('touchend', () => {
            setTimeout(() => {
                this.isPaused = false;
            }, 1000);
        });
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
}

// Countdown Timer Class
class CountdownTimer {
    constructor() {
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        
        // Set end time (24 hours from now)
        this.endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        this.init();
    }
    
    init() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    }
    
    updateTimer() {
        const now = new Date().getTime();
        const distance = this.endTime - now;
        
        if (distance < 0) {
            // Reset timer when it reaches zero
            this.endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (this.daysElement) this.daysElement.textContent = days.toString().padStart(2, '0');
        if (this.hoursElement) this.hoursElement.textContent = hours.toString().padStart(2, '0');
        if (this.minutesElement) this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (this.secondsElement) this.secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
}

// Product Actions Handler
class ProductActions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupAddToCart();
        this.setupWishlist();
        this.setupQuickView();
    }
    
    setupAddToCart() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                const productCard = btn.closest('.flash-product-card');
                const productName = productCard.querySelector('.product-name').textContent;
                
                // Add animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
                
                // Show notification
                this.showNotification(`${productName} added to cart!`, 'success');
                
                // Here you would typically add to cart logic
                console.log('Added to cart:', productName);
            }
        });
    }
    
    setupWishlist() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn')) {
                const btn = e.target.closest('.wishlist-btn');
                const productCard = btn.closest('.flash-product-card');
                const productName = productCard.querySelector('.product-name').textContent;
                
                btn.classList.toggle('active');
                const isActive = btn.classList.contains('active');
                
                // Change icon
                const icon = btn.querySelector('i');
                icon.className = isActive ? 'fas fa-heart' : 'far fa-heart';
                
                // Show notification
                const message = isActive ? `${productName} added to wishlist!` : `${productName} removed from wishlist!`;
                this.showNotification(message, isActive ? 'success' : 'info');
                
                console.log(isActive ? 'Added to wishlist:' : 'Removed from wishlist:', productName);
            }
        });
    }
    
    setupQuickView() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-view-btn')) {
                const btn = e.target.closest('.quick-view-btn');
                const productCard = btn.closest('.flash-product-card');
                const productName = productCard.querySelector('.product-name').textContent;
                
                // Here you would typically show a modal with product details
                this.showNotification(`Quick view: ${productName}`, 'info');
                console.log('Quick view:', productName);
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider
    const sliderContainer = document.querySelector('.flash-sale-slider');
    if (sliderContainer) {
        new AutoPlaySlider(sliderContainer, 4000); // Auto-play every 4 seconds
    }
    
    // Initialize countdown timer
    new CountdownTimer();
    
    // Initialize product actions
    new ProductActions();
});

// Export for use in other modules
window.FlashSaleSlider = FlashSaleSlider;
window.AutoPlaySlider = AutoPlaySlider;
