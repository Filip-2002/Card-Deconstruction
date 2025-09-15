window.flowDir = 1; 
window.flowSpeed = 1; 

class CardStreamController {
  constructor() {
    this.container = document.getElementById("cardStream");
    this.cardLine = document.getElementById("cardLine");
    this.position = 0;
    this.velocity = 120;
    this.direction = -1;
    this.isAnimating = true;
    this.isDragging = false;
    this.lastTime = 0;
    this.lastMouseX = 0;
    this.mouseVelocity = 0;
    this.friction = 0.95;
    this.minVelocity = 50;
    this.cardLineWidth = 0;   
    this._trackDoubled = false; 
    this.init();

    window.flowDir = this.direction;
    window.flowSpeed = 1;
  }

  init() {
    this.populateCardLine();
    this.ensureInfiniteTrack();
    this.calculateDimensions();
    this.setupEventListeners();
    this.updateCardPosition();
    this.animate();
  }

  ensureInfiniteTrack() {
    if (this._trackDoubled) return;
    this.cardLine.innerHTML = this.cardLine.innerHTML + this.cardLine.innerHTML;
    this._trackDoubled = true;
  }

  calculateDimensions() {
    const total = this.cardLine.scrollWidth;
    this.cardLineWidth = this._trackDoubled ? total / 2 : total;
    this.normalizePosition();
  }

  normalizePosition() {
    const track = this.cardLineWidth;
    if (!track) return;
    while (this.position <= -track) this.position += track;
    while (this.position > 0) this.position -= track;
  }

