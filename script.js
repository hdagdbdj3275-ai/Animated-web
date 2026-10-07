let knockCount = 0;
const maxKnocks = 3;

const knockBtn = document.getElementById('knockBtn');
const knockCountText = document.getElementById('knockCountText');
const door = document.getElementById('door');
const screenIntro = document.getElementById('screen-intro');
const screenGallery = document.getElementById('screen-gallery');

knockBtn.addEventListener('click', () => {
  if (knockCount >= maxKnocks) return;

  knockCount++;
  knockCountText.textContent = `Knocks: ${knockCount} / ${maxKnocks}`;

  // Knocking vibration animation
  knockBtn.style.transform = 'scale(0.85)';
  setTimeout(() => {
    knockBtn.style.transform = 'scale(1)';
  }, 120);

  if (knockCount === maxKnocks) {
    knockCountText.textContent = 'Welcome in...';
    
    // Door khulne ka animation
    setTimeout(() => {
      door.classList.add('open');
    }, 400);

    // Screen change to Gallery
    setTimeout(() => {
      screenIntro.classList.remove('active');
      screenGallery.classList.add('active');
    }, 1800);
  }
});
