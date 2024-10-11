import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConsultantCard from './ConsultationCard';

const consultants = [
  {
    id: 1,
    name: 'Anna Braun',
    rating: 4.8,
    reviews: 118,
    imageUrl: '/api/placeholder/48/48'
  },
  {
    id: 2,
    name: 'Dr. Mike Bredd',
    rating: 4.9,
    reviews: 204,
    imageUrl: '/api/placeholder/48/48'
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    rating: 4.7,
    reviews: 156,
    imageUrl: '/api/placeholder/48/48'
  }
];

const FlipCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleDrag = (_: any, info: any) => {
    if (info.offset.y < -50) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % consultants.length);
    } else if (info.offset.y > 50) {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + consultants.length) % consultants.length);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateX: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      rotateX: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      rotateX: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div className="relative min-h-20 w-full perspective">
      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDrag}
        className="touch-none"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{
              position: 'absolute',
              width: '100%'
            }}
          >
            <ConsultantCard consultant={consultants[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FlipCard;