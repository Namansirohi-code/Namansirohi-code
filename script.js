const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Update these two URLs before publishing. Empty placeholders are intentionally not linked.
const LINKS = {
  linkedin: 'https://www.linkedin.com/in/namansirohi',
  github: 'https://github.com/Namansirohi-code'
};
const linkedinLink = document.getElementById('linkedin-link');
const githubLink = document.getElementById('github-link');
function configureProfileLink(element, url) {
  if (!element) return;
  if (url && /^https:\/\/(www\.)?(linkedin\.com|github\.com)\//i.test(url)) {
    element.href = url;
    element.target = '_blank';
    element.rel = 'noreferrer';
  } else {
    element.href = 'mailto:namansirohi610@gmail.com?subject=Portfolio%20profile%20link';
    element.addEventListener('click', (event) => {
      if (!url) {
        event.preventDefault();
        alert('Add your profile URL in script.js before publishing this portfolio.');
      }
    });
  }
}
configureProfileLink(linkedinLink, LINKS.linkedin);
configureProfileLink(githubLink, LINKS.github);

// Smoothly highlight the active section in the navigation.
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}
