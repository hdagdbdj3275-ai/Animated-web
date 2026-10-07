// --- 1. DOOR KNOCK ---
let knockCount = 0;
const maxKnocks = 3;

const knockBtn = document.getElementById('knockBtn');
const knockCountText = document.getElementById('knockCountText');
const door = document.getElementById('door');
const screenIntro = document.getElementById('screen-intro');
const screenGallery = document.getElementById('screen-gallery');
const screenPuzzle = document.getElementById('screen-puzzle');
const screenLetter = document.getElementById('screen-letter');

const nextRoomBtn = document.getElementById('nextRoomBtn');
const puzzleNextBtn = document.getElementById('puzzleNextBtn');

if (knockBtn) {
  knockBtn.addEventListener('click', () => {
    if (knockCount >= maxKnocks) return;
    knockCount++;
    knockCountText.textContent = `Knocks: ${knockCount} / ${maxKnocks}`;
    knockBtn.style.transform = 'scale(0.85)';
    setTimeout(() => { knockBtn.style.transform = 'scale(1)'; }, 120);

    if (knockCount === maxKnocks) {
      knockCountText.textContent = 'Welcome in...';
      setTimeout(() => { if (door) door.classList.add('open'); }, 400);
      setTimeout(() => {
        screenIntro.classList.remove('active');
        screenGallery.classList.add('active');
        setupScratchCard();
      }, 1500);
    }
  });
}

// Gallery -> Puzzle
if (nextRoomBtn) {
  nextRoomBtn.addEventListener('click', () => {
    screenGallery.classList.remove('active');
    screenPuzzle.classList.add('active');
    initPuzzle();
  });
}

// Puzzle -> Letter Room
if (puzzleNextBtn) {
  puzzleNextBtn.addEventListener('click', () => {
    screenPuzzle.classList.remove('active');
    screenLetter.classList.add('active');
  });
}

// --- 2. SCRATCH CARD ---
function setupScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  const wrapper = document.querySelector('.scratch-card-wrapper');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  const rect = wrapper.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.fillStyle = '#d4a373';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Scratch here ✨', canvas.width / 2, canvas.height / 2);

  let isDrawing = false;
  let revealed = false;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - r.left, y: touch.clientY - r.top };
  }

  function start(e) { isDrawing = true; draw(e); }
  function stop() { isDrawing = false; check(); }

  function draw(e) {
    if (!isDrawing || revealed) return;
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  function check() {
    if (revealed) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = imgData.data;
    let trans = 0;
    for (let i = 3; i < px.length; i += 4) {
      if (px[i] === 0) trans++;
    }
    if ((trans / (px.length / 4)) * 100 > 35) {
      revealed = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
        if (nextRoomBtn) nextRoomBtn.style.display = 'inline-block';
      }, 500);
    }
  }

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stop);
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stop);
}

// --- 3. 9-PIECE PUZZLE ---
const puzzleImgUrl = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop";
let currentOrder = [1, 4, 7, 0, 8, 2, 5, 3, 6];
const winningOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let selectedIndex = null;

function initPuzzle() {
  const board = document.getElementById('puzzleBoard');
  board.innerHTML = '';

  currentOrder.forEach((pieceIdx, displayIdx) => {
    const piece = document.createElement('div');
    piece.classList.add('puzzle-piece');
    piece.dataset.index = displayIdx;

    const row = Math.floor(pieceIdx / 3);
    const col = pieceIdx % 3;
    piece.style.backgroundImage = `url(${puzzleImgUrl})`;
    piece.style.backgroundPosition = `-${col * 92}px -${row * 92}px`;

    piece.addEventListener('click', () => handlePieceClick(displayIdx));
    board.appendChild(piece);
  });
}

function handlePieceClick(clickedIdx) {
  const pieces = document.querySelectorAll('.puzzle-piece');
  if (selectedIndex === null) {
    selectedIndex = clickedIdx;
    pieces[clickedIdx].classList.add('selected');
  } else {
    if (selectedIndex === clickedIdx) {
      pieces[clickedIdx].classList.remove('selected');
      selectedIndex = null;
      return;
    }
    const temp = currentOrder[selectedIndex];
    currentOrder[selectedIndex] = currentOrder[clickedIdx];
    currentOrder[clickedIdx] = temp;
    selectedIndex = null;
    initPuzzle();
    checkPuzzleWin();
  }
}

function checkPuzzleWin() {
  const isWon = currentOrder.every((val, idx) => val === winningOrder[idx]);
  if (isWon) {
    document.getElementById('puzzleDoneBox').style.display = 'block';
  }
}

// --- 4. ENVELOPE & AUDIO PLAYER LOGIC ---
const envelopeWrapper = document.getElementById('envelopeWrapper');
const letterPaper = document.getElementById('letterPaper');
const voicePlayBtn = document.getElementById('voicePlayBtn');
const voiceAudio = document.getElementById('voiceAudio');
const voiceTime = document.getElementById('voiceTime');

// Envelope Tap to Reveal Letter
if (envelopeWrapper) {
  envelopeWrapper.addEventListener('click', () => {
    envelopeWrapper.style.display = 'none';
    letterPaper.style.display = 'block';
  });
}

// Audio Play/Pause
if (voicePlayBtn && voiceAudio) {
  voicePlayBtn.addEventListener('click', () => {
    if (voiceAudio.paused) {
      voiceAudio.play();
      voicePlayBtn.textContent = '⏸';
    } else {
      voiceAudio.pause();
      voicePlayBtn.textContent = '▶';
    }
  });

  voiceAudio.addEventListener('timeupdate', () => {
    const cur = Math.floor(voiceAudio.currentTime);
    const dur = Math.floor(voiceAudio.duration) || 15;
    voiceTime.textContent = `0:${cur < 10 ? '0' : ''}${cur} / 0:${dur < 10 ? '0' : ''}${dur}`;
  });

  voiceAudio.addEventListener('ended', () => {
    voicePlayBtn.textContent = '▶';
  });
}
