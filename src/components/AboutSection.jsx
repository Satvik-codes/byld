import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const leftImageRef = useRef(null);
  const rightTextRef = useRef(null);
  const ctaRef = useRef(null);
  const smallImageRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Basic text split for headline
    const headline = headlineRef.current;
    if (headline) {
      const words = headline.innerText.split(' ');
      headline.innerHTML = '';
      words.forEach((word) => {
        if (!word) return;
        const wordContainer = document.createElement('span');
        wordContainer.className = 'word-container';
        const wordInner = document.createElement('span');
        wordInner.className = 'word';
        wordInner.innerText = word;
        wordContainer.appendChild(wordInner);
        headline.appendChild(wordContainer);
        headline.appendChild(document.createTextNode(' '));
      });
    }

    const ctx = gsap.context(() => {
      // Color transition from white to warm
      gsap.fromTo(sectionRef.current,
        { backgroundColor: '#ffffff' },
        {
          backgroundColor: 'hsl(50, 32%, 93%)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: true
          }
        }
      );

      // Timeline for entry animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      });

      // Label fade up
      tl.fromTo(labelRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
      // Headline staggered reveal
      .fromTo(headlineRef.current.querySelectorAll('.word'), 
        { y: '100%', opacity: 0 }, 
        { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power3.out' },
        "-=0.4"
      )
      // Left image scale/fade
      .fromTo(leftImageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
        "-=0.8"
      )
      // Right text paragraph staggered fade
      .fromTo(rightTextRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        "-=0.6"
      )
      // CTA Button
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        "-=0.4"
      );

      // Scroll Animation for Left Image (Architectural Interior)
      gsap.fromTo(leftImageRef.current,
        { clipPath: 'inset(15% 15% 15% 15%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: leftImageRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1.5
          }
        }
      );

      gsap.to(leftImageRef.current.querySelector('img'), {
        y: '15%',
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Scroll Animation for Bottom Accent Image (Furniture Detail)
      gsap.fromTo(smallImageRef.current, 
        { scale: 0.8, opacity: 0, y: 100 },
        { 
          scale: 1, 
          opacity: 1, 
          y: -50,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: smallImageRef.current,
            start: 'top 95%',
            end: 'center 40%',
            scrub: 1
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-top">
        <div className="about-label" ref={labelRef}>(About)</div>
        <h2 className="about-headline" ref={headlineRef}>
          We deliver physical environments that shape customer experience and directly improve the performance of our clients’ businesses.
        </h2>
      </div>

      <div className="about-middle">
        <div className="about-left" ref={leftImageRef}>
          <div className="image-wrapper">
            <img src="/images/architectural_interior.png" alt="Architectural Archway" />
          </div>
        </div>
        
        <div className="about-right">
          <div className="text-content" ref={rightTextRef}>
            <p>Our approach goes beyond surface-level aesthetics. We believe in creating spaces that resonate with human emotion while serving highly functional operational needs.</p>
            <p>Through careful spatial planning, material selection, and light manipulation, we transform conceptual ideas into stunning physical realities.</p>
            <p>Every detail is an opportunity to communicate your brand's unique narrative and deliver unforgettable experiences.</p>
          </div>
          
          <button className="cta-button" ref={ctaRef}>
            Learn more about us <span>&rarr;</span>
          </button>

          <div className="about-bottom-accent" ref={smallImageRef}>
            <img src="/images/furniture_detail.png" alt="Furniture Detail" />
          </div>
        </div>
      </div>
    </section>
  );
}
