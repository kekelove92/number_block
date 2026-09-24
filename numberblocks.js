/**
 * Numberblocks Magic Lab - Character Definitions and NumberBlock Entity
 * Visual layout, animations, accessories, and behavior for numbers 1-10.
 */

const NUMBER_CONFIGS = {
  1: {
    name: 'One',
    color: '#ff3344',
    cols: 1,
    rows: 1,
    speech: 'I am One! Whole and handsome One!',
    hasGlasses: false,
    accessories: [],
    customEyes: 'big-eye',
    mouthColor: '#ff5252'
  },
  2: {
    name: 'Two',
    color: '#ff8811',
    cols: 1,
    rows: 2,
    speech: 'Two! One and another one makes Two!',
    hasGlasses: true,
    accessories: ['glasses'],
    customEyes: 'normal',
    mouthColor: '#ff5252'
  },
  3: {
    name: 'Three',
    color: '#ffcc00',
    cols: 1,
    rows: 3,
    speech: 'Look at me, I am Three! Ta-da!',
    hasGlasses: false,
    accessories: ['juggling-balls'],
    customEyes: 'normal',
    mouthColor: '#e65100'
  },
  4: {
    name: 'Four',
    color: '#22cc55',
    cols: 2,
    rows: 2,
    speech: 'I am Four! I love being a square!',
    hasGlasses: false,
    accessories: ['eyebrows-four'],
    customEyes: 'normal',
    mouthColor: '#1b5e20'
  },
  5: {
    name: 'Five',
    color: '#0099ff',
    cols: 1,
    rows: 5,
    speech: 'High Five! Five alive!',
    hasGlasses: false,
    accessories: ['five-star'],
    customEyes: 'normal',
    mouthColor: '#0d47a1'
  },
  6: {
    name: 'Six',
    color: '#7733cc',
    cols: 2,
    rows: 3,
    speech: 'Six in the mix! Roll the dice!',
    hasGlasses: false,
    accessories: [],
    customEyes: 'normal',
    mouthColor: '#4a148c'
  },
  7: {
    name: 'Seven',
    color: '#ff2277',
    cols: 1,
    rows: 7,
    speech: 'Lucky Seven! Rainbow colours shining bright!',
    hasGlasses: false,
    accessories: [],
    customEyes: 'normal',
    isRainbow: true,
    mouthColor: '#880e4f'
  },
  8: {
    name: 'Eight',
    color: '#ee2288',
    cols: 2,
    rows: 4,
    speech: 'Octoblock to the rescue! Eight tentacles ready!',
    hasGlasses: false,
    accessories: ['octo-mask'],
    customEyes: 'normal',
    mouthColor: '#311b92'
  },
  9: {
    name: 'Nine',
    color: '#88bbdd',
    cols: 3,
    rows: 3,
    speech: 'Nine! Three times three square!',
    hasGlasses: false,
    accessories: [],
    customEyes: 'normal',
    mouthColor: '#37474f'
  },
  10: {
    name: 'Ten',
    color: '#ffffff',
    cols: 2,
    rows: 5,
    speech: 'Ten! A wonderful Ten! Two fives together!',
    hasGlasses: false,
    accessories: ['ten-star'],
    customEyes: 'normal',
    isTen: true,
    mouthColor: '#b71c1c'
  }
};

const RAINBOW_COLORS = [
  '#ff2244', '#ff8811', '#ffdd00', '#22cc55', '#0099ff', '#5533cc', '#aa22aa'
];

let globalBlockCounter = 0;

class NumberBlock {
  constructor(value, x, y, container) {
    this.value = Math.max(1, Math.min(10, Math.round(value)));
    this.x = x;
    this.y = y;
    this.container = container;
    this.id = 'nb_' + (++globalBlockCounter) + '_' + Date.now();
    this.element = null;
    this.cubes = [];
    this.isCounting = false;
    this.isDragging = false;
    this.config = NUMBER_CONFIGS[this.value] || NUMBER_CONFIGS[1];

    this.render();
    this.updatePosition();
  }