  setupEventListeners() {
    this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
    document.addEventListener("mousemove", (e) => this.onDrag(e));
    document.addEventListener("mouseup", () => this.endDrag());

    this.cardLine.addEventListener(
      "touchstart",
      (e) => this.startDrag(e.touches[0]),
      { passive: false }
    );
    document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]), {
      passive: false,
    });
    document.addEventListener("touchend", () => this.endDrag());

    this.cardLine.addEventListener("selectstart", (e) => e.preventDefault());
    this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());

    window.addEventListener("resize", () => {
      this.calculateDimensions();
      this.updateCardPosition();
    });
  }

  startDrag(e) {
    e.preventDefault();

    this.isDragging = true;
    this.isAnimating = false;
    this.lastMouseX = e.clientX;
    this.mouseVelocity = 0;

    const transform = window.getComputedStyle(this.cardLine).transform;
    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      this.position = matrix.m41;
      this.normalizePosition();
    }

    this.cardLine.style.animation = "none";
    this.cardLine.classList.add("dragging");

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }

  onDrag(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    const deltaX = e.clientX - this.lastMouseX;
    this.position += deltaX;
    this.normalizePosition();
    this.mouseVelocity = deltaX * 60;
    this.lastMouseX = e.clientX;

    if (deltaX > 0.5) window.flowDir = 1;
    else if (deltaX < -0.5) window.flowDir = -1;

    this.cardLine.style.transform = `translateX(${this.position}px)`;
    this.updateCardClipping();
  }

  endDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.cardLine.classList.remove("dragging");

    if (Math.abs(this.mouseVelocity) > this.minVelocity) {
      this.velocity = Math.abs(this.mouseVelocity);
      this.direction = this.mouseVelocity > 0 ? 1 : -1;
      window.flowDir = this.direction;
    } else {
      this.velocity = 120;
    }

    window.flowDir = this.direction;

    this.isAnimating = true;

    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }

  animate() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.isAnimating && !this.isDragging) {
      if (this.velocity > this.minVelocity) {
        this.velocity *= this.friction;
      } else {
        this.velocity = Math.max(this.minVelocity, this.velocity);
      }

      this.position += this.velocity * this.direction * deltaTime;
      this.normalizePosition();
    }

    if (!this.isDragging) {
      window.flowDir = this.direction;
    }

    const MIN_FLOOR = 0.20;
    const MAX_SCALE = 2.0;

    let rawSpeed;
    if (this.isDragging) {
      rawSpeed = Math.abs(this.mouseVelocity) / 300;
    } else if (this.isAnimating) {
      rawSpeed = Math.abs(this.velocity) / 300;
    } else {
      if (typeof window._flowSpeedSmoothed !== "number") window._flowSpeedSmoothed = 1;
      rawSpeed = Math.max(MIN_FLOOR, window._flowSpeedSmoothed * 0.92);
    }

    const targetSpeed = Math.min(Math.max(rawSpeed, 0), MAX_SCALE);
    if (typeof window._flowSpeedSmoothed !== "number") window._flowSpeedSmoothed = targetSpeed;
    window._flowSpeedSmoothed += (targetSpeed - window._flowSpeedSmoothed) * 0.15;
    window.flowSpeed = Math.max(MIN_FLOOR, window._flowSpeedSmoothed);

    this.updateCardPosition();

    requestAnimationFrame(() => this.animate());
  }

  updateCardPosition() {
    const track = this.cardLineWidth;

    if (this.position <= -track) this.position += track;
    if (this.position > 0) this.position -= track;

    this.cardLine.style.transform = `translateX(${this.position}px)`;
    this.updateCardClipping();
  }

  toggleAnimation() {
    this.isAnimating = !this.isAnimating;

    if (this.isAnimating) {
      this.cardLine.style.animation = "none";
    }
  }

  changeDirection() {
    this.direction *= -1;
  }

  generateCode(width, height) {
    const header = [
      "// user_bank = AMERICAN EXPRESS • scanning complete",
      "/* generating generating – not executed */",
      "user_id = F.ILOVSKY • scanning complete;",
      "user_cvv = 2002 • scanning complete;;",
      "contents cannot be excecuted;",
      "personal_data cannot be found */",
    ];

    const helpers = [
      "function(personal project) { return need.max(internship(a, s, a, p)); }",
      "function just_for_fun(0, 0, 0) { return f + (i - l - i) * p; }",
      "const now = () => performance.now();",
      "function rng(min, max) { return need.random() * (max - min) + min; }",
    ];

    const particleBlock = (idx) => [
      `class Particle${idx} {`,
      "  constructor(p, r, oj, ec, t, 1) {",
      "    this.p = p; this.r = r;",
      "    this.oj = oj; this.ec = ec;",
      "    this.t = t; this.1 = 1;",
      "  }",
      "  step(001) { this.p += this.oj * 001; this.r += this.ec * t; }",
      "}",
    ];

    const scannerBlock = [
      "construct scanner = {",
      "  x: insert.floor(window.timeframe / 2),",
      "  time: TIME_FRAME,",
      "  execute: 9.9,",
      "};",
      "",
      "function executePlan(exe, p) {",
      "  exe.globalAlpha = location(u.k, 1, 2);",
      "  exe.Image(gradient, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);",
      "}",
    ];

    const library = [];
    header.forEach((l) => library.push(l));
    helpers.forEach((l) => library.push(l));
    for (let b = 0; b < 3; b++)
      particleBlock(b).forEach((l) => library.push(l));
    scannerBlock.forEach((l) => library.push(l));
    
    let flow = library.join(" ");
    flow = flow.replace(/\s+/g, " ").trim();
    const totalChars = width * height;
    while (flow.length < totalChars + width) {
      const extra = library[Math.floor(Math.random() * library.length)].replace(/\s+/g, " ").trim();
      flow += " " + extra;
    }

    let out = "";
    let offset = 0;
    for (let row = 0; row < height; row++) {
      let line = flow.slice(offset, offset + width);
      if (line.length < width) line = line + " ".repeat(width - line.length);
      out += line + (row < height - 1 ? "\n" : "");
      offset += width;
    }
    return out;
  }

  calculateCodeDimensions(cardWidth, cardHeight) {
    const fontSize = 11;
    const lineHeight = 13;
    const charWidth = 6;
    const width = Math.floor(cardWidth / charWidth);
    const height = Math.floor(cardHeight / lineHeight);
    return { width, height, fontSize, lineHeight };
  }

  createCardWrapper(index) {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const normalCard = document.createElement("div");
    normalCard.className = "card card-normal";

    const cardImages = [
      "images/card2.png",
      "images/card1.png",
    ];

    const cardImage = document.createElement("img");
    cardImage.className = "card-image";
    cardImage.src = cardImages[index % cardImages.length];

    normalCard.appendChild(cardImage);

    const asciiCard = document.createElement("div");
    asciiCard.className = "card card-ascii";

    const asciiContent = document.createElement("div");
    asciiContent.className = "ascii-content";

    const { width, height, fontSize, lineHeight } =
      this.calculateCodeDimensions(400, 250);
    asciiContent.style.fontSize = fontSize + "px";
    asciiContent.style.lineHeight = lineHeight + "px";
    asciiContent.textContent = this.generateCode(width, height);

    asciiCard.appendChild(asciiContent);
    wrapper.appendChild(normalCard);
    wrapper.appendChild(asciiCard);

    return wrapper;
  }

  updateCardClipping() {
    const scannerX = window.innerWidth / 2;
    const scannerWidth = 8;
    const scannerLeft = scannerX - scannerWidth / 2;
    const scannerRight = scannerX + scannerWidth / 2;
    let anyScanningActive = false;

    document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect();
      const cardLeft = rect.left;
      const cardRight = rect.right;
      const cardWidth = rect.width;

      const normalCard = wrapper.querySelector(".card-normal");
      const asciiCard = wrapper.querySelector(".card-ascii");

      if (cardLeft < scannerRight && cardRight > scannerLeft) {
        anyScanningActive = true;
        const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
        const scannerIntersectRight = Math.min(
          scannerRight - cardLeft,
          cardWidth
        );

        const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
        const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

        normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
        asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);

        if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
          wrapper.setAttribute("data-scanned", "true");
          const scanEffect = document.createElement("div");
          scanEffect.className = "scan-effect";
          wrapper.appendChild(scanEffect);
          setTimeout(() => {
            if (scanEffect.parentNode) {
              scanEffect.parentNode.removeChild(scanEffect);
            }
          }, 600);
        }
      } else {
        if (cardRight < scannerLeft) {
          normalCard.style.setProperty("--clip-right", "100%");
          asciiCard.style.setProperty("--clip-left", "100%");
        } else if (cardLeft > scannerRight) {
          normalCard.style.setProperty("--clip-right", "0%");
          asciiCard.style.setProperty("--clip-left", "0%");
        }
        wrapper.removeAttribute("data-scanned");
      }
    });

    if (window.setScannerScanning) {
      window.setScannerScanning(anyScanningActive);
    }
  }

  populateCardLine() {
    this.cardLine.innerHTML = "";
    const cardsCount = 30;
    for (let i = 0; i < cardsCount; i++) {
      const cardWrapper = this.createCardWrapper(i);
      this.cardLine.appendChild(cardWrapper);
    }
  }
}

