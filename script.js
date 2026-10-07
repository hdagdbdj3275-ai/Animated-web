// --- 1. DOOR KNOCK LOGIC ---
let knockCount = 0;
const maxKnocks = 3;

const knockBtn = document.getElementById('knockBtn');
const knockCountText = document.getElementById('knockCountText');
const door = document.getElementById('door');
const screenIntro = document.getElementById('screen-intro');
const screenGallery = document.getElementById('screen-gallery');

if (knockBtn) {
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
        if (door) door.classList.add('open');
      }, 400);

      setTimeout(() => {
        screenIntro.classList.remove('active');
        screenGallery.classList.add('active');
        setupScratchCard();
      }, 1500);
    }
  });
}

// Agar direct screen test ho rahi ho
if (screenGallery && screenGallery.classList.contains('active')) {
  setupScratchCard();
}

// --- 2. MOBILE TOUCH SCRATCH CARD ---
function setupScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  const wrapper = document.querySelector('.scratch-card-wrapper');
  const nextBtn = document.getElementById('nextRoomBtn');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');

  // Device pixel ratio aur exact card size match karna
  const rect = wrapper.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Golden Cover Layer
  ctx.fillStyle = '#d4a373';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cover Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Scratch here ✨', canvas.width / 2, canvas.height / 2);

  let isDrawing = false;
  let revealed = false;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - r.left,
      y: touch.clientY - r.top
    };
  }

  function startScratch(e) {
    isDrawing = true;
    scratch(e);
  }

  function stopScratch() {
    isDrawing = false;
    checkProgress();
  }

  function scratch(e) {
    if (!isDrawing || revealed) return;
    if (e.cancelable) e.preventDefault(); // Screen scrolling rokna touch ke waqt

    const pos = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkProgress() {
    if (revealed) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percent = (transparent / (pixels.length / 4)) * 100;
    if (percent > 35) {
      revealed = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'inline-block';
      }, 500);
    }
  }

  // Touch Events (Tablet ke liye zaroori)
  canvas.addEventListener('touchstart', startScratch, { passive: false });
  canvas.addEventListener('touchmove', scratch, { passive: false });
  canvas.addEventListener('touchend', stopScratch);

  // Mouse Events
  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('mouseup', stopScratch);
}
