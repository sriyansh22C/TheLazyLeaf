// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- MOBILE MENU ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});

// --- MENU FILTERING ---
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCategories = document.querySelectorAll('.menu-category');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        menuCategories.forEach(category => {
            if (filter === 'all' || category.getAttribute('data-category') === filter) {
                category.style.display = 'block';
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 50);
            } else {
                category.style.opacity = '0';
                category.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    category.style.display = 'none';
                }, 300);
            }
        });
    });
});

// --- HTML5 CANVAS SCROLL ANIMATION ---
const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

const frameCount = 240; // You have frames 001 to 240
const currentFrame = index => (
  `ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

// Scale canvas to fit window
const homeSection = document.getElementById('home');
const menuSection = document.getElementById('menu');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const img = new Image();
img.src = currentFrame(1);
img.onload = function() {
  // Draw first frame
  drawScaledImage(img);
};

// Preload images
const images = [];
const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    images[i] = new Image();
    images[i].src = currentFrame(i);
  }
};

preloadImages();

// Listen to scroll to update frame
window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  
  // Stretch animation through both the hero and menu sections
  let timelineLimit = 1500;
  if (homeSection && menuSection) {
      timelineLimit = (homeSection.offsetHeight + menuSection.offsetHeight) - (window.innerHeight / 2);
  }
  
  let scrollFraction = scrollTop / timelineLimit;
  if (scrollFraction > 1) scrollFraction = 1;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => updateImage(frameIndex + 1));
});

const updateImage = index => {
  if (images[index] && images[index].complete) {
      drawScaledImage(images[index]);
  } else {
      // fallback in case of slow loading
      const tempImg = new Image();
      tempImg.src = currentFrame(index);
      tempImg.onload = () => drawScaledImage(tempImg);
  }
}

function drawScaledImage(imageObj) {
  // scale image to cover the canvas (similar to object-fit: cover)
  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = imageObj.width / imageObj.height;
  
  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imageRatio) {
      drawHeight = canvas.width / imageRatio;
      offsetY = (canvas.height - drawHeight) / 2;
  } else {
      drawWidth = canvas.height * imageRatio;
      offsetX = (canvas.width - drawWidth) / 2;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(imageObj, offsetX, offsetY, drawWidth, drawHeight);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Redraw current frame
    const scrollTop = document.documentElement.scrollTop;
    let timelineLimit = 1500;
    if (homeSection && menuSection) {
        timelineLimit = (homeSection.offsetHeight + menuSection.offsetHeight) - (window.innerHeight / 2);
    }
    let scrollFraction = scrollTop / timelineLimit;
    if (scrollFraction > 1) scrollFraction = 1;
    const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
    updateImage(frameIndex + 1 || 1);
});
