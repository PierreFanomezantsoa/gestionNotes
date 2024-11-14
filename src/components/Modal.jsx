import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  return (
    <div
      className="fixed -inset-96 bg-black bg-opacity-50  flex justify-center items-center z-50 " // Ajout d'un flou léger
      id="wrapper"
      onClick={handleClose}
    >
      <motion.div
        className="w-[700px] flex flex-col"
        initial={{ opacity: 0, y: -200 }} // Starts from above the view
        animate={{ opacity: 1, y: 0 }} // Moves down to original position
        exit={{ opacity: 0, y: -200 }} // Optional: exit animation
        transition={{ duration: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
      >
        {/* Close Button with animation */}
        <motion.button
          onClick={onClose}
          className="text-gray-300 text-xl place-self-end hover:text-white hover:bg-red-600 bg-white w-7 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          x
        </motion.button>

        {/* Modal Content with simultaneous entrance */}
        <motion.div
          className="bg-white p-2 rounded"
          initial={{ opacity: 0, y: -20 }} // Start position slightly above
          animate={{ opacity: 1, y: 0 }} // Moves to original position
          exit={{ opacity: 0, y: -20 }} // Optional: exit animation
          transition={{ duration: 0.3 }} // Same duration for consistency
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Modal;
