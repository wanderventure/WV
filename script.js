window.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-track .testimonial-card');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (!track || !slides || slides.length === 0) return;

  const slideArray = Array.from(slides);

  let index = 0;

  function goToSlide(i) {
    index = (i + slideArray.length) % slideArray.length; // wrap
    const slideWidth = track.parentElement.offsetWidth; // visible width (wrapper)
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  prevBtn?.addEventListener('click', () => goToSlide(index - 1));
  nextBtn?.addEventListener('click', () => goToSlide(index + 1));

  // Auto-slide every 5s
  setInterval(() => goToSlide(index + 1), 5000);

  // Recalculate on window resize (mobile rotation etc.)
  window.addEventListener('resize', () => goToSlide(index));

  // Init
  goToSlide(0);
});
