// AssetPlane - World's Best Real Estate Platform JavaScript
// Advanced functionality with dark/light mode, animations, and full interactivity

class AssetPlaneApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupNavigation();
    this.setupAnimations();
    this.setupPropertyFilters();
    this.setupContactForms();
    this.setupScrollEffects();
    this.setupLazyLoading();
    this.setupSearch();
    this.setupNotifications();
  }

  // Theme Management
  setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(themeToggle);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // Advanced Navigation
  setupNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Active navigation highlighting
    this.updateActiveNav();
    window.addEventListener('scroll', () => this.updateActiveNav());
  }

  updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}` || 
          (current === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Advanced Animations
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .property-card, .service-card').forEach(el => {
      observer.observe(el);
    });
  }

  // Advanced Property Filters
  setupPropertyFilters() {
    const filterForm = document.getElementById('filterForm');
    if (!filterForm) return;

    const properties = document.querySelectorAll('.property-card');
    const resultsCount = document.getElementById('resultsCount');

    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.filterProperties(properties, resultsCount);
    });

    // Real-time filtering
    filterForm.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => this.filterProperties(properties, resultsCount));
    });
  }

  filterProperties(properties, resultsCount) {
    const location = document.getElementById('searchLocation')?.value.toLowerCase() || '';
    const type = document.getElementById('propertyType')?.value || '';
    const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || 10000000;

    let visibleCount = 0;

    properties.forEach(property => {
      const propertyLocation = property.dataset.location?.toLowerCase() || '';
      const propertyType = property.dataset.type || '';
      const propertyPrice = parseInt(property.dataset.price) || 0;

      const matchesLocation = !location || propertyLocation.includes(location);
      const matchesType = !type || propertyType === type;
      const matchesPrice = propertyPrice >= minPrice && propertyPrice <= maxPrice;

      const isVisible = matchesLocation && matchesType && matchesPrice;
      
      property.style.display = isVisible ? 'block' : 'none';
      property.classList.toggle('hidden', !isVisible);
      
      if (isVisible) visibleCount++;
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} properties`;
    }
  }

  // Advanced Contact Forms
  setupContactForms() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleFormSubmission(form);
      });
    });
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      this.showNotification('Message sent successfully!', 'success');
      form.reset();
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Send Message';
    }
  }

  // Scroll Effects
  setupScrollEffects() {
    // Scroll progress indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollIndicator.style.transform = `scaleX(${scrollPercent}%)`;
    });

    // Parallax effect for hero sections
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  // Lazy Loading
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Advanced Search
  setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  }

  performSearch(query) {
    if (!query.trim()) {
      this.clearSearchResults();
      return;
    }

    // Simulate search API
    const results = this.searchProperties(query);
    this.displaySearchResults(results);
  }

  searchProperties(query) {
    const properties = [
      { id: 1, title: 'Luxury 3-Bed Apartment', location: 'Victoria Island', price: 250000 },
      { id: 2, title: 'Modern 4-Bed Duplex', location: 'Lekki', price: 450000 },
      { id: 3, title: 'Prime Commercial Space', location: 'Ikeja', price: 750000 },
      { id: 4, title: 'Residential Land', location: 'Ajah', price: 120000 },
      { id: 5, title: 'Executive Penthouse', location: 'Ikoyi', price: 350000 },
      { id: 6, title: 'Family Home', location: 'Surulere', price: 180000 }
    ];

    return properties.filter(property => 
      property.title.toLowerCase().includes(query.toLowerCase()) ||
      property.location.toLowerCase().includes(query.toLowerCase())
    );
  }

  displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    searchResults.innerHTML = results.map(property => `
      <div class="search-result" data-id="${property.id}">
        <h4>${property.title}</h4>
        <p>${property.location} - $${property.price.toLocaleString()}</p>
      </div>
    `).join('');
  }

  clearSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) searchResults.innerHTML = '';
  }

  // Notifications
  setupNotifications() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;

    const container = document.querySelector('.notification-container');
    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  // Property Details Modal
  showPropertyDetails(propertyId) {
    const property = this.getPropertyById(propertyId);
    if (!property) return;

    const modal = this.createModal(property);
    document.body.appendChild(modal);
  }

  getPropertyById(id) {
    // Mock property data - replace with actual API
    const properties = {
      '001': {
        title: 'Luxury 3-Bed Apartment',
        location: 'Victoria Island, Lagos',
        price: 250000,
        description: 'Stunning 3-bedroom apartment with panoramic ocean views...',
        features: ['3 Bedrooms', '2 Bathrooms', '150 sqm', 'Ocean View', 'Concierge'],
        images: ['../Images/city.jpg']
      }
    };
    return properties[id];
  }

  createModal(property) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>${property.title}</h2>
        <p class="location">${property.location}</p>
        <p class="price">$${property.price.toLocaleString()}</p>
        <p>${property.description}</p>
        <div class="features">
          ${property.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="app.scheduleTour('${property.id}')">Schedule Tour</button>
          <button class="btn-secondary" onclick="app.contactAgent('${property.id}')">Contact Agent</button>
        </div>
      </div>
    `;

    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    return modal;
  }

  scheduleTour(propertyId) {
    this.showNotification('Tour scheduled! Our agent will contact you within 24 hours.', 'success');
  }

  contactAgent(propertyId) {
    this.showNotification('Agent contact details sent to your email!', 'info');
  }
}

// Initialize the app
const app = new AssetPlaneApp();

// Global functions for HTML onclick handlers
window.viewProperty = (id) => app.showPropertyDetails(id);
window.scheduleTour = (id) => app.scheduleTour(id);
window.contactAgent = (id) => app.contactAgent(id);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AssetPlaneApp;
}