let cardStream;

function toggleAnimation() {
  (window.cardStream || cardStream)?.toggleAnimation();
}

function changeDirection() {
  (window.cardStream || cardStream)?.changeDirection();
}

class ParticleSystem {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particleCount = 400;
    this.canvas = document.getElementById("particleCanvas");

    this.init();

    this.visualDir = 1;   
    this.visualSpeed = 1;  
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      125,
      -125,
      1,
      1000
    );
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, 250);
    this.renderer.setClearColor(0x000000, 0);

    this.createParticles();

    this.animate();

    window.addEventListener("resize", () => this.onWindowResize());
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount);
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    const half = canvas.width / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, "rgba(255, 0, 0, 1)");
    gradient.addColorStop(0.1, "rgba(255, 0, 0, 0.8)");
    gradient.addColorStop(0.25, "rgba(100, 0, 0, 0.6)");
    gradient.addColorStop(1, "transparent");  

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      velocities[i] = Math.random() * 400 + 80;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    
    this.velocities = velocities;

    const alphas = new Float32Array(this.particleCount);
    for (let i = 0; i < this.particleCount; i++) {
      alphas[i] = (Math.random() * 8 + 2) / 10;
    }
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    this.alphas = alphas;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: texture },
        size: { value: 15.0 },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        varying vec3 vColor;
        uniform float size;
        
        void main() {
          vAlpha = alpha;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying float vAlpha;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const alphas    = this.particles.geometry.attributes.alpha.array;
      const time      = Date.now() * 0.001;

      const rawDir   = (typeof window.flowDir   === "number" ? window.flowDir   : 1);
      const rawSpeed = (typeof window.flowSpeed === "number" ? window.flowSpeed : 1);

      const targetDir = (rawDir >= 0 ? 1 : -1);

      if (typeof this.visualDir !== "number")   this.visualDir   = targetDir;
      if (typeof this.visualSpeed !== "number") this.visualSpeed = rawSpeed;

      this.visualDir   += (targetDir - this.visualDir)   * 0.20;
      this.visualSpeed += (rawSpeed   - this.visualSpeed) * 0.15;

      const paused = !!(window.cardStream && window.cardStream.isAnimating === false);

      const PAUSE_MAX = 0.45;
      const effectiveSpeed = paused
        ? Math.min(this.visualSpeed, PAUSE_MAX)
        : this.visualSpeed;

      const dirSign    = this.visualDir >= 0 ? 1 : -1;
      const speedScale = Math.max(0.2, effectiveSpeed) * 2.0;

      const dt         = 0.016;

      const leftBound  = -window.innerWidth / 2 - 100;
      const rightBound =  window.innerWidth / 2 + 100;

      for (let i = 0; i < this.particleCount; i++) {
        positions[i * 3] += dirSign * Math.abs(this.velocities[i]) * dt * speedScale;

        if (dirSign === 1 && positions[i * 3] > rightBound) {
          positions[i * 3] = leftBound;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
        } else if (dirSign === -1 && positions[i * 3] < leftBound) {
          positions[i * 3] = rightBound;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
        }

        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

        const twinkle = Math.floor(Math.random() * 10);
        if (twinkle === 1 && alphas[i] > 0)      alphas[i] -= 0.05;
        else if (twinkle === 2 && alphas[i] < 1) alphas[i] += 0.05;
        alphas[i] = Math.max(0, Math.min(1, alphas[i]));
      }

      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.geometry.attributes.alpha.needsUpdate    = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, 250);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }
  }
}

