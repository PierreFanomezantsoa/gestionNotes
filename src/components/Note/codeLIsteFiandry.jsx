import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';
import FormElement from '../Formulaire';
import {
  FaPenToSquare
} from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useParams } from 'react-router-dom';
import Mypdf from "../Resultat/pdf";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaAnglesUp } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

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

  const { nomNiveau1, nomMention2, nomParcours3 } = useParams();

  const [prod, setProd] = useState([]);
  const [modif, setModif] = useState(false);
  const [currentId, setCurrentId] = useState(null); // Id de la note à modifier 
  const [infoEtudiant, setEtudiant] = useState([]);// iformation sur les etudiants 
  const [infoUE, setUE] = useState([]);
  const [Element, setElement] = useState([]);
  const [Affresult, setResultat] = useState([]);
  const [annee, setAnnee] = useState([]); // information sur  année universitaire
  const [semestre, setSemestre] = useState([]); // affichage semestre

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
      console.error('erreur sur l\' affichage numéro inscription des etudiants :', error)
    }
  }
  // affichage par numéro UE 
  const AffichageUE = async () => {
    try {
      const resultatUE = await axios.get('http://localhost:3000/api/UE/affichage');
      const resultat = resultatUE.data;
      setUE(resultat);
    } catch (Error) {
      console.log(Error);
    }
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
      if (modif && currentId) {
        setModif(true);
       await axios.put(`http://localhost:3000/api/modification/note/${currentId}`, data);
        alert('Note modifiée avec succès');
        
      } else {
        await axios.post('http://localhost:3000/note', data);
        alert('Note ajoutée avec succès');
      }
      reset();
      setModif(false);
      setCurrentId(null);
      fetchFilteredNotes();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la note:", err);
      alert("Erreur lors de l'enregistrement de la note");
    }
  };

  // Fonction pour récupérer et afficher une note à modifier
  const AffichageParIdNote = async (refNote) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/recuperation/${refNote}`);
      const item = res.data;
      console.log(item);
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

  // suppression donnée ::::

    const deleteNote = async (ref_note) => {
    const confirmDelete = window.confirm('Voulez-vous vraiment supprimer cette note ?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/suppression/note/${ref_note}`);
        alert('Note supprimée avec succès');
        fetchFilteredNotes(); // Mise à jour de la liste après suppression
      } catch (err) {
        console.error('Erreur lors de la suppression de la note:', err);
        alert('Erreur lors de la suppression de la note');
      }
    }
  };

    // recherche note par niveau et par parcours ::::::
  const fetchFilteredNotes = async () => {
    if (nomNiveau1 && nomMention2 && nomParcours3) {
      try {
        const res = await axios.get(`http://localhost:3000/afficahe/${nomNiveau1}/${nomMention2}/${nomParcours3}`);
        setProd(res.data); 
        setFiltered(true); // retourner vrais sur la rechereche liste note par niveaux
        console.log("voici cette resultat ::", res.data);
        console.log(res.data.nom_niveau);
      } catch (err) {
        console.error('Erreur lors de la récupération des notes filtrées:', err);
      }
    } else {
      console.log('bonjours !')
    }
  };
  useEffect(() => {// pour l'affichage toutes note
    AffichageParNumero();// pour l'affichage toutes numéro étudiants
    AffichageUE();// affichage pour toutes unité d'enseigment
    affichageElement();// affichage pour touts élement constitif
    fetchFilteredNotes();
    affichageSemestre();
    AffichageAnnee();// affichage année universitaire
  },
    [nomNiveau1, nomMention2, nomParcours3]);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = prod.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(prod.length / studentsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col py-2 px-9 font-serif">
      <div className="flex space-x-2 pt-2 py-4 justify-end">
        <button
          onClick={handleScrollToDiv }
          className="px-6 py-3
           bg-blue-400
            text-white font-medium z-50
           uppercase relative 
           rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:outline-none active:bg-green-600" id='topdiv'
        >
          Resultat
        </button>
      </div>

      {/* Formulaire d'ajout */}
      <div className="xl:container mx-auto relative  -top-14">
        <div className="flex flex-justify-center rounded bg-gray-100 dark:bg-gray-800" style={{ height: '250px' }}>
          <h3 className=" sm:text-xl uppercase text-black dark:text-white font-serif pt-2 " >Liste Notes par niveau <span className='font-sans'>{nomNiveau1}</span>  <span className='font-sans'>{nomMention2}</span> et parcours <span className='font-serif'>{nomParcours3}</span></h3>
        </div>

        <div className="sm:w-11/12 lg:w-full mx-auto grid grid-cols-3 gap-4 relative -top-20">
                    <div className="rounded-lg uppercase shadow-lg bg-white -mt-24 py-5 md:py-12 px-1 md:px-6 space-y-2 dark:bg-gray-400">
            <h4 className="flex justify-center">{modif ? 'Modification note' : 'Nouveau note'}</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="ref_note"
              control={control}
              render={({ field }) => (
                  modif? (
                    <FormElement
                      type="number"
                      label="Référence Note"
                      placeholder="Entrer la référence note..."
                      fieldRef={field}
                      hasError={!!errors.ref_note}
                    errorMessage={errors.ref_note?.message}
                    className="hidden"
                     />
                  ) : (
                    <input
                        type="hidden"
                       {...field}
                    />
                   )
                )}
              />                  
              <Controller
                name="valeur_note"
                control={control}
                rules={{ required: 'Valeur note est obligatoire' }}
                render={({ field }) => (
                  <FormElement
                    type="number"
                    label="Valeur note"
                    placeholder="Entrer la valeur note..."
                    fieldRef={field}
                    hasError={!!errors.valeur_note}
                    errorMessage={errors.valeur_note?.message}
                  />
                )}
              />
              <Controller
                name="num_inscri"
                control={control}
                rules={{ required: "Le numéro d'inscription est obligatoire" }}
                render={({ field }) => (
                <FormElement
                  type="select"
                  label="Numéro d'inscription"
                  placeholder="Sélectionner un numéro d'inscription"
                  fieldRef={field}
                  hasError={false}
                  options={options}
                />
                )}
              />
                <Controller
                name="ref_annee"
                control={control}
                rules={{ required: "l'année universitaire est obligatoire !" }}
                render={({ field }) => (
                <FormElement
                  type="select"
                  label="Année universitaire"
                  placeholder="Sélectioner l'année universitaire ......"
                  fieldRef={field}
                  hasError={false}
                  options={optionAnnee}
                />
                )}
              />
                <Controller
                name="ref_matiere"
                control={control}
                rules={{ required: "Le nom matiere est obligatoire " }}
                render={({ field }) => (
                <FormElement
                  type="select"
                  label="Nom élement constitif "
                  placeholder="Sélectionner le nom element constitif"
                  fieldRef={field}
                  hasError={false}
                  options={optionsElement}
                />
                )}
              />
             <Controller
                name="ref_ue"
                control={control}
                rules={{ required: "Le nom unité d'enseigment est obligatoire " }}
                render={({ field }) => (
                <FormElement
                  type="select"
                  label="Nom Unité d'enseigment "
                  placeholder="Sélectionner le nom unité d'enseigment"
                  fieldRef={field}
                  hasError={false}
                  options={optionsUE}
                />
                )}
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-400 text-white font-medium uppercase rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:outline-none active:bg-green-600"
              >
                {modif ? 'Modifier' : 'Ajouter'}
              </button>
            </form>
          </div>
          

          {/* Tableau des notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3.5 }}
            className="w-full rounded-lg shadow-lg bg-white dark:bg-gray-400 -mt-24 py-5 md:py-5 px-1 md:px-6 lg:w-12/12 mx-auto col-span-2"
          >
            <table className="w-[98%] mx-auto   dark:bg-gray-400 ">
              <thead>
                <tr className="  bg-blue-400 text-white
                 font-medium  rounded shadow-md
                 hover:bg-info-200 hover:shadow-lg focus:bg-pink-700 focus:outline-none">
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white hidden">Réference note</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Matricule</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Nom</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white hidden">Prénom</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white hidden">Prénom</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Matière</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Note</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((item, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 4.5 }}
                    key={i}
                    className={`border-t dark:bg-gray-400 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                  >
                    <td className="py-2 px-4 border-none hidden">{item.ref_note}</td>
                    <td className="py-2 px-4 border-none dark:border-none ">{item.num_inscri}</td>
                    <td className="py-2 px-4 border-none dark:border-none">{item.nom_etud}</td>
                    <td className="py-2 px-4 border-none dark:border-none hidden">{item.prenom_etud}</td>
                    <td className="py-2 px-4 border-none dark:border-none hidden">{item.ref_ue}</td>
                    <td className="py-2 px-4 border-none dark:border-none">{item.nom_matiere}</td>
                    <td className="py-2 px-4 border-none dark:border-none">{item.valeur_note}</td>
                    <td className="py-2 px-4 border-none dark:border-none space-x-2 ">
                    <button onClick={() => AffichageParIdNote(item.ref_note)}>
                    <FaPenToSquare className="text-xl text-yellow-500" />
                  </button>
                  <button onClick={() => deleteNote(item.ref_note)}>
                    <MdDelete className="text-xl text-red-500" />
                  </button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
             <div className="flex justify-center space-x-2 z-40 relative -top-20 right-[-150%]">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded ${currentPage === number ? 'bg-green-400 text-white' : 'bg-gray-300 text-black'}`}
                >
                  {number}
                </button>
              ))}
      </div>
        </div>
        <div></div>
          </div>
      {/* Pagination */}

         
      <div className=" relative -top-20" >
        <div  className='font-serif text-2xl relative -top-20  text-center' id="targetDiv">..</div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3.5 }}
            className="w-full rounded-lg shadow-lg bg-white dark:bg-gray-400 -mt-24 py-5 md:py-5 px-1 md:px-6 lg:w-12/12 mx-auto col-span-2 h-[600px]"
        >
           <div className='flex justify-end grid-cols-4 gap-8' >
          <h1 className='font-serif text-2xl relative -top-0  text-center' >Resultat des Etudiants </h1>
         <select
            className='dark:text-black relative form-control py-3 px-5 -top-0 bg-gray-200 border border-gray-5000 rounded-lg uppercase z-40 font-none'
            onChange={(e) => fetchAllUsers(e.target.value)} // Mampiasà onChange amin'ny select
          >
            <option value="" disabled>Sélectioner année</option>
            {annee.map((item, index) => (
              <option key={index} value={item.annee}>{item.annee}</option> 
            ))}
          </select>
            <select
            className='dark:text-black relative form-control py-3 px-5 -top-0 bg-gray-200 border border-gray-5000 rounded-lg uppercase z-40 font-none'
            onChange={(e) => fetchAllUsers(e.target.value)} // Mampiasà onChange amin'ny select
          >
            <option value="" disabled>Sélectioner semestre</option>
            {semestre.map((item, index) => (
              <option key={index} value={item.nom_semestre}>{item.nom_semestre}</option> 
            ))}
          </select>
            <button  className='relative form-control py-3 px-5 -top-0 bg-blue-400 text-white border border-gray-5000 rounded-lg uppercase z-40 font-none'>Afficher</button>
        </div><br />
    <table className="w-full">
      <thead>
        <tr className="bg-blue-400 text-white font-medium rounded shadow-md hover:bg-info-200 hover:shadow-lg focus:bg-pink-700 focus:outline-none">
          <th className="text-left dark:border-none  border-b-2 border-b-gray-600 text-white dark:text-white sticky top-0 dark:bg-blue-400 border border-gray-300 py-2 px-4">Étudiant</th>
          {['Unite d\'enseigment', 'Moyenne UE', 'Element constitif'].map((ue, index) => (
            <th key={index} className="text-left dark:border-none border-l-2 border-l-blue-400 border-b-2 border-b-gray-600 text-white dark:text-white sticky top-0 dark:bg-blue-400 border-gray-300 py-2 px-4">
              {ue}
            </th>
          ))}
          <th className="text-left dark:border-none border-b-2 border-b-gray-600 text-white dark:text-white sticky top-0 dark:bg-blue-400 border-gray-300 py-2 px-4">Status</th>
          <th className="text-left dark:border-none border-b-2 border-b-gray-600 text-white dark:text-white sticky top-0 dark:bg-blue-400 border-gray-300 py-2 px-4">Moyenne</th>
        </tr>
      </thead>
      <tbody>
        {Affresult.length > 0 ? (
          Affresult.map((item, i) => {
            const ueCount = item.moyennes.length;
            return (
              item.moyennes.map((ueData, ueIdx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 4.5 }}
                  key={`${i}-${ueIdx}`}
                  className={`border-t dark:bg-gray-400  ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                >
                  {ueIdx === 0 && (
                    <td className="py-2 px-4  border-b-2 border-b-gray-300  border-l-2 border-l-gray-300" rowSpan={ueCount}>
                      {item.etudiant}
                    </td>
                  )}
                  <td className="py-2 px-4 border-b-2 border-b-gray-300 border-l-2 border-l-gray-300">
                    <strong>{ueData.unite}</strong>
                  </td>
                  <td className="py-2 px-4 border-b-2 border-b-gray-300 ">
                    {ueData.moyenne !== undefined ? ueData.moyenne : 'Pas de moyenne'}
                  </td>
                  <td className="py-2 px-4 border-b-2 border-b-gray-300 ">
                    <ul className="ml-4">
                      {ueData.matieres && ueData.matieres.length > 0 ? (
                        ueData.matieres.map((matiere, matiereIdx) => (
                          <li key={matiereIdx} className="font-sans">{matiere}</li>
                        ))
                      ) : (
                        <li>Aucune matière disponible</li>
                      )}
                    </ul>
                  </td>
                  {ueIdx === 0 && (
                    <td className="py-2 px-4  border-b-2 border-b-gray-300  border-l-2 border-l-gray-300" rowSpan={ueCount}>
                  {item.status ? (
                    <span className={item.status === 'valide' ? 'bg-green-500 py-1 px-5 border-non shadow-md rounded-full text-white  opacity-70 ' : 'bg-red-500'}>
                        {item.status}
                    </span>
                ) : null}
                    </td>
                  )}
                  {ueIdx === 0 && (
                    <td className="py-2 px-4 border-b-2 border-b-gray-300  border-l-2 border-l-gray-300 border-r-2 border-r-gray-300" rowSpan={ueCount}>
                      {item.moyenneGenerale}
                    </td>
                  )}
                </motion.tr>
              ))
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 border-none">
              Aucune donnée disponible.
            </td>
          </tr>
        )}
      </tbody>
    </table>

            </motion.div>
      </div> <br />
      <div className='flex justify-end grid-cols-2 gap-3'>
        <PDFDownloadLink document={<Mypdf nom_niveau={`${nomNiveau1}`} nom_mention={`${nomMention2}`} nom_parcour={ `${nomParcours3}`} />} fileName={`Resultat_${nomNiveau1}_${nomMention2}_${nomParcours3}`}>
        <button
          className="px-2 py-3 flex justify-end 
           bg-gray-200
            text-red-600 font-medium z-50
           uppercase relative -top-16
           rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:outline-none active:bg-gray-200"
        >
        <FaFilePdf size={35}/>
        </button>

        </PDFDownloadLink>
        <button
          onClick={handleScrollToDiv1}
          className="px-2 py-3 flex justify-end 
           bg-blue-400
            text-white font-medium z-50
           uppercase relative -top-16
           rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:outline-none active:bg-green-600"
        >
          <FaAnglesUp size={25}/>
        </button>
      </div>
       
    </div>
  );
}

export default ListNote;
