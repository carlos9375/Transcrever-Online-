
import React from 'react';
import { motion } from 'framer-motion';

const FloatingShapes: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-20 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"
      />
    </div>
  );
};

export default FloatingShapes;