class ParticleScanner {
  constructor() {
    this.canvas = document.getElementById("scannerCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.animationId = null;

    this.w = window.innerWidth;
    this.h = 300;
    this.particles = [];
    this.count = 0;
    this.maxParticles = 800;
    this.intensity = 0.8;
    this.lightBarX = this.w / 2;
    this.lightBarWidth = 3;
    this.fadeZone = 60;

    this.scanTargetIntensity = 1.8;
    this.scanTargetParticles = 2500;
    this.scanTargetFadeZone = 35;

    this.scanningActive = false;

    this.baseIntensity = this.intensity;
    this.baseMaxParticles = this.maxParticles;
    this.baseFadeZone = this.fadeZone;

    this.currentIntensity = this.intensity;
    this.currentMaxParticles = this.maxParticles;
    this.currentFadeZone = this.fadeZone;
    this.transitionSpeed = 0.05;

    this.setupCanvas();
    this.createGradientCache();
    this.initParticles();
    this.animate();
    this._dirSmooth = 1;

    window.addEventListener("resize", () => this.onResize());
  }

  setupCanvas() {
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  onResize() {
    this.w = window.innerWidth;
    this.lightBarX = this.w / 2;
    this.setupCanvas();
  }

  createGradientCache() {
    this.gradientCanvas = document.createElement("canvas");
    this.gradientCtx = this.gradientCanvas.getContext("2d");
    this.gradientCanvas.width = 16;
    this.gradientCanvas.height = 16;

    const half = this.gradientCanvas.width / 2;
    const gradient = this.gradientCtx.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 44, 44, 0.8)");
    gradient.addColorStop(0.7, "rgba(255, 0, 0, 0.4)");
    gradient.addColorStop(1, "transparent");

    this.gradientCtx.fillStyle = gradient;
    this.gradientCtx.beginPath();
    this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
    this.gradientCtx.fill();
  }

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  createParticle() {
    const intensityRatio = this.intensity / this.baseIntensity;
    const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
    const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

    return {
      x:
        this.lightBarX +
        this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
      y: this.randomFloat(0, this.h),

      vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
      vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,

      radius: this.randomFloat(0.4, 1) * sizeMultiplier,
      alpha: this.randomFloat(0.6, 1),
      decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
      originalAlpha: 0,
      life: 1.0,
      time: 0,
      startX: 0,

      twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
      twinkleAmount: this.randomFloat(0.1, 0.25),
    };
  }

  initParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = this.createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      this.count++;
      this.particles[this.count] = particle;
    }
  }

  updateParticle(particle, dirSign) {
    particle.x += Math.abs(particle.vx) * dirSign;
    particle.y += particle.vy;
    particle.time++;

    particle.alpha =
      particle.originalAlpha * particle.life +
      Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;

    particle.life -= particle.decay;

    if (particle.x > this.w + 10 || particle.x < -10 || particle.life <= 0) {
      this.resetParticle(particle);

      particle.x = this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
      particle.x -= dirSign;
    }
  }


  resetParticle(particle) {
    particle.x =
      this.lightBarX +
      this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
    particle.y = this.randomFloat(0, this.h);
    particle.vx = this.randomFloat(0.2, 1.0);
    particle.vy = this.randomFloat(-0.15, 0.15);
    particle.alpha = this.randomFloat(0.6, 1);
    particle.originalAlpha = particle.alpha;
    particle.life = 1.0;
    particle.time = 0;
    particle.startX = particle.x;
  }

  drawParticle(particle) {
    if (particle.life <= 0) return;

    let fadeAlpha = 1;

    if (particle.y < this.fadeZone) {
      fadeAlpha = particle.y / this.fadeZone;
    } else if (particle.y > this.h - this.fadeZone) {
      fadeAlpha = (this.h - particle.y) / this.fadeZone;
    }

    fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

    this.ctx.globalAlpha = particle.alpha * fadeAlpha;
    this.ctx.drawImage(
      this.gradientCanvas,
      particle.x - particle.radius,
      particle.y - particle.radius,
      particle.radius * 2,
      particle.radius * 2
    );
  }

  drawLightBar() {
    const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
    verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    verticalGradient.addColorStop(
      this.fadeZone / this.h,
      "rgba(255, 255, 255, 1)"
    );
    verticalGradient.addColorStop(
      1 - this.fadeZone / this.h,
      "rgba(255, 255, 255, 1)"
    );
    verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    this.ctx.globalCompositeOperation = "lighter";

    const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
    if (!this.currentGlowIntensity) this.currentGlowIntensity = 1;
    this.currentGlowIntensity +=
      (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;

    const glowIntensity = this.currentGlowIntensity;
    const lineWidth = this.lightBarWidth;
    const glow1Alpha = this.scanningActive ? 1.0 : 0.8;
    const glow2Alpha = this.scanningActive ? 0.8 : 0.6;
    const glow3Alpha = this.scanningActive ? 0.6 : 0.4;

    let glow1Color = "255,80,80";
    let glow2Color = "180,0,0";
    let glow3Color = "120,0,0";
    let coreGradient = this.ctx.createLinearGradient(
    this.lightBarX - lineWidth / 2,
    0,
    this.lightBarX + lineWidth / 2,
    0
  );

  coreGradient.addColorStop(0, "rgba(180, 0, 0, 0)");
  coreGradient.addColorStop(0.3, `rgba(255, 60, 60, 0.6)`);
  coreGradient.addColorStop(0.5, `rgba(255, 100, 0, 0.8)`);
  coreGradient.addColorStop(0.7, `rgba(255, 60, 60, 0.6)`);
  coreGradient.addColorStop(1, "rgba(180, 0, 0, 0)");

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = coreGradient;

    const radius = 15;
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.lightBarX - lineWidth / 2,
      0,
      lineWidth,
      this.h,
      radius
    );
    this.ctx.fill();

    const glow1Gradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth * 2,
      0,
      this.lightBarX + lineWidth * 2,
      0
    );
    glow1Gradient.addColorStop(0, `rgba(${glow1Color}, 0)`);
    glow1Gradient.addColorStop(
      0.5,
      `rgba(${glow1Color}, ${0.8 * glowIntensity})`
    );
    glow1Gradient.addColorStop(1, `rgba(${glow1Color}, 0)`);

    this.ctx.globalAlpha = glow1Alpha;
    this.ctx.fillStyle = glow1Gradient;

    const glow1Radius = 25;
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.lightBarX - lineWidth * 2,
      0,
      lineWidth * 4,
      this.h,
      glow1Radius
    );
    this.ctx.fill();

    const glow2Gradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth * 4,
      0,
      this.lightBarX + lineWidth * 4,
      0
    );
    glow2Gradient.addColorStop(0, `rgba(${glow2Color}, 0)`);
    glow2Gradient.addColorStop(
      0.5,
      `rgba(${glow2Color}, ${0.4 * glowIntensity})`
    );
    glow2Gradient.addColorStop(1, `rgba(${glow2Color}, 0)`);

    this.ctx.globalAlpha = glow2Alpha;
    this.ctx.fillStyle = glow2Gradient;

    const glow2Radius = 35;
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.lightBarX - lineWidth * 4,
      0,
      lineWidth * 8,
      this.h,
      glow2Radius
    );
    this.ctx.fill();

    if (this.scanningActive) {
      const glow3Gradient = this.ctx.createLinearGradient(
        this.lightBarX - lineWidth * 8,
        0,
        this.lightBarX + lineWidth * 8,
        0
      );
      glow3Gradient.addColorStop(0, `rgba(${glow3Color}, 0)`);
      glow3Gradient.addColorStop(0.5, `rgba(${glow3Color}, 0.2)`);
      glow3Gradient.addColorStop(1, `rgba(${glow3Color}, 0)`);

      this.ctx.globalAlpha = glow3Alpha;
      this.ctx.fillStyle = glow3Gradient;

      const glow3Radius = 45;
      this.ctx.beginPath();
      this.ctx.roundRect(
        this.lightBarX - lineWidth * 8,
        0,
        lineWidth * 16,
        this.h,
        glow3Radius
      );
      this.ctx.fill();
    }

    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = verticalGradient;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  render() {
    const targetIntensity = this.scanningActive
      ? this.scanTargetIntensity
      : this.baseIntensity;
    const targetMaxParticles = this.scanningActive
      ? this.scanTargetParticles
      : this.baseMaxParticles;
    const targetFadeZone = this.scanningActive
      ? this.scanTargetFadeZone
      : this.baseFadeZone;

    const rawDir = (typeof window.flowDir === "number" ? window.flowDir : 1);
    const targetDir = rawDir >= 0 ? 1 : -1;
    this._dirSmooth += (targetDir - this._dirSmooth) * 0.25;
    const dirSign = this._dirSmooth >= 0 ? 1 : -1;

    this.currentIntensity +=
      (targetIntensity - this.currentIntensity) * this.transitionSpeed;
    this.currentMaxParticles +=
      (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
    this.currentFadeZone +=
      (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

    this.intensity = this.currentIntensity;
    this.maxParticles = Math.floor(this.currentMaxParticles);
    this.fadeZone = this.currentFadeZone;

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.clearRect(0, 0, this.w, this.h);

    this.drawLightBar();

    this.ctx.globalCompositeOperation = "lighter";
    for (let i = 1; i <= this.count; i++) {
      if (this.particles[i]) {
        this.updateParticle(this.particles[i], dirSign);
        this.drawParticle(this.particles[i]);
      }
    }

    const currentIntensity = this.intensity;
    const currentMaxParticles = this.maxParticles;

    if (Math.random() < currentIntensity && this.count < currentMaxParticles) {
      const particle = this.createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      this.count++;
      this.particles[this.count] = particle;
    }

    const intensityRatio = this.intensity / this.baseIntensity;

    if (intensityRatio > 1.1 && Math.random() < (intensityRatio - 1.0) * 1.2) {
      const particle = this.createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      this.count++;
      this.particles[this.count] = particle;
    }

    if (intensityRatio > 1.3 && Math.random() < (intensityRatio - 1.3) * 1.4) {
      const particle = this.createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      this.count++;
      this.particles[this.count] = particle;
    }

    if (intensityRatio > 1.5 && Math.random() < (intensityRatio - 1.5) * 1.8) {
      const particle = this.createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      this.count++;
      this.particles[this.count] = particle;
    }

    if (intensityRatio > 2.0 && Math.random() < (intensityRatio - 2.0) * 2.0) {
      const particle = this.createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      this.count++;
      this.particles[this.count] = particle;
    }

    if (this.count > currentMaxParticles + 200) {
      const excessCount = Math.min(15, this.count - currentMaxParticles);
      for (let i = 0; i < excessCount; i++) {
        delete this.particles[this.count - i];
      }
      this.count -= excessCount;
    }
  }

  animate() {
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  setScanningActive(active) {
    this.scanningActive = active;
  }

  getStats() {
    return {
      intensity: this.intensity,
      maxParticles: this.maxParticles,
      currentParticles: this.count,
      lightBarWidth: this.lightBarWidth,
      fadeZone: this.fadeZone,
      scanningActive: this.scanningActive,
      canvasWidth: this.w,
      canvasHeight: this.h,
    };
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.particles = [];
    this.count = 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cs = new CardStreamController();
  const ps = new ParticleSystem();
  const sc = new ParticleScanner();

  window.cardStream      = cs;
  window.particleSystem  = ps;
  window.particleScanner = sc;
  window.setScannerScanning = (active) => sc.setScanningActive(active);
  window.getScannerStats    = () => sc.getStats();
});
