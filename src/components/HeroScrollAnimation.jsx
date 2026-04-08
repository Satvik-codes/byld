import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollFrames } from '../hooks/useScrollFrames';

gsap.registerPlugin(ScrollTrigger);

export default function HeroScrollAnimation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Custom hook to load images (now with 240 frames)
  const { loadedImages, firstFrame, progress, isLoaded } = useScrollFrames('/sequence/ezgif-frame-', 220, 'jpg');

  // Draw the current frame on the canvas considering object-fit: cover
  const renderFrame = (img, ctx, canvas) => {
    if (!img || !ctx || !canvas) return;

    // Canvas logical dimensions
    const cw = canvas.width;
    const ch = canvas.height;
    
    // Image intrinsic dimensions
    const iw = img.width;
    const ih = img.height;

    // Calculate aspect ratios
    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;

    let sx = 0, sy = 0, sWidth = iw, sHeight = ih;

    // Cover logic
    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      sWidth = iw;
      sHeight = iw / canvasRatio;
      sy = (ih - sHeight) / 2;
    } else {
      // Canvas is taller than image
      sHeight = ih;
      sWidth = ih * canvasRatio;
      sx = (iw - sWidth) / 2;
    }

    // Clear canvas
    ctx.clearRect(0, 0, cw, ch);
    // Draw image using cover logic
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
  };

  useLayoutEffect(() => {
    if (!isLoaded || !canvasRef.current || loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Handle canvas resizing for High DPI
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Adjust for device pixel ratio for sharper images
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Ensure CSS size fits the container
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // If ScrollTrigger exists, it will trigger an update, but we should do an initial render
      // Let's rely on ScrollTrigger's initial onUpdate, but forcefully draw frame 0 just in case
      renderFrame(loadedImages[0], context, canvas);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // call initially

    // Setup GSAP frame tracking object
    const frameObj = { frame: 0 };
    
    // Create the ScrollTrigger animation
    let lastRenderedFrame = -1;
    
    const scrollAnimation = gsap.to(frameObj, {
      frame: loadedImages.length - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
      onUpdate: () => {
        const frameIndex = Math.round(frameObj.frame);
        if (frameIndex !== lastRenderedFrame) {
          lastRenderedFrame = frameIndex;
          requestAnimationFrame(() => {
            const img = loadedImages[frameIndex];
            if (img) {
              renderFrame(img, context, canvas);
            }
          });
        }
      }
    });

    // Fade out UI by frame 40 (roughly 1/3 of the scroll duration)
    const uiFade = gsap.to('.navbar, .hero-overlay', {
      opacity: 0,
      pointerEvents: 'none',
      ease: 'power1.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(window.innerHeight * 8) * (40 / 220)}px`, // Fade out by frame 40 (of 220)
        scrub: 1,
      }
    });

    // Make sure the first frame is definitely drawn once ScrollTrigger analyzes position
    // (GSAP sometimes processes early)
    // Initial draw if first frame is available
    if (firstFrame) {
      renderFrame(firstFrame, context, canvas);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollAnimation.kill();
      // Only kill ScrollTriggers associated with this component, 
      // but in this case we can just clear memory for safety
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, loadedImages]);

  return (
    <div 
      ref={containerRef} 
      className="hero-scroll-container" 
      style={{ height: '800vh', position: 'relative', width: '100%' }}
    >
      <div 
        className="sticky-container" 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          width: '100%',
          overflow: 'hidden', 
          backgroundColor: '#000' 
        }}
      >
        {/* Navbar Overlay - now inside sticky container */}
        <nav className="navbar">
          <div className="logo">BYLD</div>
          <div className="nav-links">
            <a href="#" className="nav-link">Explore</a>
            <a href="#" className="nav-link">Features <span style={{ fontSize: '0.6rem' }}>▼</span></a>
            <a href="#" className="nav-link">Pricing <span style={{ fontSize: '0.6rem' }}>▼</span></a>
            <button className="btn-signin">Sign In</button>
          </div>
        </nav>

        {/* Hero Content Overlay - now inside sticky container */}
        <div className="hero-overlay">
          <h1 className="hero-title">Design Without Limits</h1>
          <p className="hero-subtitle">From inspiration to execution, redefined</p>
          <button className="btn-getstarted">Get Started</button>
        </div>

        {!isLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 10,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <p style={{ fontSize: '1rem', marginBottom: '1.5rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#999' }}>
              Loading Cinematic Experience
            </p>
            <div style={{ width: '240px', height: '1px', background: '#333', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                background: '#fff',
                width: `${progress * 100}%`,
                transition: 'width 0.2s linear'
              }} />
            </div>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          style={{
            display: (isLoaded || firstFrame) ? 'block' : 'none',
            opacity: (isLoaded || firstFrame) ? 1 : 0,
            transition: 'opacity 0.8s ease-out'
          }}
        />
      </div>
    </div>
  );
}
