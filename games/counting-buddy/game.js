// Counting Buddy game - count the treats!
const params = new URLSearchParams(location.search);
const buddyId = params.get('buddy') || 'pip';
const buddy = BUDDIES.find(b => b.id === buddyId) || BUDDIES[0];

let target = 0, clicked = 0, score = 0, level = 0;
const cvs = document.getElementById('cv');
const ctx = cvs.getContext('2d');
const promptEl = document.getElementById('prompt');
const toast = document.getElementById('toast');
const prog = document.getElementById('prog');

function drawBuddySimple(happy=false) {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  const cx = cvs.width / 2, cy = cvs.height / 2;
  const color = buddy.color, accent = buddy.accent;

  // Body
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy - 15, 35, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.stroke();

  // Ears
  const earY = cy - 40;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(cx - 45, earY, 18, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 45, earY, 18, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = accent; ctx.stroke();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx - 12, cy - 18, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 12, cy - 18, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(cx - 12, cy - 18, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 12, cy - 18, 4, 0, Math.PI * 2); ctx.fill();

  // Hat
  ctx.fillStyle = buddy.hat;
  ctx.beginPath(); ctx.moveTo(cx - 35, cy - 55); ctx.lineTo(cx + 35, cy - 55);
  ctx.lineTo(cx + 32, cy - 75); ctx.lineTo(cx - 32, cy - 75); ctx.closePath(); ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(cx, cy - 75, 5, 0, Math.PI * 2); ctx.fill();

  // Mouth
  ctx.strokeStyle = accent; ctx.lineWidth = 3;
  ctx.beginPath();
  if (happy) ctx.arc(cx, cy - 5, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  else ctx.arc(cx, cy - 5, 10, Math.PI * 2, 0);
  ctx.stroke();

  // Cheeks
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.beginPath(); ctx.arc(cx - 25, cy + 10, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 25, cy + 10, 5, 0, Math.PI * 2); ctx.fill();
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1000);
}

function startLevel() {
  level++;
  target = Math.floor(Math.random() * 5) + 1;
  clicked = 0;
  prog.style.width = Math.min(100, level * 10) + '%';
  promptEl.textContent = `Pip needs ${target} treat${target !== 1 ? 's' : ''}!`;
  drawBuddySimple();
  makeTreats();
}

function makeTreats() {
  const container = document.getElementById('treats');
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const btn = document.createElement('button');
    btn.textContent = '🍭';
    btn.className = 'treat-btn';
    btn.dataset.index = i;
    btn.style.fontSize = '28px';
    btn.style.padding = '10px 12px';
    btn.style.background = '#fff';
    btn.style.border = '2px solid #3a3a55';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.margin = '4px';
    btn.style.boxShadow = '0 2px 0 rgba(0,0,0,.1)';
    btn.style.transition = 'transform .1s, background .2s';
    btn.style.touchAction = 'manipulation';
    btn.onmousedown = () => btn.style.transform = 'scale(.9)';
    btn.onmouseup = () => btn.style.transform = 'scale(1)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    btn.onclick = (e) => {
      e.preventDefault();
      if (btn.disabled) return;
      btn.disabled = true;
      btn.style.background = '#ffd966';
      clicked++;
      drawBuddySimple(clicked >= target);
      if (clicked === target) {
        setTimeout(() => {
          score++;
          document.getElementById('score').textContent = score;
          showToast('Yay! Correct! 🎉');
          cvs.classList.add('bounce');
          setTimeout(() => { cvs.classList.remove('bounce'); startLevel(); }, 600);
        }, 300);
      } else if (clicked > target) {
        showToast(`Too many! Pip needed ${target}`);
        setTimeout(startLevel, 1200);
      }
    };
    container.appendChild(btn);
  }
}

document.addEventListener('keydown', e => {
  if (e.key === ' ') {
    const btn = document.querySelector('.treat-btn:not(:disabled)');
    if (btn) btn.click();
  }
});

startLevel();