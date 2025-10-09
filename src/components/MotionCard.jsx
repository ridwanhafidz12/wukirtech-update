import React from 'react';
import { motion } from 'framer-motion';

const MotionCard = ({ children, className, whileHover = {} }) => (
  <motion.div
    className={`bg-card/70 backdrop-blur-sm border border-border/20 rounded-2xl shadow-lg overflow-hidden flex flex-col ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    whileHover={whileHover}
  >
    {children}
  </motion.div>
);

export default MotionCard;