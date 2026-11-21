/**
 * SG INDUSTRIES - LETTER-BY-LETTER DROP ENTRY ANIMATION
 * Letters cascade from the top of the screen to the center one by one.
 * Built with GSAP & Web Audio API
 */

(function () {
  const overlay = document.getElementById('tissue-intro-overlay');
  const skipBtn = document.getElementById('btn-skip-intro');
  const progressBar = document.getElementById('intro-progress-fill');
  const replayBtn = document.getElementById('btn-replay-intro');

  if (!overlay) return;

  let masterTimeline = null;
  let audioCtx = null;

  // Soft tactile pop/landing sound for each letter
  function playLetterLandingSound(index) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Pitch rises gently across the word sequence
      const baseFreq = 260 + (index * 22);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio optional
    }
  }

  // Soft paper whoosh on curtain reveal
  function playRevealWhoosh() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const bufferSize = audioCtx.sampleRate * 0.45;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.4);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
      noise.stop(audioCtx.currentTime + 0.46);
    } catch (e) {
      // Audio optional
    }
  }

  // Build & Run Letter Drop Animation
  function initLetterDropAnimation() {
    if (masterTimeline) masterTimeline.kill();

    const letters = document.querySelectorAll('.drop-letter:not(.letter-gap)');
    const tagline = document.getElementById('intro-tagline');
    const pills = document.getElementById('intro-pills');

    // Make sure overlay is visible
    overlay.classList.remove('fade-out');
    overlay.style.transform = 'translateY(0%)';
    overlay.style.opacity = '1';

    // Set Initial Offscreen Positions (high above viewport)
    const startHeight = window.innerHeight ? window.innerHeight * 1.15 : 900;

    gsap.set(letters, {
      y: -startHeight,
      opacity: 0,
      scale: 0.8,
      rotation: (i) => (i % 2 === 0 ? -18 : 18)
    });

    if (tagline) gsap.set(tagline, { y: 25, opacity: 0 });
    if (pills) gsap.set(pills, { y: 25, opacity: 0 });
    if (progressBar) progressBar.style.width = '0%';

    // Create Main Timeline
    masterTimeline = gsap.timeline({
      onComplete: () => {
        finishIntro();
      }
    });

    // 1. Letters Come One By One From Top to Center
    letters.forEach((letter, index) => {
      masterTimeline.to(letter, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.85,
        ease: 'back.out(2.2)',
        onStart: () => {
          playLetterLandingSound(index);
        }
      }, 0.15 + (index * 0.085)); // 85ms stagger between each letter
    });

    const lettersEndTimestamp = 0.15 + (letters.length * 0.085) + 0.5;

    // 3. Gentle Shimmer / Bounce after all letters arrive
    masterTimeline.to(letters, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      stagger: 0.03
    }, lettersEndTimestamp);

    // 4. Tagline & Product Pills Reveal Below Center
    masterTimeline.to(tagline, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      ease: 'power3.out'
    }, lettersEndTimestamp + 0.1);

    masterTimeline.to(pills, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, lettersEndTimestamp + 0.25);

    // 5. Progress Bar Fills Smoothly Across Total Timeline
    const totalDuration = lettersEndTimestamp + 1.6;
    if (progressBar) {
      masterTimeline.to(progressBar, {
        width: '100%',
        duration: totalDuration,
        ease: 'linear'
      }, 0);
    }

    // 6. Hold for user to appreciate the assembled name before exit
    masterTimeline.to({}, { duration: 0.9 });
  }

  // Finish Intro & Reveal Homepage
  function finishIntro() {
    if (masterTimeline) masterTimeline.pause();
    playRevealWhoosh();

    gsap.to(overlay, {
      y: '-100%',
      opacity: 0,
      duration: 0.85,
      ease: 'power3.inOut',
      onComplete: () => {
        overlay.classList.add('fade-out');

        // Animate hero elements into view
        gsap.from('.hero-content > *', {
          y: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out'
        });
        gsap.from('.hero-3d-card', {
          scale: 0.93,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.out',
          delay: 0.2
        });
      }
    });
  }

  // Event Listeners
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishIntro();
    });
  }

  overlay.addEventListener('click', (e) => {
    // Click anywhere to skip
    finishIntro();
  });

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initLetterDropAnimation();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('fade-out')) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finishIntro();
      }
    }
  });

  // Start on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initLetterDropAnimation, 100);
    });
  } else {
    setTimeout(initLetterDropAnimation, 100);
  }

  // Expose Replay globally
  window.replayLetterDropIntro = initLetterDropAnimation;
})();
