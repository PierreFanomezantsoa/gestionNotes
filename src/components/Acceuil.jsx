import { useState,useEffect } from 'react';
import {useForm ,Controller} from  'react-hook-form'
import { motion } from 'framer-motion';
import axios from 'axios';
import FormElement from './Formulaire';
import {
  FaPenToSquare
} from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Modal from './Modal';

function Acceuil() {
  // variable input ::::::::::

  const { control,
    handleSubmit,
    formState:{errors},reset
  } = useForm({
    defaultValues: {
      ref_matiere:'',
      code_matiere:'',
      nom_matiere: '',
      credit: '',
      ref_mod: '',
    }
  })


  const [prod, setPro] = useState([]);
  const [nomNiveau, setNomNiveau] = useState('');  // État pour nom_niveau
  const [nomMention, setNomMention] = useState('');  // État pour nom_mention
  const [nomParcours, setNomParcours] = useState('');  // État pour nom_parcours
  const [elem, affichageTous] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [module, setModule] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modale de confirmation pour suppression
  const [selectedProductId, setSelectedProductId] = useState(null); // Stocker l'ID de l'étudiant à supprimer



  // affichage module 
  const affichageModule = async () => {
    try {
      const resultatModule = await axios.get("http://localhost:3000/api/module/affichage");
      const resultat = resultatModule.data;
      setModule(resultat);
    } catch (err) {
      console.error('voici cette erreur :', err)
    }
  }

  const fetchAllUsers = async () => {
    // Vérifier si tous les paramètres sont sélectionnés avant d'envoyer la requête
    if (nomNiveau && nomMention && nomParcours) {
      try {
        const res = await axios.get(`http://localhost:3000/elementConstitif/${nomNiveau}/${nomMention}/${nomParcours}`);
        setPro(res.data);
        affichageTous(true);
        console.log(res.data);
        reset(); 
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Veuillez sélectionner le niveau, la mention, et le parcours.');
    }
  };
  // affichage module 
   const optionsElement = module.map((module) => ({
    value: module.ref_mod,
    label: module.nom_mod,
  }));

  // methode pour affichage toutes element constitif :::::::::
  const AffichageToutsElement = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/Element');
      if (!elem) { 
        setPro(res.data);
      }
      console.log(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des notes:', err);
    }
  };
  const supression = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/element/delete/${selectedProductId}`);
      AffichageToutsElement();
      setShowDeleteModal(false);
      console.log(res.data);
    } catch (mes) {
      console.log('Voici cette erreur : ', mes);
    }
  }
 // Fonction pour afficher les informations d'un élément par ID
const Affichage_id = async (numero) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/matiere/affichage/${numero}`);
    setEditData(res.data); // Stocker les infos de l'étudiant à modifier
    console.log(res.data);
    setShowEditModal(true); // Ouvrir la modale
  } catch (err) {
    console.error("Erreur lors de l'affichage des données:", err);
  }
};

