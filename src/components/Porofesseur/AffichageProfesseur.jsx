import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import {
  FaPenToSquare
} from "react-icons/fa6";
import { MdDelete,MdOutlineAddCircleOutline } from "react-icons/md";
function AffichageProfesseur({studentsListUpdated}) {
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
  const [showAjout, setShowAjout] = useState(false); // Modale pour l'ajout professeur
  const [prod, setProd] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // Stocker les infos de l'étudiant sélectionné
  const [selectedProductId, setSelectedProductId] = useState(null); // Stocker l'ID de l'étudiant à supprime
  const [professeur, setProf] = useState({
     email :'',
     nom_prof :'',
     prenom_prof :'',
     grade :''

  });  
   
    // stockage de variable dans input 
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProf((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
    
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/professeur/affichage');
      setProd(res.data);
    } catch (err) {
      console.log(err);
    }
  };

    // ajout professeur sur table prof
    const AjoutProf = async () => {
        try {
            const resultat = await axios.post('http://localhost:3000/api/professeur/ajout', professeur);
            console.log(resultat.data);
            fetchAllUsers(); 
        } catch (erreur) {
            console.log('Voici cette erreur sur l\'ajout professeur !', erreur)
        }
    }
  const Affichage_id = async (numero) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/professeur/${numero}`);
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
      await axios.delete(`http://localhost:3000/api/professeur/delete/${selectedProductId}`);
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
    } catch (err) {
      console.log(err);
    }
  };
