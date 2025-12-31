
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-12 px-4 text-center"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="inline-block p-2 px-6 rounded-full glass mb-6 shadow-sm border-white/40"
      >
        <span className="text-sky-600 font-bold tracking-widest text-[10px] uppercase">
          AI-Powered Linguistics
        </span>
      </motion.div>
      <h1 className="text-5xl md:text-7xl font-black text-sky-950 mb-6 tracking-tighter">
        Transcrever <span className="text-blue-500 relative">
          Online
          <motion.span 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-1 left-0 h-2 bg-blue-400/20 -z-10"
          />
        </span>
      </h1>
      <p className="text-sky-800/80 max-w-2xl mx-auto text-xl font-light leading-relaxed">
        Dê uma nova vida ao seu texto. Utilizamos IA para encontrar os <span className="font-semibold text-sky-900">sinônimos perfeitos</span> e elevar seu vocabulário.
      </p>
    </motion.header>
  );
};

export default Header;
