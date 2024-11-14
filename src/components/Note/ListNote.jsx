import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import FormElement from '../Formulaire';
import {
  FaPenToSquare
} from "react-icons/fa6";
import { MdDelete,MdWarning,MdInfoOutline } from "react-icons/md";
import { useParams } from 'react-router-dom';
import Mypdf from "../Resultat/pdf";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaAnglesUp, FaCircleInfo } from "react-icons/fa6";
import { Trash2 } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import MyMoyenne from './Moyenne';
import Modal from '../Modal';

function ListNote() {
  // Variables pour les inputs
  const { control, handleSubmit, formState: { errors }, reset ,setValue  } = useForm({
    defaultValues: {
      ref_note:'',
      valeur_note: '',
      num_inscri: '',
      ref_matiere: '',
      ref_annee:'',
      ref_ue: '',
    }
  });

  // notification etudiants
  

  const { nomNiveau1, nomMention2, nomParcours3 } = useParams();
  const [infoAjout, setAjout] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modale de confirmation pour suppression
  const [MessageDonne_dejaExiste, setMessage] = useState(false); // Modale de confirmation pour suppression
  const [selectedProductId, setSelectedProductId] = useState(null); // Stocker l'ID de l'étudiant à supprime
  const [modalInformation, setInformation] = useState(false);

  // suppresion étudiants
  const handleDeleteShow = (productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true); // Afficher la modale de confirmation
  };


  const [prod, setProd] = useState([]);
  const [modif, setModif] = useState(false);
  const [currentId, setCurrentId] = useState(null); // Id de la note à modifier 
  const [currentId1, setCurrentId1] = useState({}); // Id de la note à modifier 
  const [infoEtudiant, setEtudiant] = useState([]);// iformation sur les etudiants 
  const [infoUE, setUE] = useState([]);
  const [Element, setElement] = useState([]);
  const [annee, setAnnee] = useState([]); // information sur  année universitaire
   // affichage semestre

 const affichageSemestre = async () => {
  try {
    let resultat;
    switch (nomNiveau1) {
      case 'L1':
        resultat = await axios.get('http://localhost:3000/api/semestre/S1/S2');
        break;
      case 'L2':
        resultat = await axios.get('http://localhost:3000/api/semestre/S3/S4');
        break;
      case 'L3':
        resultat = await axios.get('http://localhost:3000/api/semestre/S5/S6');
        break;
      case 'M1':
        resultat = await axios.get('http://localhost:3000/api/semestre/S7/S8');
        break;
      case 'M2':
        resultat = await axios.get('http://localhost:3000/api/semestre/S9/S10');
        break;
      default:
        console.error('Nom de niveau inconnu');
        return; 
    }
    setSemestre(resultat.data);
    console.log(resultat.data);

  } catch (error) {
    console.error('Voici les erreurs:', error);
  }
};


  // redirection div resultat
    const handleScrollToDiv = () => {
    const targetDiv = document.getElementById('targetDiv');
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // redirection div resultat
    const handleScrollToDiv1 = () => {
    const topdiv = document.getElementById('topdiv');
    if (topdiv) {
      topdiv.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // affichage Annee universitaire 
  const AffichageAnnee = async () => {
    try {
      const resultatAnnee = await axios.get('http://localhost:3000/api/annee');
      const res = resultatAnnee.data;
      setAnnee(res);
    } catch (errer) {
      console.log(`voici cette erreur :`, errer);
    }
  }

  // affichage par numéro inscription des etudiants ::::::::::

const AffichageParNumero = async () => {
  try {
    const resultat = await axios.get(`http://localhost:3000/api/etudiant/${nomNiveau1}/${nomMention2}/${nomParcours3}`);
    const res = resultat.data;
     setEtudiant(res);
  } catch (error) {
    console.error("erreur sur l'affichage numéro inscription des etudiants :", error);
  }
};

 const affichageUEparSemestre = async () => {
  try {
    let resultat;
    switch (nomNiveau1) {
      case 'L1':
        resultat = await axios.get('http://localhost:3000/api/uinte/1/2');
        break;
      case 'L2':
        resultat = await axios.get('http://localhost:3000/api/uinte/3/4');
        break;
      case 'L3':
        resultat = await axios.get('http://localhost:3000/api/uinte/5/6');
        break;
      case 'M1':
        resultat = await axios.get('http://localhost:3000/api/uinte/7/8');
        break;
      case 'M2':
        resultat = await axios.get('http://localhost:3000/api/uinte/10/10');
        break;
      default:
        console.error('Nom de niveau inconnu');
        return; 
    }
    setUE(resultat.data);
    console.log(resultat.data);

  } catch (error) {
    console.error('Voici les erreurs:', error);
  }
};




  const CloseInformation=()=>{
    setMessage(false);
    reset();
}
  // affichage élement constitif 
  const affichageElement = async () => {
    try {
      const resultatElement = await axios.get("http://localhost:3000/api/element/affichage");
      const resultat = resultatElement.data;
      setElement(resultat);
    } catch (MessageErreur) {
      console.Error('voici cette erreur :', MessageErreur);
      
    }
  }
  // affichage resultat des etudiants ::
   const fetchAllUsers = async (annee) => {
    try {
      const res = await axios.get(`http://localhost:3000/moyenne/${nomNiveau1}/${nomMention2}/${nomParcours3}/${annee}`);
      console.log(res.data);
      console.log(res.data.status);
      console.log(annee);
      if (res.data && Array.isArray(res.data.results)) {
        setResultat(res.data.results || []);
      } else {
        console.error("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  // dropdown pour affichage année universitaire
  const optionAnnee = annee.map((anneeItem) => ({
    value: anneeItem.ref_annee,
    label: anneeItem.annee,
  }));
  const session = [
    {normal : 'Session Normal'},
    {normal : 'Session Ratrappage'}
  ]
  const optionSsession = session.map((item) => ({
    value: item.normal,
    label:item.normal
  }))
    // Options pour le dropdown
  const options = infoEtudiant.map((etudiant) => ({
    value: etudiant.num_inscri,
    label: etudiant.nom_etud,
  }));
  // option pour dropdown unité d'enseigment
const optionsUE = infoUE.map((ue) => ({
    value: ue.ref_ue,
    label: ue.nom_ue,
}));
  const optionsElement = Element.map((element) => ({
    value: element.ref_matiere,
    label: element.nom_matiere,
  }));
  // Soumission du formulaire pour ajouter ou modifier une note
 const onSubmit = async (data) => {
  try {
    // Client-side validation to ensure valeur_note is between 0 and 20
    if (data.valeur_note < 0 || data.valeur_note > 20) {
      alert("La note doit être comprise entre 0 et 20. Veuillez vérifier la valeur saisie.");
      return; // Stop execution if the note is invalid
    }

    if (modif && currentId) {
      // Modification mode: Update the existing note
      await axios.put(`http://localhost:3000/api/modification/note/${currentId}`, data);
      console.log(data);
      alert('Note modifiée avec succès');
    } else {
      // Insertion mode
      if (data.session === 'Session Normal') {
        await axios.post(`http://localhost:3000/api/note`, data);
        console.log(data.session);
        console.log('Note de session normale bien insérée !');
        setAjout(true);
      } else {
        await axios.post(`http://localhost:3000/api/note/insertion`, data);
        console.log(data.session);
        console.log('Note de rattrapage bien insérée !');
        setAjout(true);
      }
    }

    // Reset the form and states
    reset();
    setModif(false); // Reset modification state
    setCurrentId(null); // Reset current ID
    fetchFilteredNotes(); // Reload filtered notes
  } catch (err) {
    // Error handling based on server response
    if (err.response && err.response.status === 400) {
      alert(err.response.data); // Display backend error message
    } else {
      console.error("Erreur lors de l'enregistrement de la note :", err);
      alert("Erreur : " + err.message);
    }
  }
};


  // Fonction pour récupérer et afficher une note à modifier
  const AffichageParIdNote = async (refNote) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/recuperation/${refNote}`);
    const item = res.data;
    console.log(item);
    // Remplissez les champs du formulaire avec les données récupérées
    setValue('ref_note', item.ref_note);
    setValue('valeur_note', item.valeur_note);
    setValue('num_inscri', item.num_inscri);
    setValue('ref_matiere', item.ref_matiere);
    setValue('ref_ue', item.ref_ue);
    setValue('ref_annee', item.ref_annee);
    setModif(true);
    setCurrentId(refNote);
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error);
  }
  };
  
  // méthode pour l'information sur notée :
    // Fonction pour récupérer et afficher une note à modifier
  const InformationNotes = async (refNote) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/note/${nomNiveau1}/${nomMention2}/${nomParcours3}/${refNote}`);
    setInformation(true);
    console.log(res.data);
    setCurrentId1(res.data);
    console.log('bonjours !')
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error);
  }
};


  // suppression donnée ::::

    const deleteNote = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/suppression/note/${selectedProductId}`);
        console.log('suppression avec succès')
        fetchFilteredNotes(); // Mise à jour de la liste après suppression
        setShowDeleteModal(false);
      } catch (err) {
        console.error('Erreur lors de la suppression de la note:', err);
        alert('Erreur lors de la suppression de la note');
      }
  };

    // recherche note par niveau et par parcours ::::::
  const fetchFilteredNotes = async () => {
    if (nomNiveau1 && nomMention2 && nomParcours3) {
      try {
        const res = await axios.get(`http://localhost:3000/afficahe/${nomNiveau1}/${nomMention2}/${nomParcours3}`);
        setProd(res.data); 
        console.log("voici cette resultat ::", res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des notes filtrées:', err);
      }
    } else {
      console.log('bonjours !')
    }
  };
  useEffect(() => {// pour l'affichage toutes note
    AffichageParNumero();// pour l'affichage toutes numéro étudiants
    affichageUEparSemestre();// affichage pour toutes unité d'enseigment
    affichageElement();// affichage pour touts élement constitif
    fetchFilteredNotes();
    affichageSemestre();
    AffichageAnnee();// affichage année universitaire
  },
    [nomNiveau1, nomMention2, nomParcours3]);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = prod.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(prod.length / studentsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  // modale affichage modification notes des etudiants 
return (
  <div className="flex flex-col py-2 px-4 sm:px-6 font-serif space-y-2">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1  w-full space-x-2 pt-2 py-3 px-2 justify-end bg-white rounded-md shadow-md">
        
      
      <h3 className='col-span-2 lg:row-span-1 text-xl font-serif dark:text-black dark:bg-gray-400 bg-white   px-20 py-2'>Notes des etudiants <span className='text-2xl text-blue-400 dark:text-white'>{nomNiveau1}</span> et mention <span className='text-2xl text-blue-400 dark:text-white'>{nomMention2}</span> et parcours <span className='text-2xl text-blue-400 dark:text-white'>{ nomParcours3}</span></h3>
      <button
        onClick={handleScrollToDiv}
        className=" flex sm:justify-center col-span-1 lg:row-span-1 px-10 py-3 bg-white text-black font-medium z-40 uppercase relative  hover:bg-blue-400 hover:rounded-md focus:rounded-md hover:shadow-lg focus:bg-green-400 hover:text-white focus:text-white focus:outline-none active:bg-green-400"
        id="topdiv"
      >
        Resultat des etudiants
      </button>
    </div>
{/* Formulaire et Tableau en Grille */}
<div className="xl:container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-4 relative pt-0">
  {/* Formulaire d'ajout */}
  <div className="col-span-1 lg:col-span-2 rounded-lg shadow-lg bg-white dark:bg-gray-400 py-5 px-10 space-y-5">
        <div className='grid grid-rows-2 lg:grid-rows-2 '>
        <h3 className="text-lg text-center  uppercase text-black dark:text-white font-serif pt-0">
          {modif ? 'Modification note' : 'Nouveau note'}
        </h3>
        </div>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 -pt-1">
  <div className="hidden absolute -top-20">
    <Controller
      name="session"
      control={control}
      render={({ field }) => (
        <input
          type="hidden"
          {...field}
        />
      )}
    />
  </div>

  {modif ? (
    <input type="hidden" />
  ) : (
    <Controller
      name="session"
      control={control}
      rules={{ required: 'La session est obligatoire' }}
      render={({ field }) => (
        <FormElement
          type="select"
          label="Session"
          placeholder="Sélectionner une session..."
          fieldRef={field}
          hasError={!!errors.session}
          errorMessage={errors.session?.message}
          options={optionSsession}
        />
      )}
    />
  )}

  {/* Champ valeur_note */}
  <Controller
    name="valeur_note"
    control={control}
    rules={{ required: 'Valeur note est obligatoire' }}
    render={({ field }) => (
      <FormElement
        type="number"
        label="Valeur note"
        placeholder="Entrer la valeur de la note..."
        fieldRef={field}
        hasError={!!errors.valeur_note}
        errorMessage={errors.valeur_note?.message}
      />
    )}
  />

  {/* Champ numéro d'inscription */}
  <Controller
    name="num_inscri"
    control={control}
    rules={{ required: "Le numéro d'inscription est obligatoire" }}
    render={({ field }) => (
      <FormElement
        type="select"
        label="Nom étudiant"
        placeholder="Sélectionner l'étudiant"
        fieldRef={field}
        hasError={!!errors.num_inscri}
        errorMessage={errors.num_inscri?.message}
        options={options}
      />
    )}
  />

  {/* Autres champs (année universitaire, matière, UE) */}
  <Controller
    name="ref_annee"
    control={control}
    rules={{ required: "L'année universitaire est obligatoire" }}
    render={({ field }) => (
      <FormElement
        type="select"
        label="Année universitaire"
        placeholder="Sélectionner l'année universitaire..."
        fieldRef={field}
        hasError={!!errors.ref_annee}
        errorMessage={errors.ref_annee?.message}
        options={optionAnnee}
      />
    )}
  />

  <Controller
    name="ref_matiere"
    control={control}
    rules={{ required: "Le nom de la matière est obligatoire" }}
    render={({ field }) => (
      <FormElement
        type="select"
        label="Nom élément constitutif"
        placeholder="Sélectionner le nom de l'élément constitutif"
        fieldRef={field}
        hasError={!!errors.ref_matiere}
        errorMessage={errors.ref_matiere?.message}
        options={optionsElement}
      />
    )}
  />

  <Controller
    name="ref_ue"
    control={control}
    rules={{ required: "Le nom de l'unité d'enseignement est obligatoire" }}
    render={({ field }) => (
      <FormElement
        type="select"
        label="Nom Unité d'enseignement"
        placeholder="Sélectionner le nom de l'unité d'enseignement"
        fieldRef={field}
        hasError={!!errors.ref_ue}
        errorMessage={errors.ref_ue?.message}
        options={optionsUE}
      />
    )}
  />

  <button
    type="submit"
    className="w-full px-3 py-2 sm:px-6 sm:py-2 bg-blue-400 text-white font-medium uppercase rounded shadow-md hover:bg-green-500"
  >
    {modif ? 'Modifier' : 'Ajouter'}
  </button>
</form>

  </div>

  {/* Tableau des notes */}
<div className="col-span-1 lg:col-span-3 rounded-lg shadow-lg bg-white dark:bg-gray-800 py-5 px-4">
  <div className="overflow-x-auto ">
    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 ">
      <thead>
        <tr className=" to-cyan-500 text-white bg-blue-400 font-semibold ">
          <th className="text-left py-3 px-4 hidden">Référence note</th>
          <th className="text-left py-3 px-4">Matricule</th>
          <th className="text-left py-3 px-4">Nom</th>
          <th className="text-left py-3 px-4 hidden">Prénom</th>
          <th className="text-left py-3 px-4 hidden">UE</th>
          <th className="text-left py-3 px-4">Matière</th>
          <th className="text-left py-3 px-4">Note</th>
          <th className="text-left py-3 px-4">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {currentStudents.map((item, i) => (
          <tr
            key={i}
            className={`${
              i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-white dark:bg-gray-900"
            } hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
          >
            <td className="py-4 px-4 hidden">{item.ref_note}</td>
            <td className="py-4 px-4 font-sans">{item.num_etud}</td>
            <td className="py-4 px-4">{item.nom_etud}</td>
            <td className="py-4 px-4 hidden">{item.prenom_etud}</td>
            <td className="py-4 px-4 hidden">{item.ref_ue}</td>
            <td className="py-4 px-4">{item.nom_matiere}</td>
            <td className="py-4 px-4">{item.valeur_note}</td>
            <td className="py-4 px-4 flex space-x-2">
              <button
                className="text-blue-400 hover:text-green-400 transition-colors focus:outline-none"
                onClick={() => InformationNotes(item.ref_note)}
              >
                <FaCircleInfo size={19} />
              </button>
              <button
                className="text-yellow-500 hover:text-green-400 transition-colors focus:outline-none"
                onClick={() => AffichageParIdNote(item.ref_note)}
              >
                <FaPenToSquare size={19} />
              </button>
              <button
                className="text-red-500 hover:text-red-600 transition-colors focus:outline-none"
                onClick={() => handleDeleteShow(item.ref_note)}
              >
                <MdDelete size={19} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex justify-center space-x-2 mt-6">
    {pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => paginate(number)}
        className={`px-3 py-1 sm:px-4 sm:py-2 rounded ${
          currentPage === number
            ? "bg-blue-500 text-white font-semibold shadow-lg"
            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        } transition-colors`}
      >
        {number}
      </button>
    ))}
  </div>
</div>
<br />
      <Modal isVisible={infoAjout} onClose={() => setAjout(false)}>
                <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center">Message d'information </h3>
          <div className='relative'>
            <MdInfoOutline size={55} className='absolute left-4 text-blue-400'/>
          <p className=" absolute left-[19%] top-4">Notes ajout avec succès !</p>
          </div><br />
          <div className="flex justify-end">
            <button className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-red-600 hover:text-white" onClick={()=>setAjout(false)}>
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      {/* information sur l'information notes des étudiants */}

       <Modal isVisible={modalInformation} onClose={() => setInformation(false)} className="w-[600px]">
  <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center">
            Information sur note d'étudiant
          </h3>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="space-y-3">
              {/* Nom */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Nom :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.nom_etud}</span>
                </div>
              </div>

              {/* Prénom */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Prénom :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.prenom_etud}</span>
                </div>
              </div>

              {/* Numéro Étudiant */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Numéro Étudiant :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.num_etud}</span>
                </div>
              </div>

              {/* Numéro d'inscription */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Numéro d'inscription :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.num_inscri}</span>
                </div>
              </div>

              {/* Adresse */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Adresse :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.adresse}</span>
                </div>
              </div>

              {/* Email */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Email :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.email}</span>
                </div>
              </div>

              {/* Niveau */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Niveau :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.nom_niveau}</span>
                </div>
              </div>

              {/* Mention */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Mention :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.nom_mention}</span>
                </div>
              </div>

              {/* Parcours */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Parcours :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.nom_parcours}</span>
                </div>
              </div>

              {/* UE */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Unité d'Enseignement (UE) :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.nom_ue}</span>
                </div>
              </div>

              {/* Matière */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Matière :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.nom_matiere}</span>
                </div>
              </div>

              {/* Note */}
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className="flex items-center">
                  <span className="font-serif min-w-[180px] text-gray-600">Valeur de la Note :</span> 
                  <span className="text-blue-600 font-medium">{currentId1.valeur_note}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
            onClick={() => setInformation(false)} 
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
</Modal>

      
      {/* Modale de confirmation pour suppression */}
      <Modal isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <span>Suppression</span>
            </h2>
            <p 
              className="text-gray-600 mt-2"
            >
             Veuillez confirmer la suppression !
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
           onClick={deleteNote}
              className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Message donnée déjà existe !*/}
       <Modal isVisible={MessageDonne_dejaExiste} onClose={() => CloseInformation()}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center">Message d'erreur </h3>
          <div className='relative'>
            <MdWarning size={55} className='absolute left-4 text-yellow-400'/>
          <p className=" absolute left-[19%] top-4">Désolé , Donnée déjà existe !</p>
          </div><br />
          <div className="flex justify-end">
            <button className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-red-600 hover:text-white" onClick={()=>CloseInformation()}>
              Annuler
            </button>
          </div>
        </div>
          </Modal>
          
  {/* Sélection d'année et de semestre */}
      <div className="col-span-1 lg:col-span-5 w-full space-y-15 -top-15">
        
      <MyMoyenne niveau={nomNiveau1} mention={ nomMention2} parcour={nomParcours3} />
  </div>
      
</div>
            <div className='flex justify-end grid-cols-2 gap-3'>
        <PDFDownloadLink document={<Mypdf nom_niveau={`${nomNiveau1}`} nom_mention={`${nomMention2}`} nom_parcour={ `${nomParcours3}`} />} fileName={`Resultat_${nomNiveau1}_${nomMention2}_${nomParcours3}`}>

        </PDFDownloadLink>
        <button
          onClick={handleScrollToDiv1}
          className="px-2 py-4 flex justify-end 
           bg-blue-400
            text-white font-medium z-50
           uppercase relative -top-16
           rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:outline-none active:bg-green-600"
        >
          <FaAnglesUp size={25}/>
        </button>
      </div>
     
      <ToastContainer className={"z-50"}/>

  </div>
);




}

export default ListNote;
