// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      
      // Change icon based on menu state
      const icon = mobileMenu.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });
    
    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
          const icon = mobileMenu.querySelector('i');
          icon.className = 'fas fa-bars';
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        icon.className = 'fas fa-bars';
      }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        icon.className = 'fas fa-bars';
      }
    });
  }
});