return (
  <div className="flex flex-col py-8 px-5 sm:px-6 p-10 font-serif space-y-1 relative -top-0">
    <br />

    <div className="col-span-1 lg:col-span-3 rounded-lg relative -top-10 shadow-lg bg-white dark:bg-gray-400 py-5 px-4 h-[680px]">
      <div className="grid col-span-1 lg:grid-cols-10">
        <h1 className="col-span-9 font-serif text-xl sm:text-2xl text-center sm:w-full" id="targetDiv">
          Liste Professeur
        </h1>
        <button
          className="text-center col-span-1 px-12 py-2 bg-blue-400 text-white border shadow-md sm:w-full xs:w-full rounded-md"
          onClick={() => setShowAjout(true)}
        >
          <MdOutlineAddCircleOutline size={25} />
        </button>
        <br />
      </div>

      {/* Table wrapper for horizontal scrolling on smaller screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-400">
          <thead>
            <tr className="bg-blue-400 text-white font-medium rounded shadow-md">
              <th className="text-left py-2 px-4 border-none dark:border-none text-white hidden">
                Réference Professeur
              </th>
              <th className="text-left py-2 px-4 border-b-2 border-b-gray-500 dark:border-none text-white">
                Nom professeur
              </th>
              <th className="text-left py-2 px-4 border-b-2 border-b-gray-500 dark:border-none text-white">
                Prénom professeur
              </th>
              <th className="text-left py-2 px-4 border-b-2 border-b-gray-500 dark:border-none text-white">
                Email
              </th>
              <th className="text-left py-2 px-4 border-b-2 border-b-gray-500 dark:border-none text-white">
                Titre
              </th>
              <th className="text-left py-2 px-4 border-b-2 border-b-gray-500 dark:border-none text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:bg-gray-400">
            {currentStudents1.map((item, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0
                    ? 'py-12 bg-white dark:bg-gray-400 shadow-lg'
                    : 'bg-white dark:bg-gray-400'
                } hover:bg-gray-200`}
              >
                <td className="py-2 px-4 border-none hidden">{item.ref_prof}</td>
                <td className="py-4 px-4 border-b-2 border-b-gray-300 dark:border-none">
                  {item.nom_prof}
                </td>
                <td className="py-4 px-4 border-b-2 border-b-gray-300 dark:border-none">
                  {item.prenom_prof}
                </td>
                <td className="py-4 px-4 border-b-2 border-b-gray-300 dark:border-none">
                  {item.email}
                </td>
                <td className="py-4 px-4 border-b-2 border-b-gray-300 dark:border-none">
                  {item.grade}
                </td>
                <td className="py-4 px-4 border-b-2 dark:border-none space-x-4 border-b-gray-300">
                  <button onClick={() => Affichage_id(item.ref_prof)}>
                    <FaPenToSquare size={19} className="text-yellow-500" />
                  </button>
                  <button onClick={() => handleDeleteShow(item.ref_prof)}>
                    <MdDelete size={19} className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 relative top-[50%]">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers1.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate1(number)}
                  className={`px-4 py-2 border rounded text-left ${
                    currentPage1 === number
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500'
                  } hover:bg-blue-500 hover:text-white`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
    <br />

    

      {/* Modale pour modification */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div >
          <h3 className='py-2 px-15 font-semibold font-serif text-center'>Modification Professeur</h3>
            <form onSubmit={AjoutProf} className='space-y-6'>
                 <div>
                   <div className='px-4 py-2 '>
                   Nom professeur :  
                    <input
                    type="text"
                    value={selectedStudent?.nom_prof || ''} 
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, nom_prof: e.target.value })}
                    className="mt-1 p-2 border rounded w-full focus:outline-blue-400 outline-2 outline-blue-200 "
                     required
                    />                     
                  </div>
            </div>
                <div>
                   <div className='px-4 py-1 '>
                   Prénom professeur :  
                    <input
                    type="text"
                    value={selectedStudent?.prenom_prof || ''} 
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, prenom_prof: e.target.value })}
                    className="mt-1 p-1 border rounded w-full focus:outline-blue-400 outline-2 outline-blue-200 "
                     required
                    />                     
                  </div>
            </div>
                <div>
                   <div className='px-4 py-1 '>
                  Email :  
                    <input
                    type="email"
                    value={selectedStudent?.email || ''} 
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                    className="mt-1 p-2 border rounded w-full focus:outline-blue-400 outline-2 outline-blue-200 "
                     required
                    />                     
                  </div>
            </div>
                <div>
                   <div className='px-4 py-1 '>
                   Titre :  
                    <input
                    type="text"
                    value={selectedStudent?.grade || ''} 
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, grade: e.target.value })}
                    className="mt-1 p-2 border rounded w-full focus:outline-blue-400 outline-2 outline-blue-200 "
                     required
                    />                     
                  </div>
            </div>
            <div className='px-4 py-5'>
            <button className="bg-blue-400 hover:bg-green-400 text-white px-8 w-full py-2 rounded" type='submit'>
            modifier
            </button>     
            </div>
          </form>        
          </div>
      </Modal>

      {/* Modale de confirmation pour suppression */}
      <Modal isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">Confirmer la suppression</h3>
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet professeur ? Cette action est irréversible.</p>
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
          
          {/* modal ajout professeur  */}
          <Modal isVisible={showAjout} onClose={() => setShowAjout(false)}>
        <div className="p-6">
          <h3 className="text-xl text-center font-semibold text-gray-900 mb-5">Ajout professeur.</h3>
          <div >
            <form onSubmit={AjoutProf} className='space-y-6'>
                 <div>
                   Nom professeur :  
                   <div className='px-4 py-2 border border-gray-500 rounded-md'>
                         <input type="text"
                           name='nom_prof'
                           value={professeur.nom_prof}
                          onChange={handleInputChange}  className='focus:outline-none px-8 w-full ' placeholder='nom professeur ....'/>                       
                  </div>
                </div>
                 <div>
                   Prénom professeur :  
                  <div className='px-4 py-2 border-gray-500  rounded-md'>
                        <input type="text"
                             name='prenom_prof'
                      value={professeur.prenom_prof}
                       onChange={handleInputChange} className='focus:outline-none px-8 w-full ' placeholder='prénom professeur ....'/>                       
                  </div>
                </div>
                <div>
                  Email :  
                  <div className='px-4 py-2 border-gray-500 border-2 rounded-md'>
                        <input type="email"
                            name='email'
                      value={professeur.email}
                      onChange={handleInputChange} className='focus:outline-none px-8 w-full ' placeholder='email professeur ....'/>                       
                  </div>
                  </div>
                  <div>
                    Titre :  
                    <div className='px-4 py-2 border-gray-500 border-2 rounded-md'>
                          <input type="text"
                              name='grade'
                         value={professeur.grade}
                         onChange={handleInputChange} className='focus:outline-none px-8 w-full ' placeholder='Titre ....'/>                       
                     </div>
                </div>
            <button className="bg-blue-400 hover:bg-green-400 text-white px-4 w-full py-2 rounded" type='submit'>
            Ajouter
            </button>     
          </form>        
          </div>
        </div>
      </Modal>
  </div>
);

}

export default AffichageProfesseur;
