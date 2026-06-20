// 3D Scene Setup with Three.js
let scene, camera, renderer;
let particles = [];
let isMobile = window.innerWidth < 768;

function initThreeJS() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = null;

  const canvas = document.getElementById('canvas');
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  // Create animated particles
  createParticles();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  // Start animation loop
  animate();
}

function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const particleCount = isMobile ? 50 : 150;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200;
    positions[i + 1] = (Math.random() - 0.5) * 200;
    positions[i + 2] = (Math.random() - 0.5) * 200;

    velocities[i] = (Math.random() - 0.5) * 0.5;
    velocities[i + 1] = (Math.random() - 0.5) * 0.5;
    velocities[i + 2] = (Math.random() - 0.5) * 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x2563eb,
    size: 0.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Store for animation
  particles = {
    points,
    geometry,
    velocities,
    colors: []
  };
}

function animate() {
  requestAnimationFrame(animate);

  if (particles.points) {
    const positions = particles.points.geometry.attributes.position.array;
    const velocities = particles.velocities;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Bounce particles
      if (positions[i] > 100 || positions[i] < -100) velocities[i] *= -1;
      if (positions[i + 1] > 100 || positions[i + 1] < -100) velocities[i + 1] *= -1;
      if (positions[i + 2] > 100 || positions[i + 2] < -100) velocities[i + 2] *= -1;
    }

    particles.points.geometry.attributes.position.needsUpdate = true;
    particles.points.rotation.x += 0.0001;
    particles.points.rotation.y += 0.0002;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  // Update mobile state
  isMobile = width < 768;
}

// Scroll reveal animation
function observeScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// Smooth scroll for navigation
function smoothScroll() {
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
}

// Mouse parallax effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;

  // Apply parallax to particles
  if (particles.points && !isMobile) {
    particles.points.rotation.x = mouseY * 0.5;
    particles.points.rotation.y = mouseX * 0.5;
  }
});

// 3D card interaction
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isMobile) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// CTA button interactions
function initCTAButtons() {
  const buttons = document.querySelectorAll('.shimmer-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.position = 'absolute';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.background = 'rgba(37, 99, 235, 0.5)';
      ripple.style.borderRadius = '50%';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.pointerEvents = 'none';

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Add ripple animation keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize everything
window.addEventListener('load', () => {
  initThreeJS();
  observeScrollReveal();
  smoothScroll();
  init3DCards();
  initCTAButtons();
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    renderer.setAnimationLoop(null);
  } else {
    animate();
  }
});
