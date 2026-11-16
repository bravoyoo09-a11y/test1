// 도형 모양 (참고 펜에서 꽃 하나를 그려두고 재사용한 방식과 같습니다)
const SHAPES = {
  circle: '<circle r="12"/>',
  half:   '<path d="M-13 3 A13 13 0 0 1 13 3 Z"/>',
  tri:    '<path d="M0 -13 L12 9 L-12 9 Z"/>',
  square: '<rect x="-10" y="-10" width="20" height="20" transform="rotate(12)"/>',
  ring:   '<circle class="ring" r="10"/>',
  bar:    '<rect x="-3.5" y="-14" width="7" height="28" rx="3.5"/>',
};
const SHAPE_NAMES = Object.keys(SHAPES);
const COLORS = ['var(--cobalt)', 'var(--sun)', 'var(--pink)', 'var(--mint)'];

const COUNT = 64;      // 들판의 도형 개수
const MOTE_COUNT = 16; // 떠다니는 점 개수

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const svg = (shape) =>
  `<svg viewBox="-16 -16 32 32" aria-hidden="true">${SHAPES[shape]}</svg>`;

const field = document.querySelector('.field');
const motes = document.querySelector('.motes');

function plantField() {
  const frag = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    // depth: 0 = 맨 앞(크고 아래), 1 = 맨 뒤(작고 위)
    const depth = Math.random();
    const near = 1 - depth;

    const el = document.createElement('div');
    el.className = 'sprout';
    el.style.cssText = `
      --x: ${rand(-2, 102).toFixed(2)}%;
      --y: ${(depth * 30).toFixed(2)}%;
      --z: ${Math.round(near * 100)};
      --h: ${(rand(55, 140) * (0.55 + near * 0.75)).toFixed(1)}px;
      --s: ${(rand(18, 34) * (0.55 + near * 0.6)).toFixed(1)}px;
      --c: ${pick(COLORS)};
      --tilt: ${rand(-9, 9).toFixed(1)}deg;
      --swing: ${rand(2, 5).toFixed(1)}deg;
      --sway: ${rand(3, 6).toFixed(1)}s;
      --delay: ${(rand(0, 1.1) + depth * 0.4).toFixed(2)}s;
    `;
    el.innerHTML = `<i class="stem"></i>${svg(pick(SHAPE_NAMES)).replace('<svg', '<svg class="head"')}`;
    frag.appendChild(el);
  }

  field.replaceChildren(frag);
}

function releaseMotes() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < MOTE_COUNT; i++) {
    const m = document.createElement('i');
    m.className = 'mote';
    m.style.cssText = `
      --x: ${rand(0, 100).toFixed(2)}%;
      --y: ${rand(8, 40).toFixed(2)}%;
      --r: ${rand(3, 7).toFixed(1)}px;
      --c: ${pick(COLORS)};
      --d: ${rand(9, 18).toFixed(1)}s;
      --delay: ${rand(-18, 0).toFixed(1)}s;
      --dx: ${rand(-60, 60).toFixed(0)}px;
    `;
    frag.appendChild(m);
  }
  motes.replaceChildren(frag);
}

// 작업물 목록 왼쪽의 작은 도형
document.querySelectorAll('.project').forEach((item, i) => {
  const shape = SHAPES[item.dataset.shape] ? item.dataset.shape : SHAPE_NAMES[i % SHAPE_NAMES.length];
  const glyph = item.querySelector('.glyph');
  glyph.innerHTML = svg(shape);
  glyph.style.color = COLORS[i % COLORS.length];
  glyph.querySelectorAll('*').forEach((n) => {
    if (n.classList.contains('ring')) {
      n.setAttribute('fill', 'none');
      n.setAttribute('stroke', 'currentColor');
      n.setAttribute('stroke-width', '4');
    } else if (n.tagName !== 'svg') {
      n.setAttribute('fill', 'currentColor');
    }
  });
});

// 스크롤하면 상단 바에 배경 넣기
const topBar = document.querySelector('.top');
const scene = document.querySelector('.scene');
const onScroll = () => {
  topBar.classList.toggle('is-scrolled', window.scrollY > scene.offsetHeight - 80);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.getElementById('reshuffle').addEventListener('click', plantField);
document.getElementById('year').textContent = new Date().getFullYear();

plantField();
releaseMotes();
