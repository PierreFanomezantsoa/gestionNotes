import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TableComponent = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedGrade, setEditedGrade] = useState('');
  const [editedElement, setEditedElement] = useState('');
  const [Element, setElement] = useState([]);
  const [editedUE, setEditedUE] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [modif, setModif] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [infoUE, setUE] = useState([]);

  const semesters = ['Semestre 1', 'Semestre 2'];

  const [annee, setAnnee] = useState([]); // information sur  année universitaire
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
  

  const affichageUEparSemestre = async () => {
    try {
      const resultat = await axios.get('http://localhost:3000/api/uinte/3/4');
      setUE(resultat.data);
    } catch (error) {
      console.error('Voici les erreurs:', error);
    }
  };

  const affichageElement = async () => {
    try {
      const resultatElement = await axios.get("http://localhost:3000/api/element/affichage");
      const resultat = resultatElement.data;
      setElement(resultat);
    } catch (MessageErreur) {
      console.Error('voici cette erreur :', MessageErreur);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/etudiant');
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    affichageElement();
    affichageUEparSemestre();
    AffichageAnnee();
  }, []);

  const handleEdit = (student) => {
    setEditingStudent(student.num_inscri);
    setEditedGrade(student.note || '' );
    setModif(true);
    setCurrentId(student.num_inscri);
  };

const handleSave = async () => {
  try {
    if (editedGrade < 0 || editedGrade > 20) {
      alert("La note doit être comprise entre 0 et 20.");
      return;
    }

    if (!editedUE || !editedElement) {
      alert("Veuillez sélectionner une UE et un Élément Constitutif avant d'enregistrer la note.");
      return;
    }

    const data = {
      num_inscri: currentId,
      valeur_note: editedGrade,
      ref_matiere: editedElement,
      ref_annee: selectedYear,
      ref_ue: editedUE,
      session: selectedSemester,
    };

    if (modif && currentId) {
      await axios.post(`http://localhost:3000/api/note`, data);
      alert('Note ajout avec succès');
    } else {
      if (selectedSemester === 'Semestre 1' || selectedSemester === 'Semestre 2') {
        await axios.post(`http://localhost:3000/api/note`, data);
        alert('Note de session normale bien insérée !');
      } else {
        await axios.post(`http://localhost:3000/api/note/insertion`, data);
        alert('Note de rattrapage bien insérée !');
      }
    }

    setModif(false);
    setCurrentId(null);
    setEditingStudent(null);
    fetchAllUsers();  // Reload data
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la note:', err);
    alert('Erreur : ' + err.message);
  }
};


  return (
    <div className="container mx-auto p-4">
           <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <motion.select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border p-2 rounded outline outline-blue-200 focus:outline-blue-400"
          >
            <option value="">Select Year</option>
            {annee.map((year) => (
              <option key={year.ref_annee} value={year.ref_annee}>{year.annee}</option>
            ))}
          </motion.select>

          <motion.select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border p-2 rounded outline outline-blue-200 focus:outline-blue-400"
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </motion.select>
        </div>

        <div className="flex space-x-4">
          <motion.select
            value={editedUE}
            onChange={(e) => setEditedUE(e.target.value)}
            className="border p-2 rounded outline outline-blue-200 focus:outline-blue-400"
          >
            <option value="">Select UE</option>
            {infoUE.map((ue) => (
              <option key={ue.ref_ue} value={ue.ref_ue}>{ue.nom_ue}</option>
            ))}
          </motion.select>

          <motion.select
            value={editedElement}
            onChange={(e) => setEditedElement(e.target.value)}
            className="border p-2 rounded outline outline-blue-200 focus:outline-blue-400"
          >
            <option value="">Select Element</option>
            {Element.map((element) => (
              <option key={element.ref_matiere} value={element.ref_matiere}>{element.nom_matiere}</option>
            ))}
          </motion.select>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Matricule</th>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Niveau</th>
            <th className="py-2 px-4 border-b">Note</th>
            <th className="py-2 px-4 border-b">Mention</th>
            <th className="py-2 px-4 border-b">Parcours</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.num_inscri} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{student.num_inscri}</td>
              <td className="py-2 px-4 border-b">{student.nom_etud}</td>
              <td className="py-2 px-4 border-b">{student.nom_niveau}</td>
              <td className="py-2 px-4 border-b">
                {editingStudent === student.num_inscri ? (
                  <motion.input
                    type="number"
                    value={editedGrade}
                    onChange={(e) => setEditedGrade(e.target.value)}
                    className="border p-1 rounded outline outline-blue-200 focus:outline-blue-400"
                  />
                ) : (
                  student.note || '0'
                )}
              </td>
              <td className="py-2 px-4 border-b">{student.nom_mention}</td>
              <td className="py-2 px-4 border-b">{student.nom_parcours}</td>
              <td className="py-2 px-4 border-b">
                {editingStudent === student.num_inscri ? (
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
