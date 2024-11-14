import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';  // Import de motion pour l'animation
import Myannee from '../annee/anneeUniv';

const NavigationCard = ({ title, description, buttonText, onClick }) => (
  <div className="w-full bg-white dark:bg-gray-600  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
    <div className="text-center">
      <h3 className="text-xl font-semibold dark:text-white text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-white mb-4">{description}</p>
      <div className="flex justify-center">
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {buttonText}
        </button>
      </div>
    </div>
  </div>
);

function AffichageNavigation() {
  const [selectedId, setSelectedId] = useState(null);

  // Définir les éléments de navigation
  const navigationItems = [
    {
      title: "Année Universitaire",
      description: "Créez et gérez les années universitaires pour votre établissement",
      buttonText: "Créer une année universitaire",
      id: 'annee',
    },
    {
      title: "Profil Utilisateur",
      description: "Gérez vos informations personnelles et vos préférences",
      buttonText: "Gérer mon profil",
    }
  ];

  // Fonction qui gère l'affichage du composant Myannee
  const handleNavigation = (id) => {
    setSelectedId(id); // Met à jour l'ID sélectionné
  };

  return (
    <div className="container mx-auto p-6 ">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 font-serif dark:text-white">
        Tableau de bord administratif
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-serif">
        {navigationItems.map((item, index) => (
          <NavigationCard key={index} {...item} onClick={() => handleNavigation(item.id)} />
        ))}
      </div>

      {/* Affichage conditionnel basé sur l'ID sélectionné */}
      {selectedId === 'annee' && (
        <motion.div
          className="flex justify-center mt-8 z-40"
          initial={{ opacity: 0, y: 20 }}   // Animation initiale
          animate={{ opacity: 1, y: 0 }}    // Animation pendant l'apparition
          exit={{ opacity: 0, y: -20 }}     // Animation lors de la disparition
          transition={{ duration: 0.5 }}    // Durée de l'animation
        >
          <Myannee />
        </motion.div>
      )}
    </div>
  );
}

export default AffichageNavigation;