// Fonction de soumission de modification
const onSubmitEdit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(`http://localhost:3000/api/element/modif/${editData.ref_matiere}`, editData);
    alert('Matière modifiée avec succès');
    AffichageToutsElement(); // Rafraîchir la liste après modification
    console.log(res.data);
    setShowEditModal(false); // Fermer la modale
    setEditData({}); // Réinitialiser les données
  } catch (err) {
    console.error('Erreur de mise à jour:', err);
  }
};
    // Afficher la modale de confirmation de suppression
  const handleDeleteShow = (productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true); // Afficher la modale de confirmation
  };

    // Open edit modal with selected item data


  useEffect(() => {
    AffichageToutsElement();// affichage toutes element constitif 
    affichageModule(); // affichage module 
  }, [elem]); 

  const onSubmit = async (data) => {
  try {
    const res = await axios.post('http://localhost:3000/matiere', data);
    console.log('Insertion matière success:', res.data);
    reset();
    alert('Matière enregistrée avec succès');
    AffichageToutsElement();
  } catch (err) {
    console.error('Erreur lors de l\'insertion de la matière:', err);
    alert('Erreur lors de l\'enregistrement de la matière');
  }
};


  const [currentPage, setCurrentPage1] = useState(1);
  const studentsPerPage = 10;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = prod.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage1(pageNumber);

  const totalPages = Math.ceil(prod.length / studentsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className='flex flex-col py-2 px-4 sm:px-6 font-serif space-y-2'>
       <div className='grid  pt-3 py-4 justify-end z-10  grid-cols-1 lg:grid-cols-4 gap-4'>
        <select value={nomNiveau} onChange={(e) => setNomNiveau(e.target.value)} className='bg-white col-span-1 border shadown shadow-lg rounded-lg px-5 py-3 dark:text-white dark: border-none dark:bg-gray-500'>
          <option value="">Sélectionner le niveau</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
        </select>
        <select value={nomMention} onChange={(e) => setNomMention(e.target.value)} className='bg-white border col-span-1 shadown shadow-lg rounded-lg px-5 py-3 dark:text-white dark: border-none dark:bg-gray-500'>
          <option value="">Sélectionner la mention</option>
          <option value="Eco-ge">Eco-ge</option>
          <option value="Informatique">Informatique</option>
          {/* Ajoute d'autres mentions ici */}
        </select>
        <select value={nomParcours} onChange={(e) => setNomParcours(e.target.value)} className='bg-white border col-span-1 shadown shadow-lg rounded-lg px-5 py-3 dark:text-white dark: border-none dark:bg-gray-500'>
          <option value="">Sélectionner le parcours</option>
          <option value="Economie">Economie</option>
          <option value="Gestion">Gestion</option>
          {/* Ajoute d'autres parcours ici */}
        </select>
        <button onClick={fetchAllUsers} className=" px-6 py-3 bg-blue-400 col-span-1 text-white font-medium uppercase 
        rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500
         focus:outline-none focus:ring-0 active:bg-green-600">Rechercher</button>
      </div>

      {/* diviser pour formulaire d'ajouts  */}
     <div className='xl:container mx-auto relative space-y-1 -top-12'>
    {/* Centrer et élargir le formulaire */}
    <div className='flex   dark:bg-gray-800' style={{ height: '250px' }}>
        <h3 className=' uppercase sm:text-xl text-black dark:text-white pt-10'>Liste Element constitif</h3>  
    </div>

    {/* Formulaire d'ajout */}
<div className=" lg:w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-2 relative -top-44 xs:space-y-2">
  <div className="rounded-lg uppercase col-span-2 shadow-lg bg-white dark:bg-gray-400  py-4 md:py-3  md:px-8 xs:px-8 sm:px-8 space-y-5">
    <div className='px-3'>
      <h3 className="text-center font-serif lowercase"></h3>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="ref_matiere"
        control={control}
        rules={{ required: 'Le nom de la matière est obligatoire' }}
        render={({ field }) => (
          <FormElement
            type="number"
            label="Référence Matière"
            placeholder="Entrer le référence de la matière ..."
            fieldRef={field}
            hasError={errors.ref_matiere?.type === 'required'}
            errorMessage={errors.ref_matiere?.message}
          />
        )}
      />
      <Controller
        name="nom_matiere"
        control={control}
        rules={{ required: 'Le nom de la matière est obligatoire' }}
        render={({ field }) => (
          <FormElement
            type="text"
            label="Nom élement constitif "
            placeholder="Entrer élement constitif ..."
            fieldRef={field}
            hasError={errors.nom_matiere?.type === 'required'}
            errorMessage={errors.nom_matiere?.message}
          />
        )}
      />
      <Controller
        name="credit"
        control={control}
        rules={{ required: 'Le coefficient est obligatoire' }}
        render={({ field }) => (
          <FormElement
            type="number"
            label="Coefficient"
            placeholder="Entrer le coefficient ..."
            fieldRef={field}
            hasError={errors.credit?.type === 'required'}
            errorMessage={errors.credit?.message}
          />
        )}
      />
      <Controller
        name="ref_mod"
        control={control}
        rules={{ required: 'Module est obligatoire' }}
        render={({ field }) => (
          <FormElement
            type="select"
            label="Module"
            placeholder="Séléctionner module"
            fieldRef={field}
            hasError={false}
            options={optionsElement}
          />
        )}
      />
      <Controller
        name="code_matiere"
        control={control}
        rules={{ required: 'Le code de la matière est obligatoire' }}
        render={({ field }) => (
          <FormElement
            type="number"
            label="Code Matière"
            placeholder="Entrer le code de la matière ..."
            fieldRef={field}
            hasError={errors.code_matiere?.type === 'required'}
            errorMessage={errors.code_matiere?.message}
          />
        )}
      />
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-400 text-white font-medium uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-500"
      >
        Enregistrer
      </button>
    </form>        
    </div>
  </div>

  {/* Tableau élargi et aligné */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 3.5 }}
    className="rounded-lg uppercase shadow-lg bg-white dark:bg-gray-400  py-5 md:py-12 sm:px-4 px-1 md:px-6 w-full lg:w-12/12 mx-auto col-span-3 "
          >
            <div className='sm:px-2 xs:px-2 overflow-x-auto'>
    <table className="min-w-full px-2 py-5 p-8">
      <thead>
        <tr className="bg-blue-400 text-white font-medium lowercase rounded shadow-md hover:bg-info-200 hover:shadow-lg focus:bg-pink-700 focus:outline-none">
          <th className="text-left py-2 px-4 border-none dark:border-none text-white">Nom Matiere</th>
          <th className="text-left py-2 px-4 border-none dark:border-none text-white">Coefficient</th>
          <th className="text-left py-2 px-4 border-none dark:border-none text-white">Mention</th>
          <th className="text-left py-2 px-4 border-none dark:border-none text-white">Parcours</th>
          <th className="text-left py-2 px-4 border-none dark:border-none text-white">Action</th>
        </tr>
      </thead>
      <tbody>
        {currentStudents.map((items, i) => (
          <motion.tr
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4.5 }}
            key={i}
            className={`border-t dark:bg-gray-400 ${i % 2 === 0 ? 'bg-white' : 'bg-white'} hover:bg-gray-200 lowercase`}
          >
            <td className="py-4 px-4 border-b border-b-black dark:border-none">{items.nom_matiere}</td>
            <td className="py-4 px-4 border-b border-b-black dark:border-none">{items.credit}</td>
            <td className="py-4 px-4 border-b border-b-black dark:border-none">{items.nom_mention}</td>
            <td className="py-4 px-4 border-b border-b-black dark:border-none">{items.nom_parcours}</td>
            <td className="text-center px-4 border-b border-b-black space-x-2">
              <button onClick={() => Affichage_id(items.ref_matiere)}>
                <FaPenToSquare className="text-xs text-yellow-500 hover:text-green-400 active:text-green-400" size={19} />
              </button>
              <button onClick={() => handleDeleteShow(items.ref_matiere)}>
                <MdDelete className="text-xs text-red-500 active:text-green-400" size={19} />
              </button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
            </div>
  </motion.div>
</div>


</div>

      {/* Drop-down pour sélectionner nom_niveau, nom_mention, et nom_parcours */}

      
      <div className="flex justify-center space-x-2 relative -top-48">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 border rounded uppercase text-left ${currentPage === number ? 'bg-green-500 text-white' : 'bg-white text-blue-500'} hover:bg-blue-500 hover:text-white`}>
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Modal isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">Confirmer la suppression</h3>
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet élément constitutif ? Cette action est irréversible.</p>
          <div className="flex justify-end">
            <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={supression}>
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
          
      <Modal isVisible={showEditModal} onClose={() => setShowEditModal(false)}>
    <form onSubmit={onSubmitEdit}>
      <div className='px-8 space-y-3 py-8'>
        <div>
          <h3 className='text-center font-serif font-bold'>Modification élément</h3>
        </div>
        
        {/* Champs caché pour ref_matiere */}
        <input
          type="hidden"
          value={editData.ref_matiere}
          onChange={(e) => setEditData({ ...editData, ref_matiere: e.target.value })}
        />
        
        {/* Nom élément */}
        <div className=''>
          <label>Nom élément <span className='text-red-600'>*</span></label>
          <input
            type="text"
            value={editData.nom_matiere || ""}
            onChange={(e) => setEditData({ ...editData, nom_matiere: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Coefficient */}
        <div className=''>
          <label>Coefficient <span className='text-red-600'>*</span></label>
          <input
            type="number"
            value={editData.credit || ""}
            onChange={(e) => setEditData({ ...editData, credit: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Code Matière */}
        <div className=''>
          <label>Code Matière <span className='text-red-600'>*</span></label>
          <input
            type="number"
            value={editData.code_matiere || ""}
            onChange={(e) => setEditData({ ...editData, code_matiere: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Sélection Module */}
        <div className=''>
          <label>Module</label>
          <select
            value={editData.ref_mod || ""}
            onChange={(e) => setEditData({ ...editData, ref_mod: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="" disabled>Sélectionnez un module</option>
            {optionsElement.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton de soumission */}
        <div>
              <button type="submit" className='w-full px-6 py-3 bg-blue-400 text-white font-medium uppercase rounded'>
                Modifier
          </button>
        </div>
      </div>
    </form>
  </Modal>
    </div>
  );
}

export default Acceuil;
