import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FeaturesSection.css';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ imageSrc, title, category, className = "" }) => {
  return (
    <div className={`feature-card ${className}`}>
      <div className="image-wrapper">
        <img src={imageSrc} alt={title} />
      </div>
      <div className="card-footer">
        <span className="card-title">{title}</span>
        <span className="card-category">{category}</span>
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade and slide up for feature cards
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section className="features-section" ref={sectionRef}>
      <div className="features-header">
        <h2 className="features-heading">features</h2>
        <a href="#" className="features-link">All projects &rarr;</a>
      </div>

      <div className="features-grid">
        <div className="features-left-column">
          <FeatureCard 
            imageSrc="/images/feature_main.png"
            title="Grand Atrium"
            category="Public Spaces"
            className="main-card"
          />
        </div>
        
        <div className="features-right-column">
          <div className="right-top-row">
            <FeatureCard 
              imageSrc="/images/feature_top_1.png"
              title="Toscana"
              category="Restaurants"
            />
            <FeatureCard 
              imageSrc="/images/feature_top_2.png"
              title="Aura Boutique"
              category="Retail"
            />
          </div>
          <div className="right-bottom-row">
            <FeatureCard 
              imageSrc="/images/feature_bottom.png"
              title="Coastal Villa"
              category="Residential"
              className="wide-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
