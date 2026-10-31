// Color Factory game - sort colored blobs into matching bins
const colors = { red:'rgba(255,107,107,1)', blue:'rgba(91,193,255,1)', yellow:'rgba(255,217,102,1)', green:'rgba(127,227,176,1)' };
const colorNames = ['red','blue','yellow','green'];

let blobs = [], score = 0, level = 0, gameRunning = true;

const cvs = document.getElementById('cv');
const ctx = cvs.getContext('2d');
const promptEl = document.getElementById('prompt');
const toast = document.getElementById('toast');
const progress = document.getElementById('prog');

const buddyId = new URLSearchParams(location.search).get('buddy') || 'pip';
const buddy = BUDDIES.find(b => b.id === buddyId) || BUDDIES[0];

function drawBin(x, color, label) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 10, 180, 50, 100, 8);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 10, 180, 50, 100, 8);
  ctx.fillStyle = color;
  ctx.fillRect(x, 160, 70, 24, 8);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawBuddyAtBottom() {
  drawBuddy(ctx, buddy, 'happy', 0);
}

function newBlob(colorName) {
  return {
    x: 30 + Math.random() * 260,
    y: 30,
    r: 14,
    color: colors[colorName],
    name: colorName,
    falling: true,
    vx: (Math.random() - 0.5) * 2,
    vy: 2.5 + Math.random() * 1.5
  };
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1000);
}

function gameLoop() {
  if (!gameRunning) return;
  progress.style.width = Math.min(100, level * 8) + '%';

  ctx.clearRect(0, 0, cvs.width, cvs.height);

  colorNames.forEach((name, i) => drawBin(20 + i * 75, colors[name], name));
  drawBuddyAtBottom();

  blobs.forEach(b => {
    b.y += b.vy;
    b.x += b.vx;
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (b.y + b.r > 180 && b.falling) {
      const binIdx = Math.floor((b.x - 20) / 75);
      if (binIdx >= 0 && binIdx < 4) {
        const binColor = colorNames[binIdx];
        if (b.name === binColor) {
          score++;
          document.getElementById('score').textContent = score;
          showToast('Correct! 🎉');
          cvs.classList.add('bounce');
          setTimeout(() => cvs.classList.remove('bounce'), 300);
          if (score >= level) {
            level++;
            setTimeout(startLevel, 800);
          }
        } else {
          showToast(`That's the ${binColor} bin!`);
        }
        b.falling = false;
      } else {
        b.y -= 20;
      }
    }
  });

  blobs = blobs.filter(b => b.falling || b.y < 180);

  if (blobs.length === 0) {
    const color = colorNames[Math.floor(Math.random() * 4)];
    blobs.push(newBlob(color));
    promptEl.textContent = `Find the ${color} bin!`;
  }

  requestAnimationFrame(gameLoop);
}

function startLevel() {
  blobs = [];
  score = 0;
  document.getElementById('score').textContent = score;
  promptEl.textContent = 'Sort the colors!';
}

const binsContainer = document.getElementById('bins');
binsContainer.innerHTML = '';
colorNames.forEach((name, i) => {
  const bin = document.createElement('div');
  bin.className = 'bin';
  bin.dataset.color = name;
  bin.style.cssText = `
    width: 50px; height: 50px; border-radius: 50%; margin: 2px;
    cursor: pointer; border: 3px solid ${colors[name]}; background: #fff;
    display: flex; align-items: center; justify-content: center;
  `;
  bin.innerHTML = `<span style="font-size: 20px;">${name === 'red' ? '🔴' :
    name === 'blue' ? '🔵' :
    name === 'yellow' ? '🟡' : '🟢'}</span>`;
  bin.onclick = () => {
    blobs.forEach(b => {
      if (b.name === name && b.falling) {
        const idx = colorNames.indexOf(name);
        b.x = 20 + idx * 75 + 25;
        b.y = 170;
        b.falling = false;
        b.vx = 0;
        b.vy = 0;
        showToast('Great sorting! ✨');
      }
    });
  };
  binsContainer.appendChild(bin);
});

startLevel();
gameLoop();