import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';
import FormElement from '../Formulaire';
import {
  FaPenToSquare
} from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function Parcours() {
  // Variables pour les inputs
  const { control, handleSubmit, formState: { errors }, reset ,setValue  } = useForm({
    defaultValues: {
      ref_parcour:'',
      nom_parcours: '',
      ref_mention: '',
      ref_niveau: '',
    }
  });

  
  const [prod, setProd] = useState([]);
  const [modif, setModif] = useState(false);
  const [currentId, setCurrentId] = useState(null); // Id de la note à modifier
  const [filtered, setFiltered] = useState(false);
  const [infoEtudiant, setEtudiant] = useState([]);// iformation sur les etudiants 
  const [infoMention, setMention] = useState([]);
  const [niveauAffichage, setAfNiveau] = useState([]);

  // affichage par numéro inscription des etudiants ::::::::::

  const AffichageParNumero = async () => {
    try {
      const resultat = await axios.get('http://localhost:3000/api/etudiant');
      const res = resultat.data;
      setEtudiant(res);
      console.log('Voici les resultat', res);
    } catch (error) {
      console.error('erreur sur l\' affichage numéro inscription des etudiants :', error)
    }
  }
  // affichage par numéro UE 
  const AffichageUE = async () => {
    try {
      const resultatUE = await axios.get('http://localhost:3000/api/mention/affichage');
      const resultat = resultatUE.data;
      setMention(resultat);
    } catch (Error) {
      console.log(Error);
    }
  }

  // affichage élement constitif 
  const affichageElement = async () => {
    try {
      const resultatniveau = await axios.get("http://localhost:3000/api/niveau/affichage");
      const resultat = resultatniveau.data;
      setAfNiveau(resultat);
    } catch (MessageErreur) {
      console.Error('voici cette erreur :', MessageErreur);
      
    }
  }

    // Options pour le dropdown
  const options = infoEtudiant.map((etudiant) => ({
    value: etudiant.num_inscri,
    label: etudiant.nom_etud,
  }));
  // option pour dropdown unité d'enseigment
const optionsUE = infoMention.map((mention) => ({
    value: mention.ref_mention,
    label: mention.nom_mention,
}));
  const optionsElement = niveauAffichage.map((niv) => ({
    value: niv.ref_niveau,
    label: niv.nom_niveau,
  }));
  // Fonction pour récupérer toutes les notes
  const fetchAllNotes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/parcours/affichage/niveau');
      if (!filtered) {
        setProd(res.data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des notes:', err);
    }
  };

  useEffect(() => {
    fetchAllNotes();// pour l'affichage toutes note
    AffichageParNumero();// pour l'affichage toutes numéro étudiants
    AffichageUE();// affichage pour toutes unité d'enseigment
    affichageElement();// affichage pour touts élement constitif
  }, [filtered]);

  // Soumission du formulaire pour ajouter ou modifier une note
  const onSubmit = async (data) => {
    try {
      if (modif && currentId) {
        setModif(true);
       const resultat= await axios.put(`http://localhost:3000/api/modification/note/${currentId}`, data);
        alert('Note modifiée avec succès');
        console.log(resultat.data);
      } else {
        await axios.post('http://localhost:3000/api/parcours/ajout', data);
        alert('Parcours ajoutée avec succès');
      }
      reset();
      setModif(false);
      setCurrentId(null);
      fetchAllNotes();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement parcours:", err);
      alert("Erreur lors de l'enregistrement parcours !");
    }
  };

  // Fonction pour récupérer et afficher une note à modifier
  const AffichageParIdNote = async (refNote) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/recuperation/${refNote}`);
      const item = res.data;
      console.log(item);
      setValue('ref_note', item.ref_parcour);
      setValue('valeur_note', item.nom_parcours);
      setValue('num_inscri', item.ref_niveau);
      setValue('ref_matiere', item.ref_mention);
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
        fetchAllNotes(); // Mise à jour de la liste après suppression
      } catch (err) {
        console.error('Erreur lors de la suppression de la note:', err);
        alert('Erreur lors de la suppression de la note');
      }
    }
  };





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
    <div className="flex flex-col py-4 px-10 font-serif">
     

      {/* Formulaire d'ajout */}
      <div className="xl:container mx-auto relative  ">
        <div className="flex flex-justify-center rounded bg-gray-100 dark:bg-gray-800" style={{ height: '250px' }}>
          <h3 className=" sm:text-xl uppercase text-black dark:text-white font-serif pt-2">Listes parcours avec niveaux et mentions</h3>
        </div>

        <div className="sm:w-11/12 lg:w-full mx-auto grid grid-cols-3 gap-4 relative -top-20">
                    <div className="rounded-lg uppercase shadow-lg bg-white -mt-24 py-5 md:py-12 px-1 md:px-6 space-y-2 dark:bg-gray-400">
            <h4 className="flex justify-center">{modif ? 'Modification parcours' : 'Nouveau Parcours'}</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="ref_parcour"
              control={control}
              render={({ field }) => (
                  modif ? (
                    <FormElement
                      type="number"
                      label="Référence parcours"
                      placeholder="Entrer la réference parcours ..."
                      fieldRef={field}
                      hasError={!!errors.ref_parcour}
                      errorMessage={errors.ref_parcour?.message}
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
                name="nom_parcour"
                control={control}
                rules={{ required: 'Nom parcpurs est obligatoire' }}
                render={({ field }) => (
                  <FormElement
                    type="text"
                    label="Nom parcours"
                    placeholder="Entrer la nom parcours ..."
                    fieldRef={field}
                    hasError={!!errors.nom_parcours}
                    errorMessage={errors.nom_parcours?.message}
                  />
                )}
              />
              <Controller
                name="ref_mention"
                control={control}
                rules={{ required: "réference mention est obligatoire" }}
                render={({ field }) => (
                <FormElement
                  type="select"
                  label="Nom Mention"
                  placeholder="Nom mention ...."
                  fieldRef={field}
                  hasError={false}
                  options={optionsUE}
                />
                )}
              />
                <Controller
                name="ref_niveau"
                control={control}
                rules={{ required: "Le nom niveau est obligatoire " }}
                render={({ field }) => (
                <FormElement
                  type="select"
                  label="Nom niveau "
                  placeholder="Sélectionner le nom niveau "
                  fieldRef={field}
                  hasError={false}
                  options={optionsElement}
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
            className="w-full rounded-lg shadow-lg bg-white dark:bg-gray-400 -mt-24 py-5 md:py-5 px-1 md:px-6 lg:w-12/12 mx-auto col-span-2 h-[450px]"
          >
            <table className="w-full mx-auto px-2 py-5 p-8 dark:bg-gray-400">
              <thead>
                <tr className="  bg-blue-400 text-white
                 font-medium  rounded shadow-md
                 hover:bg-info-200 hover:shadow-lg focus:bg-pink-700 focus:outline-none">
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white hidden">#</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Nom parcours</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Mention</th>
                  <th className="text-left py-2 px-4 border-none dark:border-none text-white">Niveau</th>
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
                    <td className="py-2 px-4 border-none dark:border-none hidden">{item.ref_parcour}</td>
                    <td className="py-2 px-4 border-none dark:border-none">{item.nom_parcours}</td>
                    <td className="py-2 px-4 border-none dark:border-none">{item.nom_mention}</td>
                    <td className="py-2 px-4 border-none dark:border-none">{item.nom_niveau}</td>
                    <td className="py-2 px-4 border-none dark:border-none space-x-4 ">
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
        </div>
          </div>
                    {/* Pagination */}
            <div className="flex justify-center space-x-2 relative -top-16">
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
  );
}

export default Parcours;
