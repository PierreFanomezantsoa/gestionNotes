import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isVisible, onClose, children }) => {
  // Si la modal n'est pas visible, on ne retourne rien
  if (!isVisible) return null;

  // Fonction pour fermer la modal en cliquant en dehors de celle-ci
  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  // Utilisation de useEffect pour fermer la modal après 20 secondes
  useEffect(() => {
    if (isVisible) {
      // Déclenche le timeout pour fermer la modal après 20 secondes
      const timer = setTimeout(() => {
        onClose();  // Ferme la modal après 20 secondes
      }, 20000);  // 20000 ms = 20 secondes

      // Cleanup du timer quand la modal n'est plus visible ou qu'elle est fermée avant
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]); // Le useEffect se réexécute lorsque isVisible change

  return (
    <div
      className="fixed -inset-96 bg-black bg-opacity-5 flex justify-center items-center z-40 "
      id="wrapper"
      onClick={handleClose}  // Ferme la modal si on clique à l'extérieur
    >
      <motion.div
        className="w-[700px] flex flex-col "
        initial={{ opacity: 0, y: -200 }} // Démarre depuis en haut
        animate={{ opacity: 1, y: 0 }} // Animation vers la position d'origine
        exit={{ opacity: 0, y: -200 }} // Optionnel: animation de sortie
        transition={{ duration: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
      >
        {/* Bouton de fermeture avec animation */}
        <motion.button
          onClick={onClose}  // Permet de fermer la modal
          className="text-gray-400 text-xl place-self-end hover:text-white hover:bg-red-600 bg-white w-7 boder border-gray-300 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          x
        </motion.button>

        {/* Contenu de la modal */}
        <motion.div
          className="bg-white p-2 rounded border border-gray-300"
          initial={{ opacity: 0, y: -20 }} // Animation d'entrée
          animate={{ opacity: 1, y: 0 }} // Position finale
          exit={{ opacity: 0, y: -20 }} // Optionnel: animation de sortie
          transition={{ duration: 0.3 }} // Durée de l'animation
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Modal;
