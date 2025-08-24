not /**
 * ENHANCED ASSETPLANE PROPERTIES SYSTEM
 * Advanced property filtering, search, and interaction system with modern enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
  class EnhancedPropertyManager {
  constructor() {
    this.properties = [];
    this.filteredProperties = [];
    this.currentPage = 1;
    this.propertiesPerPage = 9;
    this.favorites = new Set();
    this.searchHistory = [];
    this.filters = {
      search: '',
      type: '',
      priceRange: '',
      location: '',
      bedrooms: '',
      minPrice: 0,
      maxPrice: Infinity
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadProperties();
    this.setupSearch();
    this.setupFilters();
    this.loadFavorites();
    this.loadSearchHistory();
    this.setupAnimations();
  }

  setupEventListeners() {
    // Search form
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.filterProperties();
      });
    }

    // Real-time search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.handleSearch();
      }, 300));
    }

    // Enhanced filters
    const filterInputs = ['property-type', 'price-range', 'location-filter', 'bedrooms'];
    filterInputs.forEach(filterId => {
      const filter = document.getElementById(filterId);
      if (filter) {
        filter.addEventListener('change', () => {
          this.filterProperties();
        });
      }
    });

    // Load more
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreProperties();
      });
    }

    // Property actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="schedule-inspection"]')) {
        this.scheduleInspection(e.target.dataset.property, e.target.dataset.id);
      }
      
      if (e.target.matches('[data-action="save-property"]')) {
        this.toggleFavorite(e.target.dataset.id);
      }
      
      if (e.target.matches('[data-action="view-details"]')) {
        this.viewPropertyDetails(e.target.dataset.id);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    });
  }

  loadProperties() {
    this.properties = [
      {
        id: 1,
        title: "Luxury Waterfront Villa",
        location: "Victoria Island, Lagos, Nigeria",
        description: "Stunning 5-bedroom waterfront villa with panoramic ocean views and private beach access.",
        price: 2850000,
        type: "villa",
        bedrooms: 5,
        bathrooms: 6,
        area: 4500,
        image: "property.jpg",
        featured: true,
        new: false,
        amenities: ["Swimming Pool", "Beach Access", "Security", "Parking"],
        yearBuilt: 2022,
        agent: "Premium Realty"
      },
      {
        id: 2,
        title: "Modern Penthouse Suite",
        location: "Ikoyi, Lagos, Nigeria",
        description: "Exclusive penthouse with 360-degree city views and private rooftop terrace.",
        price: 1850000,
        type: "apartment",
        bedrooms: 3,
        bathrooms: 4,
        area: 2800,
        image: "buildings urban.jpg",
        featured: true,
        new: true,
        amenities: ["Rooftop Terrace", "Gym", "Concierge", "Parking"],
        yearBuilt: 2023,
        agent: "Elite Properties"
      },
      {
        id: 3,
        title: "Executive Family Home",
        location: "Abuja, Nigeria",
        description: "Magnificent 4-bedroom family residence in prestigious neighborhood with landscaped gardens.",
        price: 1200000,
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: 2200,
        image: "sharp shot of houses.jpg",
        featured: false,
        new: false,
        amenities: ["Garden", "Security", "Parking", "Playground"],
        yearBuilt: 2021,
        agent: "Family Homes Ltd"
      },
      {
        id: 4,
        title: "Commercial Development Land",
        location: "Accra, Ghana",
        description: "Prime commercial land in rapidly developing business district with excellent road access.",
        price: 850000,
        type: "land",
        bedrooms: 0,
        bathrooms: 0,
        area: 8000,
        image: "field.jpg",
        featured: false,
        new: true,
        amenities: ["Road Access", "Utilities", "Zoned Commercial"],
        yearBuilt: 2024,
        agent: "Commercial Ventures"
      },
      {
        id: 5,
        title: "Luxury Beachfront Apartment",
        location: "Cape Town, South Africa",
        description: "Contemporary 2-bedroom apartment with direct beach access and stunning ocean views.",
        price: 750000,
        type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: "skyscrapers.jpg",
        featured: true,
        new: false,
        amenities: ["Beach Access", "Balcony", "Security", "Parking"],
        yearBuilt: 2022,
        agent: "Coastal Properties"
      },
      {
        id: 6,
        title: "Historic Townhouse",
        location: "Nairobi, Kenya",
        description: "Beautifully restored 4-bedroom townhouse combining historic charm with modern luxury.",
        price: 650000,
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: 2200,
        image: "new-york.jpg",
        featured: false,
        new: false,
        amenities: ["Historic Features", "Modern Kitchen", "Garden", "Parking"],
        yearBuilt: 2020,
        agent: "Heritage Homes"
      }
    ];

    this.filteredProperties = [...this.properties];
    this.renderProperties();
  }

  handleSearch() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    
    // Save to search history
    if (searchTerm && !this.searchHistory.includes(searchTerm)) {
      this.searchHistory.unshift(searchTerm);
      this.searchHistory = this.searchHistory.slice(0, 5); // Keep last 5 searches
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
    
    this.filterProperties();
  }

  filterProperties() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const propertyType = document.getElementById('property-type')?.value || '';
    const priceRange = document.getElementById('price-range')?.value || '';
    const location = document.getElementById('location-filter')?.value || '';
    const bedrooms = document.getElementById('bedrooms')?.value || '';

    this.filters = {
      search: searchTerm,
      type: propertyType,
      priceRange: priceRange,
      location: location,
      bedrooms: bedrooms
    };

    this.filteredProperties = this.properties.filter(property => {
      // Search term filter
      if (searchTerm) {
        const searchFields = [
          property.title.toLowerCase(),
          property.description.toLowerCase(),
          property.location.toLowerCase(),
          property.agent.toLowerCase()
        ];
        if (!searchFields.some(field => field.includes(searchTerm))) {
          return false;
        }
      }

      // Property type filter
      if (propertyType && property.type !== propertyType) {
        return false;
      }

      // Location filter
      if (location && !property.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Bedrooms filter
      if (bedrooms && property.bedrooms < parseInt(bedrooms)) {
        return false;
      }

      // Price range filter
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        if (min && property.price < parseInt(min)) return false;
        if (max && property.price > parseInt(max)) return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.renderProperties();
    this.updateResultsCount();
  }

  updateResultsCount() {
    const countElement = document.getElementById('results-count');
    if (countElement) {
      countElement.textContent = `${this.filteredProperties.length} properties found`;
    }
  }

  renderProperties() {
    const propertyGrid = document.getElementById('properties-grid');
    const loadingState = document.getElementById('loading-state');
    
    if (!propertyGrid) return;

    if (loadingState) {
      loadingState.style.display = 'flex';
    }

    setTimeout(() => {
      if (loadingState) {
        loadingState.style.display = 'none';
      }

      const propertiesToShow = this.filteredProperties.slice(0, this.currentPage * this.propertiesPerPage);
      
      propertyGrid.innerHTML = propertiesToShow.map(property => this.createPropertyCard(property)).join('');

      const loadMoreBtn = document.getElementById('load-more');
      if (loadMoreBtn) {
        loadMoreBtn.style.display = 
          propertiesToShow.length >= this.filteredProperties.length ? 'none' : 'block';
        loadMoreBtn.textContent = `Load More (${this.filteredProperties.length - propertiesToShow.length} remaining)`;
      }
    }, 500);
  }

  createPropertyCard(property) {
    const isFavorite = this.favorites.has(property.id.toString());
    const badges = [];
    
    if (property.featured) badges.push('<span class="property-badge property-badge--featured">Featured</span>');
    if (property.new) badges.push('<span class="property-badge property-badge--new">New</span>');
    
    return `
      <article class="property-card" role="listitem" data-property-id="${property.id}">
        <figure class="property-image-container">
          <img 
            src="${property.image}" 
            alt="${property.title}"
            class="property-image"
            loading="lazy"
            width="400"
            height="300"
          >
          ${badges.join('')}
        </figure>
        
        <div class="property-content">
          <header class="property-header">
            <h3 class="property-title">${property.title}</h3>
            <p class="property-location">
              <svg class="property-location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${property.location}
            </p>
          </header>
          
          <p class="property-description">${property.description}</p>
          
          <div class="property-meta">
            <ul class="property-features" role="list">
              ${property.bedrooms > 0 ? `
                <li class="property-feature">
                  <span class="property-feature-value">${property.bedrooms}</span>
                  <span class="property-feature-label">Beds</span>
                </li>
              ` : ''}
              ${property.bathrooms > 0 ? `
                <li class="property-feature">
                  <span class="property-feature-value">${property.bathrooms}</span>
                  <span class="property-feature-label">Baths</span>
                </li>
              ` : ''}
              <li class="property-feature">
                <span class="property-feature-value">${property.area.toLocaleString()}</span>
                <span class="property-feature-label">sq ft</span>
              </li>
              <li class="property-feature">
                <span class="property-feature-value">${property.yearBuilt}</span>
                <span class="property-feature-label">Year</span>
              </li>
            </ul>
            
            <div class="property-amenities">
              ${property.amenities.slice(0, 3).map(amenity => 
                `<span class="amenity-tag">${amenity}</span>`
              ).join('')}
              ${property.amenities.length > 3 ? 
                `<span class="amenity-tag">+${property.amenities.length - 3} more</span>` : ''
              }
            </div>
          </div>
          
          <footer class="property-footer">
            <div class="property-price-info">
              <p class="property-price">$${property.price.toLocaleString()}</p>
              <p class="property-agent">Listed by ${property.agent}</p>
            </div>
            <div class="property-actions">
              <button class="btn btn-primary" data-action="schedule-inspection" 
                      data-property="${property.title}" data-id="${property.id}">
                Schedule Inspection
              </button>
              <button class="btn btn-secondary" data-action="save-property" data-id="${property.id}">
                ${isFavorite ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button class="btn btn-outline" data-action="view-details" data-id="${property.id}">
                View Details
              </button>
            </div>
          </footer>
        </div>
      </article>
    `;
  }

  loadMoreProperties() {
    this.currentPage++;
    this.renderProperties();
    
    // Smooth scroll to new content
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  async scheduleInspection(propertyName, propertyId) {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    
    if (!userSession.email) {
      this.showMessage('Please login to schedule an inspection', 'warning');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }

    const inspectionDate = prompt('Enter preferred inspection date (YYYY-MM-DD):');
    if (!inspectionDate) return;

    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
    const newInspection = {
      id: Date.now(),
      propertyName: propertyName,
      propertyId: propertyId,
      date: inspectionDate,
      status: 'pending',
      userEmail: userSession.email,
      createdAt: new Date().toISOString()
    };
    
    inspections.push(newInspection);
    localStorage.setItem('inspections', JSON.stringify(inspections));
    
    this.showMessage(`Inspection scheduled for ${propertyName} on ${inspectionDate}`, 'success');
  }

  toggleFavorite(propertyId) {
    if (this.favorites.has(propertyId)) {
      this.favorites.delete(propertyId);
    } else {
      this.favorites.add(propertyId);
    }
    
    localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    this.renderProperties();
    
    // Update button state
    const button = document.querySelector(`[data-action="save-property"][data-id="${propertyId}"]`);
    if (button) {
      button.textContent = this.favorites.has(propertyId) ? '❤️ Saved' : '🤍 Save';
    }
  }

  viewPropertyDetails(propertyId) {
    const property = this.properties.find(p => p.id === parseInt(propertyId));
    if (property) {
      // Store selected property for details page
      localStorage.setItem('selectedProperty', JSON.stringify(property));
      window.location.href = `property-details.html?id=${propertyId}`;
    }
  }

  loadFavorites() {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.favorites = new Set(saved);
  }

  loadSearchHistory() {
    const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    this.searchHistory = saved;
  }

  setupAnimations() {
    // Add intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('.property-image').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('propertyMessages') || this.createMessageContainer();
    const messageElement = document.createElement('div');
    messageElement.className = `property-message property-message--${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.remove();
    }, 4000);
  }

  createMessageContainer() {
    const container = document.createElement('div');
    container.id = 'propertyMessages';
    container.className = 'property-messages';
    document.body.appendChild(container);
    return container;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  setupSearch() {
    // Add search suggestions
    const searchInput = document.getElementById('search-input');
    if (searchInput && this.searchHistory.length > 0) {
      const datalist = document.createElement('datalist');
      datalist.id = 'search-suggestions';
      this.searchHistory.forEach(term => {
        const option = document.createElement('option');
        option.value = term;
        datalist.appendChild(option);
      });
      document.body.appendChild(datalist);
      searchInput.setAttribute('list', 'search-suggestions');
    }
  }

  setupFilters() {
    // Add price range slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        document.getElementById('price-display').textContent = `$${e.target.value}`;
        this.filterProperties();
      });
    }
  }
}

// Enhanced property system initialization
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedPropertyManager();
});

// Add CSS for enhanced messages and animations
const style = document.createElement('style');
style.textContent = `
  .property-messages {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    max-width: 400px;
  }

  .property-message {
    padding: 1rem 1.5rem;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: fadeInUp 0.3s ease;
    text-align: center;
  }

  .property-message--success {
    background: linear-gradient(135deg, #4caf50, #388e3c);
  }

  .property-message--warning {
    background: linear-gradient(135deg, #ff9800, #f57c00);
  }

  .property-message--error {
    background: linear-gradient(135deg, #f44336, #d32f2f);
  }

  @keyframes fadeInUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
+    to {
+      transform: translate(-50%, 0);
+      opacity: 1;
+    }
+  }

+  .property-image {
+    transition: transform 0.3s ease;
+  }

+  .property-image:hover {
+    transform: scale(1.05);
+  }

+  .amenity-tag {
+    display: inline-block;
+    background: #f0f0f0;
+    color: #666;
+    padding: 0.25rem 0.5rem;
+    margin: 0.125rem;
+    border-radius: 12px;
+    font-size: 0.75rem;
+  }

+  .property-meta {
+    margin: 1rem 0;
+  }

+  .property-price-info {
+    display: flex;
+    justify-content: space-between;
+    align-items: center;
+    margin-bottom: 1rem;
+  }

+  .property-agent {
+    font-size: 0.875rem;
+    color: #666;
+  }

+  .property-actions {
+    display: flex;
+    gap: 0.5rem;
+    flex-wrap: wrap;
+  }

+  .btn-outline {
+    background: transparent;
+    color: #00c3ff;
+    border: 1px solid #00c3ff;
+  }

+  .btn-outline:hover {
+    background: #00c3ff;
+    color: white;
+  }
+`;
+document.head.appendChild(style);   