  render() {
    const el = document.createElement('div');
    el.className = 'numberblock';
    el.id = this.id;
    el.dataset.value = this.value;

    // Number Badge on top
    const badge = document.createElement('div');
    badge.className = 'number-badge';
    badge.textContent = this.value;
    badge.style.borderColor = this.config.color === '#ffffff' ? '#ff3344' : this.config.color;
    el.appendChild(badge);

    // Cubes Grid
    const grid = document.createElement('div');
    grid.className = 'cubes-grid';
    grid.style.gridTemplateColumns = 'repeat(' + this.config.cols + ', var(--cube-size))';
    grid.style.gridTemplateRows = 'repeat(' + this.config.rows + ', var(--cube-size))';

    this.cubes = [];
    for (let i = 0; i < this.value; i++) {
      const cube = document.createElement('div');
      cube.className = 'cube';
      cube.dataset.index = i;

      let cubeColor = this.config.color;
      if (this.config.isRainbow) {
        cubeColor = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
      } else if (this.config.isTen) {
        cubeColor = '#ffffff';
        cube.style.border = '2px solid #ff3344';
      }
      cube.style.setProperty('--cube-color', cubeColor);

      // Dot for counting
      const dot = document.createElement('div');
      dot.className = 'cube-dot';
      cube.appendChild(dot);

      grid.appendChild(cube);
      this.cubes.push(cube);
    }
    el.appendChild(grid);

    // Face overlay (positioned over the top area)
    const face = document.createElement('div');
    face.className = 'face-container';
    face.style.height = 'var(--cube-size)';
    face.style.top = '0px';

    // Character Accessories
    if (this.config.accessories.includes('glasses')) {
      const glasses = document.createElement('div');
      glasses.className = 'two-glasses';
      face.appendChild(glasses);
    }
    if (this.config.accessories.includes('eyebrows-four')) {
      const brows = document.createElement('div');
      brows.className = 'eyebrows-four';
      brows.innerHTML = '<div class="eyebrow"></div><div class="eyebrow"></div>';
      face.appendChild(brows);
    }
    if (this.config.accessories.includes('five-star')) {
      const star = document.createElement('div');
      star.className = 'five-star';
      star.textContent = '⭐';
      face.appendChild(star);
    }
    if (this.config.accessories.includes('octo-mask')) {
      const mask = document.createElement('div');
      mask.className = 'octo-mask';
      face.appendChild(mask);
    }
    if (this.config.accessories.includes('ten-star')) {
      const star = document.createElement('div');
      star.className = 'ten-star';
      star.textContent = '👑';
      face.appendChild(star);
    }

    // Eyes Row
    const eyesRow = document.createElement('div');
    eyesRow.className = 'eyes-row';

    if (this.config.customEyes === 'big-eye') {
      const eye = document.createElement('div');
      eye.className = 'eye big-eye';
      const pupil = document.createElement('div');
      pupil.className = 'pupil';
      eye.appendChild(pupil);
      eyesRow.appendChild(eye);
    } else {
      for (let e = 0; e < 2; e++) {
        const eye = document.createElement('div');
        eye.className = 'eye';
        const pupil = document.createElement('div');
        pupil.className = 'pupil';
        eye.appendChild(pupil);
        eyesRow.appendChild(eye);
      }
    }
    face.appendChild(eyesRow);

    // Mouth
    const mouth = document.createElement('div');
    mouth.className = 'mouth';
    mouth.style.background = this.config.mouthColor || '#ff5252';
    face.appendChild(mouth);

    // Juggling balls for Three
    if (this.config.accessories.includes('juggling-balls')) {
      const balls = document.createElement('div');
      balls.className = 'juggling-balls';
      balls.innerHTML =
        '<div class="juggling-ball" style="background: #ff3344;"></div>' +
        '<div class="juggling-ball" style="background: #0099ff;"></div>' +
        '<div class="juggling-ball" style="background: #22cc55;"></div>';
      face.appendChild(balls);
    }

    el.appendChild(face);

    // Explicitly anchor block position in DOM coordinates before appending
    el.style.left = Math.round(this.x) + 'px';
    el.style.top = Math.round(this.y) + 'px';
    el.style.transform = 'translate3d(0, 0, 0)';

    this.container.appendChild(el);
    this.element = el;
    this.mouthEl = mouth;
    this.faceEl = face;
  }

  updatePosition() {
    if (!this.element) return;
    this.element.style.left = Math.round(this.x) + 'px';
    this.element.style.top = Math.round(this.y) + 'px';
    const scale = this.isDragging ? ' scale(1.06)' : '';
    this.element.style.transform = 'translate3d(0, 0, 0)' + scale;
  }

  getBounds() {
    if (!this.element) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    return this.element.getBoundingClientRect();
  }

  getCenter() {
    const b = this.getBounds();
    return {
      x: b.left + b.width / 2,
      y: b.top + b.height / 2
    };
  }

  speak(text, onComplete) {
    if (!text) text = this.config.speech;
    if (this.mouthEl) this.mouthEl.classList.add('open-talk');

    window.audioEngine.speak(text, () => {
      if (this.mouthEl) this.mouthEl.classList.remove('open-talk');
      if (onComplete) onComplete();
    });
  }

  countCubes(onComplete) {
    if (this.isCounting) return;
    this.isCounting = true;

    let index = 0;
    const countStep = () => {
      if (index >= this.cubes.length) {
        setTimeout(() => {
          this.cubes.forEach(c => c.classList.remove('cube-counted'));
          this.speak(this.config.speech, () => {
            this.isCounting = false;
            if (onComplete) onComplete();
          });
        }, 250);
        return;
      }

      const cube = this.cubes[index];
      cube.classList.add('cube-counted');
      const currentNumber = index + 1;

      window.audioEngine.playNumberChime(currentNumber);
      window.audioEngine.speakNumber(currentNumber, () => {
        index++;
        setTimeout(countStep, 100);
      });
    };

    countStep();
  }

  split() {
    if (this.value <= 1) {
      this.speak('One is already as small as can be!');
      return null;
    }

    const half = Math.floor(this.value / 2);
    const remainder = this.value - half;
    return [half, remainder];
  }

  playMergeAnimation(callback) {
    if (!this.element) return;
    this.element.classList.add('is-merging');
    setTimeout(() => {
      if (this.element) this.element.classList.remove('is-merging');
      if (callback) callback();
    }, 400);
  }

  destroy(immediate = false) {
    if (!this.element) return;
    if (immediate) {
      this.element.remove();
      this.element = null;
    } else {
      this.element.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      this.element.style.transform = 'translate3d(0, 0, 0) scale(0)';
      this.element.style.opacity = '0';
      setTimeout(() => {
        if (this.element) {
          this.element.remove();
          this.element = null;
        }
      }, 260);
    }
  }
}

window.NumberBlock = NumberBlock;
window.NUMBER_CONFIGS = NUMBER_CONFIGS;
