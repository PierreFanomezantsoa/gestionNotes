import React, { useState, useEffect } from 'react';
import { FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import Modal from '../../components/ModalAlerte';

const AnneeUniversitaire = () => {
  const [affichageanne, setAnneeUniv] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [newAnnee, setNewAnnee] = useState({ ref_annee: '', annee: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [editAnnee, setEditAnnee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmSuppression, setSuppression] = useState(false);
  const [confirmAjou, setAjout] = useState(false);
  const [confirModif, setModif] = useState(false);
  const [suppression, setSelectedProductId] = useState(null);

  // Méthode affichage des années
  const affichageAnne = async () => {
    try {
      const resultat = await axios.get('http://localhost:3000/api/annee');
      setAnneeUniv(resultat.data);
    } catch (err) {
      console.log('Erreur : ', err);
    }
  };

  useEffect(() => {
    affichageAnne();
  }, []);

  // Création d'une nouvelle année universitaire
// Création d'une nouvelle année universitaire
const handleCreateAnnee = async () => {
  if (!newAnnee.annee) return;

  try {
    // Tentative de création de l'année
    const response = await axios.post('http://localhost:3000/api/annee/insertion', { annee: newAnnee.annee });

    // Vérifier si la réponse est réussie
    if (response.status === 201) {
      setAjout(true);
      affichageAnne();
      console.log(response.data);

      // Réinitialisation des champs et fermeture du formulaire
      setNewAnnee({ ref_annee: '', annee: '' });
      setShowForm(false);
    }
  } catch (err) {
    // Vérifier si l'erreur vient de la réponse du serveur (400, 500, etc.)
    if (err.response) {
      // Si l'erreur a une réponse du serveur, afficher le message
      alert(`Erreur : ${err.response.data.message || "Une erreur s'est produite"}`);
    } else {
      // Erreur côté client (par exemple, problème réseau)
      console.log('Erreur lors de la création :', err);
      alert("Erreur lors de la création : problème de connexion");
    }
  }
};

  // Mise à jour d'une année universitaire
  const handleUpdateAnnee = async () => {
    if (!editAnnee) return;
    try {
      await axios.put(`http://localhost:3000/api/annee/modif/${editAnnee.ref_annee}`, editAnnee);
      setModif(true);
      affichageAnne();
      setIsEdit(false);
      setEditAnnee(null);
      setShowForm(false);
    } catch (err) {
      console.log('Erreur lors de la mise à jour :', err);
    }
  };

    // Afficher la modale de confirmation de suppression
  const handleDeleteShow = (productId) => {
    setSelectedProductId(productId);
    setSuppression(true);// Afficher la modale de confirmation
  };
  // Suppression d'une année universitaire
  const handleDeleteAnnee = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/annee/delete/${suppression}`);
        affichageAnne();
        setSuppression(false);
      } catch (err) {
        console.log('Erreur lors de la suppression :', err);
      }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnees = affichageanne.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(affichageanne.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-1">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 font-serif">Gestion des Années Universitaires</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setIsEdit(false);
              setEditAnnee(null);
              setNewAnnee({ annee: '' }); // No need to set ref_annee
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 font-serif"
          >
            Nouvelle Année
          </button>
        </div>

        {/* Formulaire de création/modification */}
        {showForm && (
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Référence
                </label>
                <input
                  type="text"
                  value={isEdit ? editAnnee.ref_annee : newAnnee.ref_annee}
                  onChange={(e) => isEdit 
                    ? setEditAnnee({...editAnnee, ref_annee: e.target.value})
                    : setNewAnnee({...newAnnee, ref_annee: e.target.value})
                  }
                  placeholder="Ex: AU-2023"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année
                </label>
                <input
                  type="text"
                  value={isEdit ? editAnnee.annee : newAnnee.annee}
                  onChange={(e) => isEdit
                    ? setEditAnnee({...editAnnee, annee: e.target.value})
                    : setNewAnnee({...newAnnee, annee: e.target.value})
                  }
                  placeholder="Ex: 2023-2024"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEdit(false);
                  setEditAnnee(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 rounded transition duration-300"
              >
                Annuler
              </button>
              <button
                onClick={isEdit ? handleUpdateAnnee : handleCreateAnnee}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                {isEdit ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        )}

        {/* Tableau des années universitaires avec pagination */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-500">
                <th className="px-6 py-3 border-b text-left text-xs font-serif text-white uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-serif text-white uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-3 border-b text-right text-xs font-serif text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAnnees.map((annee) => (
                <tr key={annee.ref_annee} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {annee.ref_annee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {annee.annee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => { setIsEdit(true); setEditAnnee(annee); setShowForm(true); }} className="text-yellow-600 hover:text-green-400 mr-4">
                      <FaPenToSquare size={20}/>
                    </button>
                    <button onClick={() => handleDeleteShow(annee.ref_annee)} className="text-red-600 hover:text-red-900">
                      <MdDelete size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {affichageanne.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune année universitaire n'est enregistrée
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Précédent
            </button>
            <span className="text-gray-700 mx-4">{currentPage} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

    <Modal isVisible={confirmSuppression} onClose={() => setSuppression(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">Confirmer la suppression</h3>
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.</p>
          <div className="flex justify-end">
            <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setSuppression(false)}>
              Annuler
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleDeleteAnnee()}>
              Supprimer
            </button>
          </div>
        </div>
      </Modal>

      {/* modal pour modification  */}
        <Modal isVisible={confirModif} onClose={() => setModif(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center">Information</h3>
          <p className="mb-4 text-center">Modification succès !</p>
          <div className="flex justify-end">
            <button className="bg-gray-300 text-black px-4 py-2 rounded  hover:text-red-500 mr-2" onClick={() => setModif(false)}>
              Annuler
            </button>
          </div>
        </div>
      </Modal>

         <Modal isVisible={confirmAjou} onClose={() => setAjout(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center">Information</h3>
          <p className="mb-4 text-center">Ajout Succès !</p>
          <div className="flex justify-end">
            <button className="bg-gray-300 text-black px-4 py-2 rounded  hover:text-red-500 mr-2" onClick={() => setAjout(false)}>
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnneeUniversitaire;
