// Enhanced JavaScript for AssetPlane - Alpha Mode

// Mobile Menu Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenu.classList.toggle("open");
  });
}

// Smooth Scroll from hero button to features
const exploreBtn = document.getElementById("exploreBtn");
const featuresSection = document.querySelector(".features");

if (exploreBtn && featuresSection) {
  exploreBtn.addEventListener("click", () => {
    featuresSection.scrollIntoView({ behavior: "smooth" });
  });
}

// Testimonials Carousel Functionality
const testimonials = document.querySelectorAll(".testimonial");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let currentIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });
}

if (next) {
  next.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  });
}

if (prev) {
  prev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  });
}

// Auto-rotate testimonials
setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
}, 5000);

// Payment Functionality
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("payment-form");
  const paymentStatus = document.getElementById("payment-status");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    paymentStatus.textContent = "Processing Payment...";
    paymentStatus.style.color = "orange";

    setTimeout(() => {
      paymentStatus.textContent = "Payment Successful ✅";
      paymentStatus.style.color = "green";
    }, 3000); // Simulating transaction delay
  });
});

// Inspection Tracker Logic
document.addEventListener("DOMContentLoaded", () => {
  const statusSpan = document.getElementById("inspection-status");
  const satisfiedBox = document.getElementById("satisfied");
  const agentSelect = document.getElementById("assign-agent");

  // Assigning an agent
  agentSelect?.addEventListener("change", () => {
    if (agentSelect.value) {
      statusSpan.textContent = "Agent Assigned: " + agentSelect.options[agentSelect.selectedIndex].text;
      statusSpan.style.color = "blue";
    }
  });

  // Marking inspection satisfied
  satisfiedBox?.addEventListener("change", () => {
    if (satisfiedBox.checked) {
      statusSpan.textContent = "Inspection Satisfied ✅";
      statusSpan.style.color = "green";
    } else {
      statusSpan.textContent = "Pending";
      statusSpan.style.color = "red";
    }
  });
});

// Other existing JavaScript code...
// listing sctipt// Handle Filters
document.getElementById("filterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let location = document.getElementById("searchLocation").value.toLowerCase();
  let type = document.getElementById("propertyType").value;
  let minPrice = parseInt(document.getElementById("minPrice").value) || 0;
  let maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;

  let cards = document.querySelectorAll(".property-card");

  cards.forEach(card => {
    let cardType = card.dataset.type;
    let cardLocation = card.dataset.location.toLowerCase();
    let cardPrice = parseInt(card.dataset.price);

    if (
      (location && !cardLocation.includes(location)) ||
      (type && cardType !== type) ||
      cardPrice < minPrice ||
      cardPrice > maxPrice
    ) {
      card.style.display = "none";
    } else {
      card.style.display = "block";
    }
  });
});

// Handle Inspection Tracking
document.querySelectorAll(".inspection-check").forEach(check => {
  check.addEventListener("change", function () {
    if (this.checked) {
      alert("Inspection completed for this property.");
    }
  });
});

document.querySelectorAll(".satisfaction-check").forEach(check => {
  check.addEventListener("change", function () {
    if (this.checked) {
      alert("Client marked as satisfied ✅");
    }
  });
});

// Handle Payment Flow
document.querySelectorAll(".pay-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    alert("Redirecting to payment gateway...");
    window.location.href = "payment.html"; // create payment.html later
  });
});
// Handle Agent Assignment

//Kraffttalk page 
// KrafftTalk carousel autoplay
const track = document.querySelector('.carousel-track');
if (track) {
  let scrollAmount = 0;
  setInterval(() => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
    scrollAmount += 300;
    if (scrollAmount >= track.scrollWidth - track.clientWidth) {
      scrollAmount = 0;
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 4000);
}
// KrafftTalk carousel navigation