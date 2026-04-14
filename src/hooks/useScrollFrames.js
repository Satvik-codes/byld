import { useState, useEffect } from 'react';

/**
 * Custom hook to preload a sequence of images for frame-by-frame animation.
 * 
 * @param {string} prefix - The public path and filename prefix (e.g., '/sequence/ezgif-frame-')
 * @param {number} totalFrames - The total number of frames to load
 * @param {string} extension - The image extension (e.g., 'jpg')
 * @returns {object} - { loadedImages: HTMLImageElement[], progress: number, isLoaded: boolean }
 */
export function useScrollFrames(prefix = '/sequence/ezgif-frame-', totalFrames = 120, extension = 'jpg') {
  const [loadedImages, setLoadedImages] = useState([]);
  const [firstFrame, setFirstFrame] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const images = [];
    let isCancelled = false;

    const padNumber = (num, size) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    const loadImages = async () => {
      // Initialize an array with the correct size
      const imageArray = new Array(totalFrames).fill(null);
      setLoadedImages(imageArray);
      
      const imagePromises = [];

      for (let i = 1; i <= totalFrames; i++) {
        const indexStr = padNumber(i, 3);
        const url = `${prefix}${indexStr}.${extension}`;
        
        const img = new Image();
        img.src = url;
        
        const p = new Promise((resolve) => {
          img.onload = () => {
            if (!isCancelled) {
              imageArray[i - 1] = img;
              loadedCount++;
              
              // Only trigger a state update periodically or when needed
              setProgress(loadedCount / totalFrames);
              
              if (i === 1) {
                setFirstFrame(img);
              }
              resolve();
            }
          };
          img.onerror = () => {
            console.error(`Error loading image: ${url}`);
            if (!isCancelled) resolve();
          };
        });
        imagePromises.push(p);
      }

      await Promise.all(imagePromises);

      if (!isCancelled) {
        // Force the final reference update if needed, though they are stored in the array
        setLoadedImages([...imageArray]);
        setIsLoaded(true);
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [prefix, totalFrames, extension]);

  return { loadedImages, firstFrame, progress, isLoaded };
}
