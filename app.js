/**
 * Numberblocks Magic Lab - Main Application Logic
 * Manages playground interactions, drag-and-drop merge/split, quests, particle effects, and sound.
 */

document.addEventListener('DOMContentLoaded', () => {
  const playground = document.getElementById('playground');
  const blocksLayer = document.getElementById('blocks-layer');
  const fxCanvas = document.getElementById('fx-canvas');
  const trashZone = document.getElementById('trash-zone');
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.getElementById('speech-text');

  // Controls & Tools
  const toolDrag = document.getElementById('tool-drag');
  const toolSlice = document.getElementById('tool-slice');
  const toolCount = document.getElementById('tool-count');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const clearBoardBtn = document.getElementById('clear-board-btn');
  const floatingGuide = document.getElementById('floating-guide');
  const closeGuideBtn = document.getElementById('close-guide-btn');

  // Mission UI
  const missionPrompt = document.getElementById('mission-prompt');
  const missionCard = document.getElementById('mission-card');
  const nextMissionBtn = document.getElementById('next-mission-btn');
  const questTargetCube = document.getElementById('quest-target-cube');
  const questTargetNum = document.getElementById('quest-target-num');
  const speakMissionBtn = document.getElementById('speak-mission-btn');
  const spawnButtons = document.querySelectorAll('.spawn-btn');

  // Lesson Mode Elements
  const openLessonsBtn = document.getElementById('open-lessons-btn');
  const lessonStarBadge = document.getElementById('lesson-star-badge');
  const lessonBanner = document.getElementById('lesson-banner');
  const currentLessonNum = document.getElementById('current-lesson-num');
  const currentLessonTitle = document.getElementById('current-lesson-title');
  const currentLessonPrompt = document.getElementById('current-lesson-prompt');
  const lessonTaskStatus = document.getElementById('lesson-task-status');
  const exitLessonBtn = document.getElementById('exit-lesson-btn');
  const lessonModal = document.getElementById('lesson-modal');
  const closeLessonsModalBtn = document.getElementById('close-lessons-modal-btn');
  const modalTotalStars = document.getElementById('modal-total-stars');
  const lessonsGrid = document.getElementById('lessons-grid');
  const lessonVictoryModal = document.getElementById('lesson-victory-modal');
  const victoryLessonTitle = document.getElementById('victory-lesson-title');
  const victoryMessage = document.getElementById('victory-message');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const replayLessonBtn = document.getElementById('replay-lesson-btn');

  // State
  const blocks = [];
  let currentTool = 'drag'; // 'drag', 'slice', 'count'
  let missionIndex = 0;
  let activeSpeechTimeout = null;

  // Active Lesson State
  let activeLesson = null;
  let lessonStepProgress = 0;
  let hoveredCandidate = null;

  const LESSONS = [
    {
      id: 1,
      title: 'Gặp Gỡ 1 Đến 5',
      color: '#ff3344',
      desc: 'Làm quen các bạn One, Two, Three, Four, Five.',
      prompt: 'Hãy gọi lần lượt bạn <strong>One, Two, Three, Four, Five</strong> ra sân chơi nhé!',
      type: 'spawn_set',
      required: [1, 2, 3, 4, 5],
      voiceIntro: 'Lesson One! Summon One, Two, Three, Four, and Five to the playground!',
      victoryMsg: 'Tuyệt vời! Bé đã làm quen đủ 5 người bạn đầu tiên!'
    },
    {
      id: 2,
      title: 'Những Người Bạn 6 Đến 10',
      color: '#7733cc',
      desc: 'Khám phá Xúc xắc 6, Cầu vồng 7, Octoblock 8, Vuông 9, Khung 10.',
      prompt: 'Bé hãy gọi bạn <strong>Six, Seven, Eight, Nine, Ten</strong> ra sân nào!',
      type: 'spawn_set',
      required: [6, 7, 8, 9, 10],
      voiceIntro: 'Lesson Two! Summon Six, Seven, Eight, Nine, and Ten!',
      victoryMsg: 'Hoan hô! Bé đã nhớ mặt cả 10 người bạn Numberblocks!'
    },
    {
      id: 3,
      title: 'Bậc Thang Cộng 1 (1 + 1 = 2)',
      color: '#ff8811',
      desc: 'Bậc thang số học (The Step Squad): thêm 1 bạn One để lên bậc kế tiếp.',
      prompt: 'Hãy gộp <strong>One (1) + One (1) = Two (2)</strong> để leo lên bậc thang đầu tiên!',
      type: 'merge_match',
      valA: 1, valB: 1, sum: 2,
      voiceIntro: 'Step Squad time! Drag One and One together to make Two!',
      victoryMsg: 'One + One = Two! Bé đã bước lên bậc thang đầu tiên!'
    },
    {
      id: 4,
      title: 'Cặp Đôi Bốn Vuông (2 + 2 = 4)',
      color: '#22cc55',
      desc: 'Double Trouble: 2 bạn Two đứng cạnh nhau biến thành Four hình vuông 2x2!',
      prompt: 'Gộp <strong>Two (2) + Two (2) = Four (4)</strong> để tạo ra bạn Four hình vuông!',
      type: 'merge_match',
      valA: 2, valB: 2, sum: 4,
      voiceIntro: 'Double Trouble! Two and Two makes Four, and I love being a square!',
      victoryMsg: '2 + 2 = 4! Four hình vuông 2x2 siêu đẹp xuất hiện!'
    },
    {
      id: 5,
      title: 'Bạn Thân Của 5 (2 + 3 = 5)',
      color: '#0099ff',
      desc: 'Cặp bạn thân của Five: Two và Three đập tay High Five!',
      prompt: 'Gộp <strong>Two (2) + Three (3) = Five (5)</strong> để đập tay High Five!',
      type: 'merge_match',
      valA: 2, valB: 3, sum: 5,
      voiceIntro: 'High Five! Merge Two and Three to make Five!',
      victoryMsg: 'High Five! 2 + 3 = 5, bạn Five bàn tay 5 ngón đây rồi!'
    },
    {
      id: 6,
      title: 'Cặp Đôi Sáu Xúc Xắc (3 + 3 = 6)',
      color: '#7733cc',
      desc: 'Double Trouble: 2 bạn Three đứng cạnh nhau biến thành Six xúc xắc 2x3!',
      prompt: 'Gộp <strong>Three (3) + Three (3) = Six (6)</strong> để tạo ra bạn Sáu xúc xắc!',
      type: 'merge_match',
      valA: 3, valB: 3, sum: 6,
      voiceIntro: 'Three and Three makes Six! Roll the dice!',
      victoryMsg: '3 + 3 = 6! Six in the mix, lăn xúc xắc thôi nào!'
    },
    {
      id: 7,
      title: 'Bạn Thân Của 10 (7 + 3 = 10)',
      color: '#ffffff',
      desc: 'Blast Off: Cặp đôi hoàn hảo 7 và 3 gộp lại thành Ten khung 10 ô!',
      prompt: 'Gộp <strong>Seven (7) + Three (3) = Ten (10)</strong> để phóng tên lửa Ten!',
      type: 'merge_match',
      valA: 7, valB: 3, sum: 10,
      voiceIntro: 'Blast Off! Add Seven and Three together to make Ten!',
      victoryMsg: '7 + 3 = 10! Siêu anh hùng Ten khung mười ô xuất sắc!'
    },
    {
      id: 8,
      title: 'Phép Trừ Bớt 1 (-1)',
      color: '#ff3344',
      desc: 'Bớt 1 là lùi 1 bậc thang: Cắt Four, kéo 1 khối vứt thùng rác để còn 3!',
      prompt: 'Dùng ✂️ cắt bạn <strong>Four</strong>, kéo 1 bạn vứt vào <strong>Thùng rác</strong> để còn 3!',
      type: 'trash_leave',
      targetVal: 3,
      voiceIntro: 'Subtraction! Split Four, then throw One into the trash to leave Three!',
      victoryMsg: '4 bớt 1 còn 3 (4 - 1 = 3)! Bé hiểu phép trừ thật nhanh!'
    },
    {
      id: 9,
      title: 'Tách Đôi Khối Hình (6 - 3 = 3)',
      color: '#ffcc00',
      desc: 'Phép trừ tách đôi: Cắt bạn Sáu (6) thành 2 bạn Ba (3).',
      prompt: 'Gọi bạn <strong>Six (6)</strong> rồi dùng ✂️ cắt đôi bạn ấy thành 2 bạn Three!',
      type: 'split_from',
      fromVal: 6,
      voiceIntro: 'Split Six in half! Six splits into Three and Three!',
      victoryMsg: '6 tách đôi thành 3 và 3 (6 - 3 = 3)! Quá xuất sắc!'
    },
    {
      id: 10,
      title: 'Đại Tiệc Cặp Đôi Mười (5 + 5 = 10)',
      color: '#ee2288',
      desc: 'Double Trouble Tốt nghiệp: Hai bạn Five gộp lại thành Ten!',
      prompt: 'Gộp <strong>Five (5) + Five (5) = Ten (10)</strong> để hoàn thành khóa học!',
      type: 'merge_match',
      valA: 5, valB: 5, sum: 10,
      voiceIntro: 'Grand Finale! Put Five and Five together to make Ten!',
      victoryMsg: 'Chúc mừng bé! 5 + 5 = 10! Bé đã là Bậc Thầy Toán Học Numberblocks!'
    }
  ];

  const MISSIONS = [
    { target: 3, prompt: 'Make number <strong>3</strong>!' },
    { target: 4, prompt: 'Can you build a <strong>4</strong> square?' },
    { target: 5, prompt: 'High Five! Make number <strong>5</strong>!' },
    { target: 7, prompt: 'Create lucky rainbow <strong>7</strong>!' },
    { target: 8, prompt: 'Summon superhero Octoblock <strong>8</strong>!' },
    { target: 10, prompt: 'Make a super <strong>10</strong> star!' },
    { target: 6, prompt: 'Make number <strong>6</strong> with dice!' },
    { target: 9, prompt: 'Can you form a 3x3 square of <strong>9</strong>?' }
  ];

  // ============================================================
  // PARTICLE SYSTEM (Canvas Confetti & Sparkles)
  // ============================================================
  const ctx = fxCanvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    fxCanvas.width = playground.clientWidth;
    fxCanvas.height = playground.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function spawnParticles(x, y, count = 25, colors = null) {
    const defaultColors = ['#ff3344', '#ff8811', '#ffcc00', '#22cc55', '#0099ff', '#aa33cc', '#ff77aa', '#ffffff'];
    const palette = colors || defaultColors;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 8 + 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        shape: Math.random() > 0.4 ? 'circle' : 'star',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  }

  function renderParticles() {
    ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravity
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'star') {
        // Draw 5-pointed star
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * p.size, -Math.sin((18 + s * 72) * Math.PI / 180) * p.size);
          ctx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * (p.size / 2), -Math.sin((54 + s * 72) * Math.PI / 180) * (p.size / 2));
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(renderParticles);
  }
  requestAnimationFrame(renderParticles);

  // ============================================================
  // SPEECH BUBBLE HELPER
  // ============================================================
  function showSpeechBubble(text, block) {
    if (!speechBubble || !block) return;
    speechText.textContent = text;
    speechBubble.classList.remove('hidden');

    const rect = block.getBounds();
    const playRect = playground.getBoundingClientRect();

    const bubbleX = (rect.left + rect.width / 2) - playRect.left;
    const bubbleY = rect.top - playRect.top - 50;

    speechBubble.style.left = bubbleX + 'px';
    speechBubble.style.top = Math.max(10, bubbleY) + 'px';
    speechBubble.style.transform = 'translate(-50%, -100%)';

    clearTimeout(activeSpeechTimeout);
    activeSpeechTimeout = setTimeout(() => {
      speechBubble.classList.add('hidden');
    }, 3200);
  }

  // ============================================================
  // BLOCK MANAGEMENT & SPAWNER
  // ============================================================
  function spawnBlock(val, x = null, y = null, playSound = true) {
    const playRect = playground.getBoundingClientRect();
    const defaultX = x !== null ? x : playRect.width / 2 - 30 + (Math.random() * 80 - 40);
    const defaultY = y !== null ? y : playRect.height / 2 - 40 + (Math.random() * 80 - 40);

    const block = new NumberBlock(val, defaultX, defaultY, blocksLayer);
    blocks.push(block);

    attachDragListeners(block);

    if (playSound) {
      window.audioEngine.playPop();
      window.audioEngine.playNumberChime(val);
      window.audioEngine.speakNumber(val);
    }

    // Burst sparkles at spawn location
    spawnParticles(defaultX + 30, defaultY + 30, 15);
    checkMission(val);
    checkLessonProgress('spawn', { val });

    return block;
  }

  function removeBlock(block, immediate = false) {
    const val = block.value;
    const idx = blocks.indexOf(block);
    if (idx !== -1) {
      blocks.splice(idx, 1);
    }
    block.destroy(immediate);
    checkLessonProgress('trash', { val, remaining: blocks.length });
  }

  function clearAllBlocks() {
    while (blocks.length > 0) {
      const b = blocks.pop();
      b.destroy(false);
    }
    window.audioEngine.playSlice();
  }

  // ============================================================
  // TRASH ZONE HIT-TEST HELPER
  // ============================================================
  function isOverTrashZone(clientX, clientY, block) {
    if (!trashZone) return false;
    const trashRect = trashZone.getBoundingClientRect();
    const pad = 24; // Generous drop area margin

    // 1. Check if pointer/touch position is near trash zone
    const isPointerOver = (
      clientX >= trashRect.left - pad &&
      clientX <= trashRect.right + pad &&
      clientY >= trashRect.top - pad &&
      clientY <= trashRect.bottom + pad
    );
    if (isPointerOver) return true;

    // 2. Check if block element bounding box overlaps the trash zone
    if (block && block.element) {
      const bRect = block.getBounds();
      const overlaps = !(
        bRect.right < trashRect.left ||
        bRect.left > trashRect.right ||
        bRect.bottom < trashRect.top ||
        bRect.top > trashRect.bottom
      );
      if (overlaps) return true;
    }

    return false;
  }

  // ============================================================
  // DRAG & DROP WITH MAGNETIC MERGE
  // ============================================================
  function attachDragListeners(block) {
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let totalDragDistance = 0;
    let lastTapTime = 0;

    let cachedPlayWidth = 0;
    let cachedPlayHeight = 0;
    let cachedBlockWidth = 0;
    let cachedBlockHeight = 0;

    const el = block.element;

    el.addEventListener('pointerdown', (e) => {
      // Only drag on left click for mouse
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      window.audioEngine.initAudioContext();

      // Tool handling
      if (currentTool === 'slice') {
        splitBlock(block);
        return;
      }

      if (currentTool === 'count') {
        block.countCubes();
        showSpeechBubble('Counting ' + block.config.name + '!', block);
        return;
      }

      // Start Drag mode
      isDragging = true;
      block.isDragging = true;
      totalDragDistance = 0;
      el.classList.add('is-dragging');
      trashZone.classList.add('drag-active');

      try {
        el.setPointerCapture(e.pointerId);
      } catch (err) {}

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      // Cache dimensions once on pointerdown to prevent layout thrashing during drag
      const playRect = playground.getBoundingClientRect();
      const bounds = block.getBounds();
      cachedBlockWidth = bounds.width || 60;
      cachedBlockHeight = bounds.height || 60;
      cachedPlayWidth = playRect.width;
      cachedPlayHeight = playRect.height;

      // Bring block to top of stacking order
      blocksLayer.appendChild(el);
      block.updatePosition();
      window.audioEngine.playPop();
    });

    el.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      totalDragDistance += Math.hypot(dx, dy);

      // Instant fluid movement with zero-sticking boundary clamp
      const minX = 8;
      const maxX = Math.max(minX, cachedPlayWidth - cachedBlockWidth - 8);
      const minY = 8;
      const maxY = Math.max(minY, cachedPlayHeight - cachedBlockHeight - 8);

      block.x = Math.max(minX, Math.min(maxX, block.x + dx));
      block.y = Math.max(minY, Math.min(maxY, block.y + dy));
      block.updatePosition();

      // 1. Trash zone hover check
      const overTrash = isOverTrashZone(e.clientX, e.clientY, block);
      if (overTrash) {
        trashZone.classList.add('drag-over');
        el.classList.add('is-over-trash');
      } else {
        trashZone.classList.remove('drag-over');
        el.classList.remove('is-over-trash');
      }

      // 2. Merge Aura check: find candidate block within snap distance with hysteresis
      let nearbyTarget = null;
      const bBounds = block.getBounds();

      for (const other of blocks) {
        if (other === block) continue;
        if (block.value + other.value > 10) continue; // max 10
        const oBounds = other.getBounds();
        const dist = Math.hypot(
          Math.max(0, Math.max(bBounds.left - oBounds.right, oBounds.left - bBounds.right)),
          Math.max(0, Math.max(bBounds.top - oBounds.bottom, oBounds.top - bBounds.bottom))
        );
        const threshold = (hoveredCandidate === other) ? 95 : 75;
        if (dist < threshold) {
          nearbyTarget = other;
          break;
        }
      }

      if (nearbyTarget && !overTrash) {
        if (hoveredCandidate && hoveredCandidate !== nearbyTarget) {
          hoveredCandidate.element.classList.remove('merge-candidate-target');
        }
        hoveredCandidate = nearbyTarget;
        const targetSum = block.value + nearbyTarget.value;
        const targetCfg = NUMBER_CONFIGS[targetSum];
        const auraColor = targetCfg ? (targetCfg.color === '#ffffff' ? '#ff3344' : targetCfg.color) : '#facc15';
        hoveredCandidate.element.classList.add('merge-candidate-target');
        hoveredCandidate.element.style.setProperty('--aura-color', auraColor);
      } else if (hoveredCandidate) {
        hoveredCandidate.element.classList.remove('merge-candidate-target');
        hoveredCandidate = null;
      }
    });

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      block.isDragging = false;
      el.classList.remove('is-dragging', 'is-over-trash');
      trashZone.classList.remove('drag-active', 'drag-over');

      // Clear merge aura
      if (hoveredCandidate) {
        hoveredCandidate.element.classList.remove('merge-candidate-target');
        hoveredCandidate = null;
      }

      try {
        el.releasePointerCapture(e.pointerId);
      } catch (err) {}

      block.updatePosition();

      // 1. Check if dropped in trash zone
      if (isOverTrashZone(e.clientX, e.clientY, block)) {
        const trashRect = trashZone.getBoundingClientRect();
        spawnParticles(trashRect.left + trashRect.width / 2, trashRect.top + trashRect.height / 2, 28, ['#ef4444', '#f87171', '#ffaaaa', '#ffffff']);
        window.audioEngine.playSlice();
        removeBlock(block);
        return;
      }

      // 2. Check if this was a stationary double-tap/click to split
      if (totalDragDistance < 8) {
        const currentTime = Date.now();
        if (currentTime - lastTapTime < 320) {
          lastTapTime = 0;
          splitBlock(block);
          return;
        }
        lastTapTime = currentTime;
        return; // A stationary click/tap must NEVER trigger a merge!
      } else {
        lastTapTime = 0;
      }

      // 3. Check for merge with another block (only when actively dragged)
      checkMerge(block);
    };

    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    // Native double click listener for instant mouse split
    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      e.preventDefault();
      splitBlock(block);
    });
  }

  // ============================================================
  // MERGE LOGIC (ADDITION WITH EDGE-TO-EDGE DISTANCE)
  // ============================================================
  function checkMerge(draggedBlock) {
    const snapDistance = 70; // Distance threshold for magnetic merge between block edges
    const boundsA = draggedBlock.getBounds();

    let closestBlock = null;
    let minDistance = Infinity;

    for (const other of blocks) {
      if (other === draggedBlock) continue;
      if (draggedBlock.value + other.value > 10) continue; // Maximum is 10

      const boundsB = other.getBounds();

      // Shortest distance between two bounding rectangles
      const dx = Math.max(0, Math.max(boundsA.left - boundsB.right, boundsB.left - boundsA.right));
      const dy = Math.max(0, Math.max(boundsA.top - boundsB.bottom, boundsB.top - boundsA.bottom));
      const dist = Math.hypot(dx, dy);

      if (dist < snapDistance && dist < minDistance) {
        minDistance = dist;
        closestBlock = other;
      }
    }

    if (closestBlock) {
      // Perform merge
      const valA = draggedBlock.value;
      const valB = closestBlock.value;
      const sum = valA + valB;

      const midX = (draggedBlock.x + closestBlock.x) / 2;
      const midY = (draggedBlock.y + closestBlock.y) / 2;

      // Confetti & Magic sounds
      spawnParticles(midX + 40, midY + 40, 35);
      window.audioEngine.playMergeMagic();

      // Remove old blocks
      removeBlock(draggedBlock, true);
      removeBlock(closestBlock, true);

      // Create new combined block
      const newBlock = spawnBlock(sum, midX, midY, false);
      newBlock.playMergeAnimation();

      // Speak math equation and iconic BBC Numberblocks catchphrases
      const nameA = NUMBER_CONFIGS[valA] ? NUMBER_CONFIGS[valA].name : valA;
      const nameB = NUMBER_CONFIGS[valB] ? NUMBER_CONFIGS[valB].name : valB;
      const nameSum = NUMBER_CONFIGS[sum] ? NUMBER_CONFIGS[sum].name : sum;

      const eqText = nameA + ' + ' + nameB + ' = ' + nameSum + '!';
      showSpeechBubble(eqText, newBlock);

      // Check for iconic BBC Numberblocks lines
      let customLine = null;
      if (sum === 4 && valA === 2 && valB === 2) {
        customLine = 'Two plus Two equals Four! I am Four, and I love being a square!';
      } else if (sum === 6 && valA === 3 && valB === 3) {
        customLine = 'Three plus Three equals Six! Six in the mix! Roll the dice!';
      } else if (sum === 8 && valA === 4 && valB === 4) {
        customLine = 'Four plus Four equals Eight! Octoblock to the rescue!';
      } else if (sum === 10) {
        if (valA === 5 && valB === 5) {
          customLine = 'Five plus Five equals Ten! Two fives together, high ten!';
        } else {
          customLine = 'Blast Off! ' + nameA + ' plus ' + nameB + ' equals Ten! A wonderful Ten!';
        }
      }

      if (customLine) {
        window.audioEngine.speak(customLine, () => {
          newBlock.speak();
        });
      } else {
        window.audioEngine.speakAddition(valA, valB, sum, () => {
          newBlock.speak();
        });
      }

      checkMission(sum);
      checkLessonProgress('merge', { valA, valB, sum });
    }
  }

  // ============================================================
  // SPLIT LOGIC (SUBTRACTION)
  // ============================================================
  function splitBlock(block) {
    const parts = block.split();
    if (!parts) return;

    const [partA, partB] = parts;
    const origX = block.x;
    const origY = block.y;
    const origVal = block.value;

    window.audioEngine.playSlice();
    spawnParticles(origX + 30, origY + 30, 20);

    removeBlock(block, true);

    // Spawn the 2 split parts side by side with clean spacing
    const playRect = playground.getBoundingClientRect();
    const safeLeft = Math.max(16, origX - 50);
    const safeRight = Math.min(playRect.width - 80, origX + 55);

    const block1 = spawnBlock(partA, safeLeft, origY, false);
    const block2 = spawnBlock(partB, safeRight, origY, false);

    const nameOrig = NUMBER_CONFIGS[origVal] ? NUMBER_CONFIGS[origVal].name : origVal;
    const nameA = NUMBER_CONFIGS[partA] ? NUMBER_CONFIGS[partA].name : partA;
    const nameB = NUMBER_CONFIGS[partB] ? NUMBER_CONFIGS[partB].name : partB;

    showSpeechBubble(nameOrig + ' split into ' + nameA + ' and ' + nameB + '!', block1);
    window.audioEngine.speakSplit(origVal, partA, partB);

    checkLessonProgress('split', { fromVal: origVal, partA, partB });
  }

  // ============================================================
  // MISSION & QUEST SYSTEM
  // ============================================================
  function updateMissionUI() {
    const cur = MISSIONS[missionIndex];
    missionPrompt.innerHTML = cur.prompt;
    missionCard.classList.remove('success-pulse');

    if (questTargetNum) {
      questTargetNum.textContent = cur.target;
    }

    if (questTargetCube) {
      const cfg = NUMBER_CONFIGS[cur.target];
      if (cur.target === 7) {
        questTargetCube.style.background = 'linear-gradient(135deg, #ff3344, #ff8811, #ffcc00, #22cc55, #0099ff, #7733cc)';
        questTargetCube.style.color = '#ffffff';
        questTargetCube.style.border = 'none';
        missionCard.style.setProperty('--target-color', '#ff2277');
        missionCard.style.setProperty('--target-glow', 'rgba(255, 34, 119, 0.45)');
      } else if (cur.target === 10) {
        questTargetCube.style.background = '#ffffff';
        questTargetCube.style.color = '#ff3344';
        questTargetCube.style.border = '2px solid #ff3344';
        missionCard.style.setProperty('--target-color', '#ff3344');
        missionCard.style.setProperty('--target-glow', 'rgba(255, 51, 68, 0.45)');
      } else if (cfg) {
        questTargetCube.style.background = cfg.color;
        questTargetCube.style.color = '#ffffff';
        questTargetCube.style.border = 'none';
        missionCard.style.setProperty('--target-color', cfg.color);
        missionCard.style.setProperty('--target-glow', `${cfg.color}66`);
      }
    }
  }

  function nextMission() {
    missionIndex = (missionIndex + 1) % MISSIONS.length;
    updateMissionUI();
    window.audioEngine.playPop();

    const target = MISSIONS[missionIndex].target;
    const name = NUMBER_CONFIGS[target] ? NUMBER_CONFIGS[target].name : target;
    window.audioEngine.speak('New mission! Can you make number ' + name + '?');
  }

  function checkMission(formedValue) {
    const cur = MISSIONS[missionIndex];
    if (formedValue === cur.target) {
      // Victory!
      missionCard.classList.add('success-pulse');
      window.audioEngine.playVictory();

      const playRect = playground.getBoundingClientRect();
      spawnParticles(playRect.width / 2, playRect.height / 3, 60);

      const targetName = NUMBER_CONFIGS[cur.target] ? NUMBER_CONFIGS[cur.target].name : cur.target;
      window.audioEngine.speak('Awesome job! You made ' + targetName + '!');

      setTimeout(() => {
        nextMission();
      }, 4000);
    }
  }

  // ============================================================
  // LESSON ENGINE (GRADE 1 NUMBERBLOCKS CURRICULUM)
  // ============================================================
  const STORAGE_KEY = 'numberblocks_grade1_progress';

  function loadUserProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      completed: [],
      stars: {},
      unlockedMax: 1
    };
  }

  let userProgress = loadUserProgress();

  function saveUserProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {}
    updateStarsUI();
  }

  function getTotalStars() {
    let total = 0;
    for (const id in userProgress.stars) {
      total += userProgress.stars[id] || 0;
    }
    return total;
  }

  function updateStarsUI() {
    const total = getTotalStars();
    if (lessonStarBadge) lessonStarBadge.textContent = `⭐ ${total}/30`;
    if (modalTotalStars) modalTotalStars.textContent = total;
  }

  function renderLessonsGrid() {
    if (!lessonsGrid) return;
    lessonsGrid.innerHTML = '';

    LESSONS.forEach((lesson) => {
      const isCompleted = userProgress.completed.includes(lesson.id);
      const isUnlocked = lesson.id <= (userProgress.unlockedMax || 1);
      const starsEarned = userProgress.stars[lesson.id] || 0;

      const card = document.createElement('div');
      card.className = `lesson-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''} ${activeLesson && activeLesson.id === lesson.id ? 'active' : ''}`;
      card.style.setProperty('--lesson-color', lesson.color === '#ffffff' ? '#ff3344' : lesson.color);

      let starDisplay = '';
      for (let s = 1; s <= 3; s++) {
        starDisplay += s <= starsEarned ? '⭐' : '☆';
      }

      card.innerHTML = `
        <div class="card-top">
          <span class="lesson-num">BÀI ${lesson.id}</span>
          <span class="card-stars">${starDisplay}</span>
        </div>
        <div class="card-title">${lesson.title}</div>
        <div class="card-desc">${lesson.desc}</div>
        <button class="card-start-btn" ${!isUnlocked ? 'disabled' : ''}>
          ${!isUnlocked ? '🔒 Chưa mở' : (isCompleted ? '✓ Học lại' : '▶ Bắt đầu học')}
        </button>
      `;

      if (isUnlocked) {
        card.querySelector('.card-start-btn').addEventListener('click', () => {
          startLesson(lesson.id);
        });
      }

      lessonsGrid.appendChild(card);
    });
  }

  function startLesson(lessonId) {
    const lesson = LESSONS.find(l => l.id === lessonId);
    if (!lesson) return;

    activeLesson = lesson;
    lessonStepProgress = 0;

    // Close modal
    lessonModal.classList.add('hidden');

    // Show banner
    lessonBanner.classList.remove('hidden');
    currentLessonNum.textContent = lesson.id;
    currentLessonTitle.textContent = lesson.title;
    currentLessonPrompt.innerHTML = lesson.prompt;
    lessonTaskStatus.textContent = 'Tiến độ: 0/1';

    // Clear board and prepare starter setup based on lesson
    clearAllBlocks();

    // Spawning initial starter blocks for ease of play
    const playRect = playground.getBoundingClientRect();
    const cx = playRect.width / 2;
    const cy = playRect.height / 2;

    if (lesson.id === 3) { // 1 + 1 = 2
      spawnBlock(1, cx - 80, cy - 30, false);
      spawnBlock(1, cx + 40, cy - 30, false);
    } else if (lesson.id === 4) { // 2 + 2 = 4
      spawnBlock(2, cx - 90, cy - 40, false);
      spawnBlock(2, cx + 40, cy - 40, false);
    } else if (lesson.id === 5) { // 2 + 3 = 5
      spawnBlock(2, cx - 90, cy - 40, false);
      spawnBlock(3, cx + 40, cy - 50, false);
    } else if (lesson.id === 6) { // 3 + 3 = 6
      spawnBlock(3, cx - 90, cy - 50, false);
      spawnBlock(3, cx + 40, cy - 50, false);
    } else if (lesson.id === 7) { // 7 + 3 = 10
      spawnBlock(7, cx - 110, cy - 80, false);
      spawnBlock(3, cx + 50, cy - 50, false);
    } else if (lesson.id === 8) { // 4 - 1
      spawnBlock(4, cx - 30, cy - 30, false);
    } else if (lesson.id === 9) { // 6 split
      spawnBlock(6, cx - 30, cy - 40, false);
    } else if (lesson.id === 10) { // 5 + 5 = 10
      spawnBlock(5, cx - 100, cy - 60, false);
      spawnBlock(5, cx + 40, cy - 60, false);
    }

    // Voice announcement
    window.audioEngine.speak(lesson.voiceIntro);
    window.audioEngine.playPop();
  }

  function exitLesson() {
    activeLesson = null;
    lessonBanner.classList.add('hidden');
    window.audioEngine.speak('Exited lesson mode.');
  }

  function completeLesson() {
    if (!activeLesson) return;

    const curId = activeLesson.id;
    if (!userProgress.completed.includes(curId)) {
      userProgress.completed.push(curId);
    }
    userProgress.stars[curId] = 3;
    userProgress.unlockedMax = Math.max(userProgress.unlockedMax || 1, curId + 1);
    saveUserProgress();

    // Fanfare & Confetti
    window.audioEngine.playVictory();
    const playRect = playground.getBoundingClientRect();
    spawnParticles(playRect.width / 2, playRect.height / 3, 75);

    // Show victory modal
    victoryLessonTitle.textContent = `Bé đã hoàn thành Bài ${curId}: ${activeLesson.title}!`;
    victoryMessage.textContent = activeLesson.victoryMsg;
    lessonVictoryModal.classList.remove('hidden');

    window.audioEngine.speak(activeLesson.victoryMsg);

    // Update next button
    if (curId >= 10) {
      nextLessonBtn.textContent = '🎉 Hoàn Thành Khóa Học! 🏆';
    } else {
      nextLessonBtn.textContent = `Bài Tiếp Theo (${curId + 1}) ➜`;
    }
  }

  function checkLessonProgress(event, data) {
    if (!activeLesson) return;

    if (activeLesson.type === 'spawn_set') {
      const existingVals = blocks.map(b => b.value);
      const hasAll = activeLesson.required.every(req => existingVals.includes(req));
      const count = activeLesson.required.filter(req => existingVals.includes(req)).length;
      lessonTaskStatus.textContent = `Tiến độ: ${count}/${activeLesson.required.length}`;

      if (hasAll) {
        completeLesson();
      }
    } else if (activeLesson.type === 'merge_match' && event === 'merge') {
      const match = (data.valA === activeLesson.valA && data.valB === activeLesson.valB) ||
                    (data.valA === activeLesson.valB && data.valB === activeLesson.valA);
      if (match && data.sum === activeLesson.sum) {
        lessonTaskStatus.textContent = 'Tiến độ: 1/1 ✓';
        completeLesson();
      }
    } else if (activeLesson.type === 'trash_leave' && event === 'trash') {
      const remainingVals = blocks.map(b => b.value);
      if (remainingVals.includes(activeLesson.targetVal)) {
        lessonTaskStatus.textContent = 'Tiến độ: 1/1 ✓';
        completeLesson();
      }
    } else if (activeLesson.type === 'split_from' && event === 'split') {
      if (data.fromVal === activeLesson.fromVal) {
        lessonTaskStatus.textContent = 'Tiến độ: 1/1 ✓';
        completeLesson();
      }
    }
  }

  // ============================================================
  // TOOL SWITCHING
  // ============================================================
  function setTool(tool) {
    currentTool = tool;
    toolDrag.classList.toggle('active', tool === 'drag');
    toolSlice.classList.toggle('active', tool === 'slice');
    toolCount.classList.toggle('active', tool === 'count');
    window.audioEngine.playPop();
  }

  toolDrag.addEventListener('click', () => setTool('drag'));
  toolSlice.addEventListener('click', () => setTool('slice'));
  toolCount.addEventListener('click', () => setTool('count'));

  // Sound Toggle
  soundToggleBtn.addEventListener('click', () => {
    const enabled = window.audioEngine.toggleSound();
    soundToggleBtn.textContent = enabled ? '🔊' : '🔇';
  });

  // Clear Playground
  clearBoardBtn.addEventListener('click', () => {
    clearAllBlocks();
  });

  // Next Mission button
  nextMissionBtn.addEventListener('click', () => {
    nextMission();
  });

  // Replay Mission Voice
  if (speakMissionBtn) {
    speakMissionBtn.addEventListener('click', () => {
      const cur = MISSIONS[missionIndex];
      const cleanPrompt = cur.prompt.replace(/<[^>]*>/g, '');
      window.audioEngine.speak(cleanPrompt);
      window.audioEngine.playPop();
    });
  }

  // Floating Guide
  if (closeGuideBtn && floatingGuide) {
    closeGuideBtn.addEventListener('click', () => {
      floatingGuide.style.display = 'none';
    });
  }

  // Spawner Buttons
  spawnButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = parseInt(btn.dataset.number, 10);
      spawnBlock(num);
    });
  });

  // ============================================================
  // LESSON MODAL & EVENT LISTENERS
  // ============================================================
  openLessonsBtn.addEventListener('click', () => {
    renderLessonsGrid();
    lessonModal.classList.remove('hidden');
    window.audioEngine.playPop();
  });

  closeLessonsModalBtn.addEventListener('click', () => {
    lessonModal.classList.add('hidden');
  });

  exitLessonBtn.addEventListener('click', () => {
    exitLesson();
  });

  nextLessonBtn.addEventListener('click', () => {
    lessonVictoryModal.classList.add('hidden');
    if (activeLesson) {
      if (activeLesson.id < 10) {
        startLesson(activeLesson.id + 1);
      } else {
        renderLessonsGrid();
        lessonModal.classList.remove('hidden');
      }
    }
  });

  replayLessonBtn.addEventListener('click', () => {
    lessonVictoryModal.classList.add('hidden');
    if (activeLesson) {
      startLesson(activeLesson.id);
    }
  });

  // Close modals on clicking outside
  lessonModal.addEventListener('click', (e) => {
    if (e.target === lessonModal) {
      lessonModal.classList.add('hidden');
    }
  });

  lessonVictoryModal.addEventListener('click', (e) => {
    if (e.target === lessonVictoryModal) {
      lessonVictoryModal.classList.add('hidden');
    }
  });

  // ============================================================
  // INITIAL SCENE SETUP
  // ============================================================
  updateMissionUI();
  updateStarsUI();

  // Spawn initial Numberblocks 1 & 2 to invite immediate play!
  setTimeout(() => {
    const playRect = playground.getBoundingClientRect();
    const centerX = playRect.width / 2;
    const centerY = playRect.height / 2;

    const b1 = spawnBlock(1, Math.max(40, centerX - 120), centerY - 30, false);
    const b2 = spawnBlock(2, Math.min(playRect.width - 100, centerX + 40), centerY - 45, false);

    showSpeechBubble('Drag 1 and 2 together to make 3!', b1);
    window.audioEngine.speak('Welcome to Numberblocks Magic Lab! Tap Bài Học to start your math adventure!');
  }, 500);
});
