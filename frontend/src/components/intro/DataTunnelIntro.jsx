import React, { useEffect, useRef, useState } from 'react';
import HackerOverlay from "./HackerOverlay";
import RecoveryScreen from "./RecoveryScreen";
import { DATAFRAGMENTS, HACKERSCRIPT, RECOVERYSCRIPT } from './dataTunnel.constants';
const DATA_FRAGMENTS = DATAFRAGMENTS

const HACKER_SCRIPT = HACKERSCRIPT

const RECOVERY_SCRIPT = RECOVERYSCRIPT

const DataTunnelIntro = ({onFinish }) => {
  const canvasRef = useRef(null);
  const bufferCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showSkip, setShowSkip] = useState(true);
  const [scriptLines, setScriptLines] = useState([]);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryLines, setRecoveryLines] = useState([]);
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    const bufferCtx = bufferCanvas.getContext('2d', { willReadFrequently: true });
    bufferCanvasRef.current = bufferCanvas;

    const centerX = width / 2;
    const centerY = height / 2;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 1000 + 800;

        this.x = Math.cos(angle) * distance;
        this.y = Math.sin(angle) * distance;
        this.z = Math.random() * 500 + 500;

        this.dirX = -Math.cos(angle);
        this.dirY = -Math.sin(angle);

        this.text = DATA_FRAGMENTS[Math.floor(Math.random() * DATA_FRAGMENTS.length)];
        this.speed = Math.random() * 1 + 0.5;

        this.falling = false;
        this.fallVelocity = 0;
        this.rotationSpeed = 0;
        this.rotation = 0;
      }

      update(speed, datamosh) {
        if (datamosh && !this.falling && Math.random() > 0.95) {
          this.falling = true;
          this.fallVelocity = Math.random() * 3 + 2;
          this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        }

        if (this.falling) {
          this.y += this.fallVelocity;
          this.fallVelocity += 0.5;
          this.rotation += this.rotationSpeed;
          this.x += (Math.random() - 0.5) * 3;

          if (this.y > 2000) {
            this.reset();
          }
          return;
        }

        this.x += this.dirX * this.speed * speed;
        this.y += this.dirY * this.speed * speed;

        const currentDistance = Math.sqrt(this.x * this.x + this.y * this.y);
        if (currentDistance < 150) {
          this.reset();
        }
      }

      draw(ctx, centerX, centerY, cameraOffset, glitchState) {
        const scale = 500 / (500 + this.z);
        let x2d = centerX + (this.x * scale) + cameraOffset.x;
        let y2d = centerY + (this.y * scale) + cameraOffset.y;

        const distanceFromCenter = Math.sqrt(this.x * this.x + this.y * this.y);
        const proximityFactor = Math.min(distanceFromCenter / 800, 1);
        const size = Math.max(6, 18 * scale * proximityFactor);
        const opacity = Math.min(1, scale * proximityFactor * 1.5);

        if (distanceFromCenter < 180 && !this.falling) return;

        const hue = distanceFromCenter > 400 ? 180 : 140;

        ctx.save();

        if (glitchState.broadcastActive && Math.random() > 0.6) {
          x2d += (Math.random() - 0.5) * 8;
          y2d += (Math.random() - 0.5) * 6;

          ctx.translate(x2d, y2d);
          ctx.rotate(this.rotation);
          ctx.font = size + 'px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.globalAlpha = opacity * 0.6;
          ctx.fillStyle = 'rgba(255, 0, 0, ' + (opacity * 0.6) + ')';
          ctx.fillText(this.text, -2, 0);

          ctx.fillStyle = 'rgba(0, 255, 255, ' + (opacity * 0.6) + ')';
          ctx.fillText(this.text, 2, 0);

          ctx.globalAlpha = opacity;
          ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, ' + opacity + ')';
          ctx.fillText(this.text, 0, 0);
        } else {
          ctx.translate(x2d, y2d);
          ctx.rotate(this.rotation);
          ctx.font = size + 'px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = opacity;
          ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, ' + opacity + ')';
          ctx.fillText(this.text, 0, 0);

          if (proximityFactor > 0.7 && !this.falling) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'hsla(' + hue + ', 100%, 50%, 0.6)';
            ctx.fillText(this.text, 0, 0);
          }
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < 200; i++) {
      particlesRef.current.push(new Particle());
    }

    const targetMouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX / width - 0.5) * 2;
      targetMouse.y = (e.clientY / height - 0.5) * 2;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouse.x = (e.touches[0].clientX / width - 0.5) * 2;
        targetMouse.y = (e.touches[0].clientY / height - 0.5) * 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let startTime = Date.now();
    let speed = 1;
    let scriptStarted = false;
    let blackoutStarted = false;

    const applyBroadcastGlitch = (ctx, width, height, intensity) => {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let row = 0; row < height; row += Math.floor(Math.random() * 20) + 5) {
        if (Math.random() > 0.7) {
          const shift = Math.floor((Math.random() - 0.5) * 100 * intensity);
          const rowData = [];

          for (let x = 0; x < width; x++) {
            const idx = (row * width + x) * 4;
            rowData.push(data[idx], data[idx + 1], data[idx + 2], data[idx + 3]);
          }

          for (let x = 0; x < width; x++) {
            const srcX = (x - shift + width) % width;
            const srcIdx = srcX * 4;
            const destIdx = (row * width + x) * 4;
            data[destIdx] = rowData[srcIdx];
            data[destIdx + 1] = rowData[srcIdx + 1];
            data[destIdx + 2] = rowData[srcIdx + 2];
            data[destIdx + 3] = rowData[srcIdx + 3];
          }
        }
      }

      if (Math.random() > 0.6) {
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() > 0.8) {
            const offset = Math.floor((Math.random() - 0.5) * 20 * intensity) * 4;
            if (i + offset >= 0 && i + offset < data.length) {
              data[i] = data[i + offset];
            }
            if (i - offset >= 0 && i - offset < data.length) {
              data[i + 2] = data[i - offset + 2];
            }
          }
        }
      }

      for (let i = 0; i < 5; i++) {
        if (Math.random() > 0.5) {
          const bandY = Math.floor(Math.random() * height);
          const bandHeight = Math.floor(Math.random() * 30) + 10;

          for (let y = bandY; y < bandY + bandHeight && y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4;
              const noise = Math.random() * 100 * intensity;
              data[idx] += noise;
              data[idx + 1] += noise;
              data[idx + 2] += noise;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const applyDatamoshRegions = (ctx, width, height, fullScreen) => {
      if (fullScreen) {
        applyFullDatamosh(ctx, width, height);
      } else {
        const regions = [
          { x: 0, y: 0, w: width * 0.3, h: height * 0.3 },
          { x: width * 0.7, y: 0, w: width * 0.3, h: height * 0.3 },
          { x: 0, y: height * 0.7, w: width * 0.3, h: height * 0.3 },
        ];

        regions.forEach(region => {
          if (Math.random() > 0.5) {
            const blockSize = 30;
            for (let i = 0; i < 3; i++) {
              const srcX = region.x + Math.random() * (region.w - blockSize);
              const srcY = region.y + Math.random() * (region.h - blockSize);
              const destX = region.x + Math.random() * (region.w - blockSize);
              const destY = region.y + Math.random() * (region.h - blockSize);

              try {
                const blockData = ctx.getImageData(srcX, srcY, blockSize, blockSize);
                ctx.putImageData(blockData, destX, destY);
              } catch (e) { }
            }

            try {
              const sliceY = region.y + Math.random() * region.h;
              const sliceHeight = 20;
              const sliceData = ctx.getImageData(region.x, sliceY, region.w, sliceHeight);
              ctx.globalAlpha = 0.6;
              ctx.putImageData(sliceData, region.x + (Math.random() - 0.5) * 30, sliceY + 10);
              ctx.globalAlpha = 1;
            } catch (e) { }
          }
        });
      }
    };

    const applyFullDatamosh = (ctx, width, height) => {
      const blockSize = 40;
      for (let i = 0; i < 15; i++) {
        const srcX = Math.floor(Math.random() * (width / blockSize)) * blockSize;
        const srcY = Math.floor(Math.random() * (height / blockSize)) * blockSize;
        const destX = Math.floor(Math.random() * (width / blockSize)) * blockSize;
        const destY = Math.floor(Math.random() * (height / blockSize)) * blockSize;

        try {
          const blockData = ctx.getImageData(srcX, srcY, blockSize, blockSize);
          ctx.putImageData(blockData, destX, destY);
        } catch (e) { }
      }

      const numSlices = 20;
      for (let i = 0; i < numSlices; i++) {
        const sliceY = Math.floor(Math.random() * height);
        const sliceHeight = Math.floor(Math.random() * 40) + 20;
        const displacement = (Math.random() - 0.5) * 150;
        const verticalStretch = Math.random() * 30 + 10;

        try {
          const sliceData = ctx.getImageData(0, sliceY, width, sliceHeight);
          ctx.putImageData(sliceData, displacement, sliceY + verticalStretch);

          ctx.globalAlpha = 0.3;
          ctx.putImageData(sliceData, displacement / 2, sliceY + verticalStretch / 2);
          ctx.globalAlpha = 1;
        } catch (e) { }
      }

      // RGB Channel Separation
      const separation = 15;
      const originalData = ctx.getImageData(0, 0, width, height);
      const separated = ctx.createImageData(width, height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;

          const rIdx = (y * width + Math.max(0, x - separation)) * 4;
          separated.data[idx] = originalData.data[rIdx];

          separated.data[idx + 1] = originalData.data[idx + 1];

          const bIdx = (y * width + Math.min(width - 1, x + separation)) * 4;
          separated.data[idx + 2] = originalData.data[bIdx + 2];

          separated.data[idx + 3] = originalData.data[idx + 3];
        }
      }

      ctx.putImageData(separated, 0, 0);

      // Colored compression artifacts
      for (let i = 0; i < 30; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const size = Math.floor(Math.random() * 60) + 20;

        ctx.fillStyle = 'rgba(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', 0.3)';
        ctx.fillRect(x, y, size, size);
      }
    };

    const animate = () => {
    

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 20000, 1);

      const lerpFactor = 0.1;
      currentMouse.x += (targetMouse.x - currentMouse.x) * lerpFactor;
      currentMouse.y += (targetMouse.y - currentMouse.y) * lerpFactor;

      const cameraOffset = {
        x: currentMouse.x * 150,
        y: currentMouse.y * 150
      };

      speed = 1.5 + progress * 10;

      const broadcastGlitch1 = elapsed >= 10000 && elapsed < 10800;
      const broadcastGlitch2 = elapsed >= 13000 && elapsed < 14000;
      const broadcastGlitch3 = elapsed >= 16500 && elapsed < 17500;

      const smallDatamosh1 = elapsed >= 10500 && elapsed < 11000;
      const smallDatamosh2 = elapsed >= 13500 && elapsed < 14000;
      const smallDatamosh3 = elapsed >= 17000 && elapsed < 17500;

      const catastrophicDatamosh = elapsed >= 19000 && elapsed < 21000;
      const blackoutPhase = elapsed >= 21000;

      const isBroadcastGlitching = broadcastGlitch1 || broadcastGlitch2 || broadcastGlitch3;
      const isSmallDatamosh = smallDatamosh1 || smallDatamosh2 || smallDatamosh3;

      // Start hacker script on second glitch
      if (broadcastGlitch2 && !scriptStarted) {
        console.log('Hacker script starting');
        scriptStarted = true;
        let index = 0;
        const typeScript = setInterval(() => {
          if (index < HACKER_SCRIPT.length) {
            setScriptLines(prev => [...prev, HACKER_SCRIPT[index]]);
            index++;
          } else {
            clearInterval(typeScript);
          }
        }, 300);
      }

      // Blackout and recovery phase
      if (blackoutPhase && !blackoutStarted) {
        blackoutStarted = true;
        setShowRecovery(true);

        let index = 0;
        const typeRecovery = setInterval(() => {
          if (index < RECOVERY_SCRIPT.length) {
            setRecoveryLines(prev => [...prev, RECOVERY_SCRIPT[index]]);
            index++;
          } else {
            clearInterval(typeRecovery);
            setTimeout(() => {
              setShowHome(true);
              setIsComplete(true);
            }, 1500);
          }
        }, 400);
        return;
      }

      const glitchState = {
        broadcastActive: isBroadcastGlitching
      };

      if (catastrophicDatamosh) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      }
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.forEach(particle => {
        particle.update(speed, catastrophicDatamosh);
        particle.draw(ctx, centerX, centerY, cameraOffset, glitchState);
      });

      if (isBroadcastGlitching && Math.random() > 0.2) {
        const intensity = 0.8;
        applyBroadcastGlitch(ctx, width, height, intensity);
      }

      if (isSmallDatamosh && Math.random() > 0.4) {
        applyDatamoshRegions(ctx, width, height, false);
      }

      if (catastrophicDatamosh && Math.random() > 0.3) {
        applyDatamoshRegions(ctx, width, height, true);
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      for (let i = 0; i < height; i += 2) {
        ctx.fillRect(0, i, width, 1);
      }

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      bufferCanvas.width = width;
      bufferCanvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      particlesRef.current = [];
    };
  }, []);

  if (showHome) {
    return onFinish();
  }
  if (showRecovery) {
    return <RecoveryScreen recoveryLines={recoveryLines} />;
  }

  return (
    <>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        />
      </div>

      <HackerOverlay scriptLines={scriptLines} />
    </>
  );
};

export default DataTunnelIntro;