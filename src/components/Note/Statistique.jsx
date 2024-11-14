import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const StudentResults = () => {
  const [annee, setAnnee] = useState([]);
  const [semestre, setSemestre] = useState([]);
  const [Affresult, setResultat] = useState([]);
  const [nomNiveau1, setNomNiveau1] = useState('niveau1'); // Replace with your actual level name
  const [nomMention2, setNomMention2] = useState('mention2'); // Replace with your actual mention name
  const [nomParcours3, setNomParcours3] = useState('parcours3'); // Replace with your actual course name

  // Fetch available years and semesters when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearsRes = await axios.get('http://localhost:3000/annees');
        const semestersRes = await axios.get('http://localhost:3000/semestres');
        setAnnee(yearsRes.data);
        setSemestre(semestersRes.data);
      } catch (error) {
        console.error('Error fetching years or semesters:', error);
      }
    };

    fetchData();
  }, []);

  const fetchAllUsers = async (annee) => {
    try {
      const res = await axios.get(`http://localhost:3000/moyenne/${nomNiveau1}/${nomMention2}/${nomParcours3}/${annee}`);
      console.log(res.data);
      if (res.data && Array.isArray(res.data.results)) {
        setResultat(res.data.results || []);
      } else {
        console.error('Invalid data format received from API');
      }
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  return (
    <div className="col-span-1 lg:col-span-5 w-full space-y-15 -top-15">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3.5 }}
        className="space-y-4 rounded-lg shadow-lg bg-white dark:bg-gray-400 h-auto lg:h-[600px] p-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 justify-end">
          <h1 className="col-span-1 font-serif text-xl sm:text-2xl text-center" id="targetDiv">Résultat des Étudiants</h1>
          
          {/* Year Selection */}
          <select
            className="col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
            onChange={(e) => fetchAllUsers(e.target.value)}
          >
            <option value="" disabled>Sélectionner année</option>
            {annee.map((item, index) => (
              <option key={index} value={item.annee}>{item.annee}</option>
            ))}
          </select>

          {/* Semester Selection */}
          <select
            className="col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
            onChange={(e) => fetchAllUsers(e.target.value)}
          >
            <option value="" disabled>Sélectionner semestre</option>
            {semestre.map((item, index) => (
              <option key={index} value={item.nom_semestre}>{item.nom_semestre}</option>
            ))}
          </select>

          {/* Show Results Button */}
          <button 
            className="col-span-1 lg:row-span-1 w-full py-2 px-3 bg-blue-400 text-white border rounded-lg"
            onClick={() => fetchAllUsers(document.querySelector('select').value)} // Use the first select value
          >
            Afficher
          </button>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-400 text-white font-medium">
                <th className="py-2 px-4 sticky top-0">Étudiant</th>
                {['Unité d\'enseignement', 'Moyenne UE', 'Élément constitutif'].map((ue, index) => (
                  <th key={index} className="py-2 px-4 sticky top-0">{ue}</th>
                ))}
                <th className="py-2 px-4 sticky top-0">Statut</th>
                <th className="py-2 px-4 sticky top-0">Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {Affresult.length > 0 ? (
                Affresult.map((item, i) => {
                  const ueCount = item.moyennes.length;
                  return item.moyennes.map((ueData, ueIdx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }} // Reduced duration for a snappier feel
                      key={`${i}-${ueIdx}`}
                      className={`${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                    >
                      {ueIdx === 0 && (
                        <td rowSpan={ueCount} className="py-2 px-4">{item.etudiant}</td>
                      )}
                      <td className="py-2 px-4"><strong>{ueData.unite}</strong></td>
                      <td className="py-2 px-4">{ueData.moyenne !== undefined ? ueData.moyenne : 'Pas de moyenne'}</td>
                      <td className="py-2 px-4">
                        <ul>
                          {ueData.matieres?.length > 0 ? (
                            ueData.matieres.map((matiere, idx) => <li key={idx}>{matiere}</li>)
                          ) : (
                            <li>Aucune matière disponible</li>
                          )}
                        </ul>
                      </td>
                      {ueIdx === 0 && (
                        <td rowSpan={ueCount} className="py-2 px-4">
                          <span className={`${item.status === 'valide' ? 'bg-green-500' : 'bg-red-500'} px-3 py-1 rounded text-white`}>
                            {item.status}
                          </span>
                        </td>
                      )}
                      {ueIdx === 0 && (
                        <td rowSpan={ueCount} className="py-2 px-4">{item.moyenneGenerale}</td>
                      )}
                    </motion.tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">Aucune donnée disponible.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentResults;
