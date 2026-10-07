// --- 1. DOOR KNOCK LOGIC ---
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

  knockBtn.style.transform = 'scale(0.85)';
  setTimeout(() => {
    knockBtn.style.transform = 'scale(1)';
  }, 120);

  if (knockCount === maxKnocks) {
    knockCountText.textContent = 'Welcome in...';
    setTimeout(() => {
      door.classList.add('open');
    }, 400);

    setTimeout(() => {
      screenIntro.classList.remove('active');
      screenGallery.classList.add('active');
      initScratchCard(); // Gallery open hone par scratch load karega
    }, 1600);
  }
});

// --- 2. SCRATCH CARD LOGIC ---
function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  const nextBtn = document.getElementById('nextRoomBtn');
  let isScratching = false;

  // Golden Cover Layer
  ctx.fillStyle = '#e2b380';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cover Text
  ctx.fillStyle = '#7a4b18';
  ctx.font = 'bold 16px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Scratch to reveal ✨', canvas.width / 2, canvas.height / 2);

  function scratch(e) {
    if (!isScratching) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  }

  // Calculate kitna scratch ho chuka hai
  let revealed = false;
  function checkScratchPercentage() {
    if (revealed) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    // 40% se zyada scratch hone par poora clear ho jaye aur button show ho
    if (percent > 40) {
      revealed = true;
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
        nextBtn.style.display = 'inline-block';
      }, 600);
    }
  }

  // Events for Touch (Tablet/Phone) & Mouse
  canvas.addEventListener('mousedown', () => isScratching = true);
  canvas.addEventListener('mouseup', () => isScratching = false);
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    scratch(e);
  });
  canvas.addEventListener('touchend', () => isScratching = false);
  canvas.addEventListener('touchmove', scratch);
}
