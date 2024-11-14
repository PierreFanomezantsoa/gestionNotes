import {  useState }from 'react';
import Modal from './Modal';
import Etudiants from "./Etudiants/etudiants";
import axios from 'axios';

import { MdPersonAddAlt1 } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import { IoIosWarning } from "react-icons/io"; // importation incons warning message !
// notification pour message d'erreur
  const notificationErreurMessage = () => {
    toast.warn("Numéro d'inscription étudiants déjà existe !");
  };
  

function AnotherPage() {
  const [showModal, setShowModal] = useState(false);
  const [messaged_Erreur, setMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState({}); // Stockage pour erreur de rformulaire

  // attrubit sur la table etudiants.
  const [student, setStudent] = useState({
    num_etud:'',
    adresse:'', 
    cod_red:'', 
    email:'', 
    nom_etud :'',
    prenom_etud :'', 
    ref_niveau :'', 
    ref_parcour :''

  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const errors = {};
    for (let key in student) {
        if (!student[key]) {
            errors[key] = 'Input vide !';
        }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
        try {
            const res = await axios.post('http://localhost:3000/api/etudiant/insertion', student);
            console.log('Donnée bien inserte !! ', res.data);
            setShowModal(false); // Close modal on successful submission
        } catch (err) {
            if (err.response && err.response.status === 409) {
              setMessage(true);
            } else {
                console.log("Erreur lors de l'insertion des données", err);
            }
        }
    }
};


  // Function to handle pagination
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, 2));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Render different pages of the form
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">
                Numéro <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="num_etud"
                value={student.num_etud}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.num_etud ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.num_etud && <p className="text-red-500">{formErrors.num_etud}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Nom <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="nom_etud"
                value={student.nom_etud}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.nom_etud ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.nom_etud && <p className="text-red-500">{formErrors.nom_etud}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Prenom <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="prenom_etud"
                value={student.prenom_etud}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.prenom_etud ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.prenom_etud && <p className="text-red-500">{formErrors.prenom_etud}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Niveau <span className="text-red-500">*</span>:
              </label>
              <input
                type="number"
                name="ref_niveau"
                value={student.ref_niveau}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.ref_niveau ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.ref_niveau && <p className="text-red-500">{formErrors.ref_niveau}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Parcours <span className="text-red-500">*</span>:
              </label>
              <input
                type="number"
                name="ref_parcour"
                value={student.ref_parcour}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.ref_parcour ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.ref_parcour && <p className="text-red-500">{formErrors.ref_parcour}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
           <div className="mb-4">
              <label className="block text-gray-700">
                Code redoublement <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="cod_red"
                value={student.cod_red}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.cod_red ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.cod_red && <p className="text-red-500">{formErrors.cod_red}</p>}
            </div>
             <div className="mb-4">
              <label className="block text-gray-700">
               Adresse Etudiants <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                name="adresse"
                value={student.adresse}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.adresse ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.adresse && <p className="text-red-500">{formErrors.adresse}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Email <span className="text-red-500">*</span>:
              </label>
              <input
                type="email"
                name="email"
                value={student.email}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
            </div>          
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col py-12 px-5 top-7 ">
  <button
  className=" relative left-[92%] text-white border-t-6  border rounded  z-10 w-[4%] flex justify-center bg-blue-400 shadow-lg top-10"
  onClick={() => setShowModal(true)}
>
       <MdPersonAddAlt1 size={35} />
</button>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 font-serif">Formulaire Étudiant</h3>
          <form onSubmit={handleSubmit}>
            {renderPage()}
            <div className="flex justify-between mt-5">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={prevPage}
                  className="text-white font-serif bg-blue-400 hover:bg-blue-600 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5"
                >
                  Précédent
                </button>
              )}
              {currentPage < 2 ? (
                <button
                  type="button"
                  onClick={nextPage}
                  className="text-white font-serif bg-blue-400 hover:bg-blue-600 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="text-white font-serif bg-green-500 hover:bg-green-700 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5"
                >
                  Soumettre
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
      {/* dialoge pour erreur sur clé primaire déjà existe dans la table ! */}
      
       <Modal isVisible={messaged_Erreur} onClose={() => setMessage(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center font-serif">Message d'erreur </h3>
          <div className='text-center grid grid-cols-5 relative'>
            <IoIosWarning  size={44} className='text-yellow-600 col-span-1 border border-yellow-600 rounded-full '/>
            <h3 className='font-serif col-span-3 -top-14'>Numéro d'inscription déjà existe sur la table !</h3>
          </div>
          <div className='flex justify-end '>
            <button onClick={()=>setMessage(false)} className='font-serif px-3 py-2 bg-gray-300 hover:bg-red-400 border rounded-md hover:text-white'>Annuler</button>
          </div>
        </div>
      </Modal>

      <ToastContainer className={"z-50"}/>
      <Etudiants/>
    </div>
  );
}

export default AnotherPage;
