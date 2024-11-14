import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import {
  FaPenToSquare
} from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

// import toast sur react js *****************

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Etudiants({studentsListUpdated}) {

  // creation variable toast ******************
  const Notify = () => {
    toast.success("Ajouts donnée  success !");
  };
  const erreurMessage=()=>{
    toast.error("Erreur sur l' \ ajout donnée en excel !");
  }
  const WarningMessage=()=>{
    toast.warning("Veuillez selection le fichier !");
  }

  const InfoMessage=()=>{
    toast.info("Modification success !");
  }
  const SuppressionMessage=()=>{
    toast.info("Suppression success !");
  }


// *************fin ************

  // import fichier en excel sur base ****************
   const [selectedFile,setSelectedFile]=useState(null);
   const handelImport=async()=>{
    if(!selectedFile){
      WarningMessage();
      return;
    }
    const formData =new FormData();
    formData.append("file",selectedFile);
    try{
      const response= await axios.post("http://localhost:8080/api/employees/import", formData,{
        headers:{
          "Content-Type" : "multipart/form-data",
        },
      })
      console.log(response.data);
    Notify();
    }catch(err){
      console.error(err);
      erreurMessage();
    }
   }

  // fin *********************
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modale de confirmation pour suppression
  const [prod, setProd] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // Stocker les infos de l'étudiant sélectionné
  const [selectedProductId, setSelectedProductId] = useState(null); // Stocker l'ID de l'étudiant à supprimer

  const [nomNiveau, setNomNiveau] = useState(''); // État pour nom_niveau
  const [nomMention, setNomMention] = useState(''); // État pour nom_mention
  const [nomParcours, setNomParcours] = useState(''); // État pour nom_parcours

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/etudiant');
      setProd(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const Affichage_id = async (numero) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/etudiants/${numero}`);
      setSelectedStudent(res.data); // Stocker les infos de l'étudiant à modifier
      console.log(res.data);
      setShowModal(true); // Ouvrir la modale
    } catch (err) {
      console.log(err);
    }
  };

  // Gestion de la suppression
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/etudiant/delete/${selectedProductId}`);
      console.log('Suppression réussie');
      fetchAllUsers(); // Actualiser la liste après suppression
      SuppressionMessage();
      setShowDeleteModal(false); // Fermer la modale après suppression
    } catch (err) {
      console.log(err);
    }
  };

  // Afficher la modale de confirmation de suppression
  const handleDeleteShow = (productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true); // Afficher la modale de confirmation
  };

  useEffect(() => {
    fetchAllUsers();
  }, [studentsListUpdated]);

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage] = useState(1);

  // next page pour modifications 
    const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, 2));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const studentsPerPage = 6;

  const indexOfLastStudent1 = currentPage1 * studentsPerPage;
  const indexOfFirstStudent1 = indexOfLastStudent1 - studentsPerPage;
  const currentStudents1 = prod.slice(indexOfFirstStudent1, indexOfLastStudent1);

  const paginate1 = (pageNumber) => setCurrentPage1(pageNumber);

  const totalPages1 = Math.ceil(prod.length / studentsPerPage);
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, index) => index + 1);

  // Soumission de la modification
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/etudiants/${selectedStudent.num_inscri}`, selectedStudent);
      console.log('Mise à jour réussie', res.data);
      setShowModal(false);
      InfoMessage();
      fetchAllUsers(); // Actualiser la liste après la modification
      setCurrentPage(1);
    } catch (err) {
      console.log(err);
    }
  };


  // modification etudiants 
  const renderPage = () => {
    switch (currentPage2) {
      case 1:
        return (
          <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={selectedStudent.nom_etud}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, nom_etud: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Prenom etudiant</label>
                <input
                  type="text"
                  value={selectedStudent.prenom_etud}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, prenom_etud: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Niveau</label>
                <input
                  type="number"
                  value={selectedStudent.ref_niveau}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, ref_niveau: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Code redoublement</label>
                <input
                  type="text"
                  value={selectedStudent.cod_red}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, cod_red: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ref_parcours</label>
                <input
                  type="number"
                  value={selectedStudent.ref_parcour}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, ref_parcour: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
          </>
        );
      case 2:
        return (
          <>
           <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  value={selectedStudent.adresse}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, adresse: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
           <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>        
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div  className="flex flex-col py-15 h-[650px] relative px-4 shadow-md rounded-md sm:px-8 font-serif space-y-4 -top-20 bg-white dark:bg-gray-400">
       <div className='grid grid-cols-1 lg:grid-cols-5  gap-5 justify-end bg-white dark:bg-gray-400  rounded-md py-4 relative top-2 px-1' >
            
      <h1 className=" col-span-1  font-serif text-xl sm:text-2xl text-center" id="targetDiv">Liste Etudiants </h1>
      <select
        className="col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
        value={nomNiveau} onChange={(e) => setNomNiveau(e.target.value)}
      >
         <option value="">Sélectionner le niveau</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
      </select>
      <select
        className=" col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
       value={nomMention} onChange={(e) => setNomMention(e.target.value)}
      >
          <option value="">Sélectionner la mention</option>
          <option value="Eco-ge">Eco-ge</option>
          <option value="Informatique">Informatique</option>
        </select>
        <select
        className=" col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
       value={nomParcours} onChange={(e) => setNomParcours(e.target.value)}
      >
          <option value="">Sélectionner le parcours</option>
          <option value="Economie">Economie</option>
          <option value="Gestion">Gestion</option>
      </select>
            <button 
        className=" col-span-1 lg:row-span-1 px-4 py-2 bg-blue-400 text-white font-medium uppercase rounded shadow-lg 
    hover:bg-pink-500 hover:shadow-lg 
    focus:bg-pink-500 focus:outline-none focus:ring-0 active:bg-pink-500" 
    onClick={handelImport}
  >
 Lister
  </button>
          </div>
      


      <ToastContainer className={"z-30"}/>
      <br />
   
      
 
       <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-400 py-5 px-0 h-[400px]">
    <div className="overflow-x-auto">
      <table className="overflow-x-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-400">
        <thead>
          <tr className="bg-blue-400 text-white font-medium rounded shadow-md">
             <th className="text-left py-2 px-4 border-none dark:border-none text-white hidden">Réference note</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Matricule</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Nom</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Niveau</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Parcours</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Mention</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Adresse</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Email</th>
                  <th className="text-left py-2 px-4 border-b-2 border-b-gray-500  dark:border-none text-white">Action</th>
            {/* Autres entêtes */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y  dark:bg-gray-400">
          {currentStudents1.map((item, i) => (
            <tr key={i} className={`${i % 2 === 0 ? ' py-12 bg-white dark:bg-gray-400 shadow-lg' : 'bg-white dark:bg-gray-400'} hover:bg-gray-200`}>
                <td className="py-2 px-4 border-none hidden">{item.ref_note}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none font-sans hidden">{item.num_inscri}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none font-sans ">{item.num_etud}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none">{item.nom_etud}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none">{item.nom_niveau}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none">{item.nom_parcours}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none">{item.nom_mention}</td>
                    <td className="py-4 px-4 border-b-2 border-b-gray-300  dark:border-none">{item.adresse}</td>
              <td className='py-4 px-4 border-b-2 border-b-gray-300 dark:border-none'>{ item.email}</td>
                   <td className="py-4 px-4 border-b-2 dark:border-none space-x-3 border-b-gray-300  ">
                    <button onClick={() => Affichage_id(item.num_inscri)}>
                    <FaPenToSquare size={19} className=" text-yellow-500" />
                  </button>
                  <button onClick={() => handleDeleteShow(item.num_inscri)}>
                    <MdDelete size={19} className=" text-red-500" />
                  </button></td>
              {/* Autres colonnes */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div><br />
      
      <div className="flex justify-end mt-5">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers1.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate1(number)}
                  className={`px-4 py-2 border rounded text-left ${currentPage1 === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} hover:bg-blue-500 hover:text-white`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Modale pour modification */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        {selectedStudent && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Modifier Étudiant</h3>
           
              {renderPage()}
             <div className="flex justify-between mt-5">
              {currentPage2 > 1 && (
                <button
                  type="button"
                  onClick={prevPage}
                  className="text-white bg-blue-400 hover:bg-blue-600 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5"
                >
                  Précédent
                </button>
              )}
              {currentPage2 < 2 ? (
                <button
                  type="button"
                  onClick={nextPage}
                  className="text-white bg-blue-400 hover:bg-blue-600 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="text-white bg-green-500 hover:bg-green-700 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5"
                >
                  Soumettre
                </button>
              )}
            </div>
            
          </div>
        )}
      </Modal>

      {/* Modale de confirmation pour suppression */}
      <Modal isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">Confirmer la suppression</h3>
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.</p>
          <div className="flex justify-end">
            <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Etudiants;
