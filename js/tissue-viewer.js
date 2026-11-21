/**
 * SG INDUSTRY - HERO 3D TISSUE VIEWER
 * Interactive 360° Product Model Inspector
 * Toggles between Facial Box, Bath Tissue Roll, and Kitchen Towel
 */

(function () {
  let scene, camera, renderer, currentModelGroup;
  let activeModelType = 'box'; // 'box', 'roll', 'towel'
  let activePly = 3;
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let sheetMesh = null;
  let isUnrolled = false;
  let unrollProgress = 0;

  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  function initHeroViewer() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.3);
    dirLight.position.set(4, 6, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xdcf0e8, 0.6);
    backLight.position.set(-4, -2, -3);
    scene.add(backLight);

    currentModelGroup = new THREE.Group();
    scene.add(currentModelGroup);

    // Initial load: Facial Tissue Box
    loadBoxModel();

    // Interaction controls
    setupControls();
    window.addEventListener('resize', onResize);
    animateHero();
  }

  // Generates Paper Embossing Texture
  function createEmbossedTexture(patternType = 'floral') {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(15, 76, 58, 0.06)';
    ctx.lineWidth = 2;

    if (patternType === 'honeycomb') {
      // Honeycomb weave for kitchen towel
      const size = 30;
      for (let y = 0; y < 512; y += size * 1.5) {
        for (let x = 0; x < 512; x += size * Math.sqrt(3)) {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else {
      // Delicate floral / dot embossing for toilet & facial tissues
      for (let y = 20; y < 512; y += 40) {
        for (let x = 20; x < 512; x += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(15, 76, 58, 0.08)';
          ctx.fill();
        }
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  // Clear current model
  function clearModel() {
    while (currentModelGroup.children.length > 0) {
      const obj = currentModelGroup.children[0];
      currentModelGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
  }

  // 1. Luxury Facial Tissue Box
  function loadBoxModel() {
    clearModel();
    activeModelType = 'box';

    // Outer cube
    const geo = new THREE.BoxGeometry(1.8, 1.4, 1.3);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Forest green finish with gold leaf accents
    ctx.fillStyle = '#0f4c3a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#d4a373';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SG INDUSTRY', 256, 220);
    ctx.fillStyle = '#d4a373';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ULTRA COMFORT • 3-PLY', 256, 260);

    const boxTex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshStandardMaterial({
      map: boxTex,
      roughness: 0.35,
      metalness: 0.1
    });

    const box = new THREE.Mesh(geo, mat);
    box.castShadow = true;
    currentModelGroup.add(box);

    // Oval aperture on top
    const slitGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32);
    slitGeo.scale(1.2, 1, 0.6);
    const slitMat = new THREE.MeshStandardMaterial({ color: 0x051b14 });
    const slit = new THREE.Mesh(slitGeo, slitMat);
    slit.position.y = 0.71;
    currentModelGroup.add(slit);

    // Protruding tissue sheet
    const paperTex = createEmbossedTexture('floral');
    const sheetGeo = new THREE.PlaneGeometry(1.0, 0.9, 20, 20);
    const sheetMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.8,
      side: THREE.DoubleSide
    });
    sheetMesh = new THREE.Mesh(sheetGeo, sheetMat);
    sheetMesh.position.set(0, 1.05, 0);
    sheetMesh.rotation.x = -0.3;
    sheetMesh.castShadow = true;
    currentModelGroup.add(sheetMesh);

    currentModelGroup.rotation.set(0.2, -0.4, 0);
  }

  // 2. Bathroom Tissue Roll
  function loadRollModel() {
    clearModel();
    activeModelType = 'roll';

    const paperTex = createEmbossedTexture('floral');

    // Outer Paper Roll Cylinder
    const rollGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.25, 48);
    const rollMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.9,
      metalness: 0.02
    });
    const roll = new THREE.Mesh(rollGeo, rollMat);
    roll.castShadow = true;
    currentModelGroup.add(roll);

    // Cardboard Core
    const coreGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.26, 32, 1, true);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xc49a6c, // Kraft paper brown
      roughness: 0.85,
      side: THREE.DoubleSide
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    currentModelGroup.add(core);

    // Core inside hollow shadow
    const innerShadowGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.24, 32);
    const innerShadowMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const innerShadow = new THREE.Mesh(innerShadowGeo, innerShadowMat);
    currentModelGroup.add(innerShadow);

    // Unrolling paper sheet
    const unrollGeo = new THREE.PlaneGeometry(1.2, 1.6, 20, 20);
    const unrollMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.85,
      side: THREE.DoubleSide
    });
    sheetMesh = new THREE.Mesh(unrollGeo, unrollMat);
    sheetMesh.position.set(0.8, -0.2, 0.4);
    sheetMesh.rotation.set(0.1, 0.6, -0.2);
    sheetMesh.castShadow = true;
    currentModelGroup.add(sheetMesh);

    currentModelGroup.rotation.set(0.3, -0.6, 0);
  }

  // 3. Multi-surface Kitchen Towel
  function loadTowelModel() {
    clearModel();
    activeModelType = 'towel';

    const towelTex = createEmbossedTexture('honeycomb');

    // Taller cylinder for kitchen roll
    const rollGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.1, 48);
    const rollMat = new THREE.MeshStandardMaterial({
      map: towelTex,
      roughness: 0.9,
      metalness: 0.02
    });
    const roll = new THREE.Mesh(rollGeo, rollMat);
    roll.castShadow = true;
    currentModelGroup.add(roll);

    // Cardboard core
    const coreGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.12, 32, 1, true);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xb58a5c,
      roughness: 0.85,
      side: THREE.DoubleSide
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    currentModelGroup.add(core);

    currentModelGroup.rotation.set(0.2, -0.5, 0);
  }

  // UI Event Handlers
  function setupControls() {
    const toggleBtns = document.querySelectorAll('.viewer-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const model = btn.getAttribute('data-model');
        if (model === 'box') loadBoxModel();
        else if (model === 'roll') loadRollModel();
        else if (model === 'towel') loadTowelModel();
      });
    });

    // Mouse / Touch rotation
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || !currentModelGroup) return;
      const dx = (e.clientX - prevX) * 0.008;
      const dy = (e.clientY - prevY) * 0.008;

      currentModelGroup.rotation.y += dx;
      currentModelGroup.rotation.x = Math.max(-0.6, Math.min(0.6, currentModelGroup.rotation.x + dy));

      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });
  }

  function onResize() {
    if (!renderer || !camera || !canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function animateHero() {
    requestAnimationFrame(animateHero);

    // Subtle automatic rotation when not dragging
    if (!isDragging && currentModelGroup) {
      currentModelGroup.rotation.y += 0.004;
    }

    // Flutter sheet if present
    if (sheetMesh) {
      const time = performance.now() * 0.002;
      sheetMesh.rotation.z = Math.sin(time) * 0.04;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroViewer);
  } else {
    initHeroViewer();
  }
})();
