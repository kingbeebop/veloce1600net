import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LoadingScreen: React.FC<{ loadingComplete: boolean; onAnimationComplete: () => void; style?: React.CSSProperties }> = ({
  loadingComplete,
  onAnimationComplete,
  style,
}) => {
  const [animationState, setAnimationState] = useState({
    fadeIn: false,
    slideUp: false,
    showServices: false,
    showEnter: false,
    exitAnimation: false,
  });

  useEffect(() => {
    if (loadingComplete) {
      const fadeInTimeout = setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, fadeIn: true }));
      }, 100);

      return () => clearTimeout(fadeInTimeout);
    }
  }, [loadingComplete]);

  useEffect(() => {
    if (animationState.fadeIn) {
      const slideUpTimeout = setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, slideUp: true }));
      }, 2000);

      return () => clearTimeout(slideUpTimeout);
    }
  }, [animationState.fadeIn]);

  useEffect(() => {
    if (animationState.slideUp) {
      const servicesTimeout = setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, showServices: true }));
      }, 1000);

      return () => clearTimeout(servicesTimeout);
    }
  }, [animationState.slideUp]);

  useEffect(() => {
    if (animationState.showServices) {
      const showEnterTimeout = setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, showEnter: true }));
      }, 3000);

      return () => clearTimeout(showEnterTimeout);
    }
  }, [animationState.showServices]);

  const handleEnterClick = () => {
    setAnimationState((prev) => ({ ...prev, exitAnimation: true }));
    setTimeout(() => {
      onAnimationComplete(); 
    }, 1000); 
  };

  if (animationState.exitAnimation) return null;

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: animationState.exitAnimation ? 0 : 1 }}
      transition={{ duration: 1 }}
      style={{
        backgroundColor: 'black',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        ...style, // Merging the style prop
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 3 }}
        animate={{
          opacity: animationState.fadeIn ? 1 : 0,
          scale: animationState.slideUp ? 1 : 1,
          y: animationState.slideUp ? '-30%' : '0%',
        }}
        transition={{
          duration: animationState.fadeIn ? 2 : 0,
          ease: [0.6, -0.05, 0.01, 0.99],
        }}
        style={{
          position: 'relative',
          zIndex: 10000,
        }}
      >
        <Image
          src="/veloce_logo.png"
          alt="Logo"
          width={400}
          height={200}
          layout="intrinsic"
        />
      </motion.div>

      {/* Services */}
      {animationState.showServices && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Sales
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ margin: '0 10px' }}
          >
            |
          </motion.span>
          <motion.span
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Collection Management
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{ margin: '0 10px' }}
          >
            |
          </motion.span>
          <motion.span
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Service
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            style={{ margin: '0 10px' }}
          >
            |
          </motion.span>
          <motion.span
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
          >
            Media
          </motion.span>
        </motion.div>
      )}

      {/* Enter Button (positioned higher to split the distance) */}
      {animationState.showEnter && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '25%', // Adjusted from '50px' to around halfway between logo/services and the bottom
            padding: '15px 30px',
            backgroundColor: 'transparent',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: '2px solid white',
            zIndex: 10001,
          }}
          onClick={handleEnterClick}
        >
          Enter
        </motion.button>
      )}

      {/* Exit Slide-up Animation */}
      {animationState.exitAnimation && (
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'black',
            zIndex: 9999,
          }}
        />
      )}
    </motion.div>
  );
};

export default LoadingScreen;
