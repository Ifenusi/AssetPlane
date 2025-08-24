
// Sample agent data - in production, this would come from API
const agentsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Real Estate Consultant",
    image: "property.jpg",
    rating: 4.9,
    reviews: 127,
    specialty: ["residential", "luxury"],
    location: "Lagos, Nigeria",
    experience: "8+ years",
    properties: 45,
    phone: "+234-801-234-5678",
    email: "sarah.j@assetplane.com",
    verified: true,
    description: "Specializing in luxury residential properties across Lagos with expertise in diaspora investments."
  },
  {
    id: 2,
    name: "Michael Adebayo",
    title: "Commercial Property Expert",
    image: "buildings urban.jpg",
    rating: 4.8,
    reviews: 89,
    specialty: ["commercial", "investment"],
    location: "Abuja, Nigeria",
    experience: "12+ years",
    properties: 67,
    phone: "+234-803-456-7890",
    email: "michael.a@assetplane.com",
    verified: true,
    description: "Leading commercial property consultant with extensive portfolio in Abuja business districts."
  },
  {
    id: 3,
    name: "Chiamaka Okafor",
    title: "Diaspora Property Specialist",
    image: "new-york.jpg",
    rating: 5.0,
    reviews: 156,
    specialty: ["diaspora", "residential"],
    location: "Enugu, Nigeria",
    experience: "6+ years",
    properties: 34,
    phone: "+234-805-678-9012",
    email: "chiamaka.o@assetplane.com",
    verified: true,
    description: "Dedicated to helping Nigerians in diaspora find and manage properties back home seamlessly."
  },
  {
    id: 4,
    name: "David Kimani",
    title: "Agricultural Land Expert",
    image: "agriculture.jpg",
    rating: 4.7,
    reviews: 73,
    specialty: ["agriculture", "commercial"],
    location: "Ogun, Nigeria",
    experience: "10+ years",
    properties: 52,
    phone: "+234-807-890-1234",
    email: "david.k@assetplane.com",
    verified: true,
    description: "Specialist in agricultural land acquisition and development across Southwest Nigeria."
  },
  {
    id: 5,
    name: "Fatima Al-Hassan",
    title: "Luxury Property Advisor",
    image: "skyscrapers.jpg",
    rating: 4.9,
    reviews: 94,
    specialty: ["luxury", "commercial"],
    location: "Kano, Nigeria",
    experience: "7+ years",
    properties: 28,
    phone: "+234-809-012-3456",
    email: "fatima.a@assetplane.com",
    verified: true,
    description: "Premium luxury property consultant serving high-net-worth individuals and corporations."
  },
  {
    id: 6,
    name: "Emeka Nwosu",
    title: "Residential Property Expert",
    image: "sharp shot of houses.jpg",
    rating: 4.8,
    reviews: 112,
    specialty: ["residential", "investment"],
    location: "Port Harcourt, Nigeria",
    experience: "9+ years",
    properties: 89,
    phone: "+234-802-345-6789",
    email: "emeka.n@assetplane.com",
    verified: true,
    description: "Expert in residential properties with focus on family homes and investment opportunities."
  }
];

// DOM Elements
const agentsContainer = document.getElementById('agentsContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  renderAgents(agentsData);
  setupFilters();
  setupThemeToggle();
  setupSearch(); // Initialize search functionality
  setupMobileMenu();
});

// Add mobile menu functionality
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

// Render agents
function renderAgents(agents) {
  agentsContainer.innerHTML = '';
  
  agents.forEach(agent => {
    const agentCard = createAgentCard(agent);
    agentsContainer.appendChild(agentCard);
  });
}

// Create agent card
function createAgentCard(agent) {
  const card = document.createElement('div');
  card.className = 'agent-card';
  card.setAttribute('data-specialty', agent.specialty.join(' '));
  
  card.innerHTML = `
    <div class="agent-image">
      <img src="${agent.image}" alt="${agent.name}" loading="lazy">
      ${agent.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
    </div>
    <div class="agent-info">
      <h3>${agent.name}</h3>
      <p class="agent-title">${agent.title}</p>
      <div class="agent-rating">
        <div class="stars">
          ${generateStars(agent.rating)}
        </div>
        <span class="rating-text">${agent.rating} (${agent.reviews} reviews)</span>
      </div>
      <p class="agent-location"><i class="fas fa-map-marker-alt"></i> ${agent.location}</p>
      <p class="agent-experience"><i class="fas fa-briefcase"></i> ${agent.experience}</p>
      <p class="agent-properties"><i class="fas fa-home"></i> ${agent.properties} properties</p>
      <p class="agent-description">${agent.description}</p>
      <div class="agent-specialties">
        ${agent.specialty.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
      </div>
      <div class="agent-actions">
        <button class="btn primary" onclick="contactAgent(${agent.id})">
          <i class="fas fa-phone"></i> Contact
        </button>
        <button class="btn secondary" onclick="viewProfile(${agent.id})">
          <i class="fas fa-user"></i> View Profile
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

// Setup filters
function setupFilters() {
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter agents
      if (filter === 'all') {
        renderAgents(agentsData);
      } else {
        const filteredAgents = agentsData.filter(agent => 
          agent.specialty.includes(filter)
        );
        renderAgents(filteredAgents);
      }
    });
  });
}

// Contact agent
function contactAgent(agentId) {
  const agent = agentsData.find(a => a.id === agentId);
  if (agent) {
    alert(`Contact ${agent.name}:\nPhone: ${agent.phone}\nEmail: ${agent.email}`);
  }
}

// View agent profile
function viewProfile(agentId) {
  const agent = agentsData.find(a => a.id === agentId);
  if (agent) {
    alert(`Viewing profile for ${agent.name}`);
  }
}

// Theme toggle functionality
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// Search functionality (bonus feature)
function setupSearch() {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search agents by name or location...';
  searchInput.className = 'agent-search';
  
  const searchContainer = document.querySelector('.section-header');
  searchContainer.appendChild(searchInput);
  
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredAgents = agentsData.filter(agent => 
      agent.name.toLowerCase().includes(searchTerm) ||
      agent.location.toLowerCase().includes(searchTerm)
    );
    renderAgents(filteredAgents);
  });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  renderAgents(agentsData);
  setupFilters();
  setupThemeToggle();
  setupSearch(); // Initialize search functionality
});
