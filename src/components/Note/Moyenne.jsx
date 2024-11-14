import axios from 'axios';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MyResultat from '../Resultat/Resultat';

function Moyenne(parametre) {
  const [Affresult, setResultat] = useState([]);
  const [annee, setAnnee] = useState([]); // information sur année universitaire
  const [semestre, setSemestre] = useState([]); // affichage semestre
  const [selectedAnnee, setSelectedAnnee] = useState(''); // annee sélectionnée
  const [selectedSemestre, setSelectedSemestre] = useState(''); // semestre sélectionné
  
  // affichage Annee universitaire 
  const AffichageAnnee = async () => {
    try {
      const resultatAnnee = await axios.get('http://localhost:3000/api/annee');
      setAnnee(resultatAnnee.data);
    } catch (errer) {
      console.log(`voici cette erreur :`, errer);
    }
  };
  
  const affichageSemestre = async () => {
    try {
      let resultat;
      switch (parametre.niveau) {
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
    } catch (error) {
      console.error('Voici les erreurs:', error);
    }
  };

  // affichage des résultats des étudiants en fonction de l'année et du semestre sélectionnés
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/moyenne/${parametre.niveau}/${parametre.mention}/${parametre.parcour}/${selectedAnnee}/${selectedSemestre}`);
      if (res.data && Array.isArray(res.data.results)) {
        setResultat(res.data.results || []);
      } else {
        console.error("Format de données incorrect reçu de l'API");
      }
      console.log('bonjours !');
    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
    }
  };

  useEffect(() => {
    affichageSemestre(); // affichage semestre
    AffichageAnnee(); // affichage année universitaire
  }, [parametre.niveau, parametre.mention, parametre.parcour]);

  return (
    <div>
      <div className="col-span-1 lg:col-span-5 w-full space-y-15 -top-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3.5 }}
          className="space-y-4 rounded-lg shadow-lg bg-white dark:bg-gray-400 h-auto lg:h-[600px] p-4"
        >
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-5 justify-end'>
            <h1 className="col-span-1 font-serif text-xl sm:text-2xl text-center" id="targetDiv">Résultat des Étudiants</h1>
            <select
              className="col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
              onChange={(e) => setSelectedAnnee(e.target.value)}
            >
              <option value="" disabled>Sélectionner année</option>
              {annee.map((item, index) => (
                <option key={index} value={item.annee}>{item.annee}</option>
              ))}
            </select>
            <select
              className="col-span-1 lg:row-span-1 form-control w-full py-2 px-3 bg-gray-200 border border-gray-500 rounded-lg dark:text-black"
              onChange={(e) => setSelectedSemestre(e.target.value)}
            >
              <option value="" disabled>Sélectionner semestre</option>
              {semestre.map((item, index) => (
                <option key={index} value={item.nom_semestre}>{item.nom_semestre}</option>
              ))}
            </select>
            <button 
              className="col-span-1 lg:row-span-1 w-full py-2 px-3 bg-blue-400 text-white border rounded-lg" 
              onClick={fetchAllUsers}
            >
              Afficher
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full ">
              <thead>
                <tr className="bg-blue-400 text-white ">
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
                        transition={{ duration: 4.5 }}
                        key={`${i}-${ueIdx}`}
                        className={`${i % 2 === 0 ? 'bg-white border-b-2 border-b-gray-300 border-l-2 border-l-gray-300' : 'bg-white border-b-2 border-b-gray-300 border-l-2 border-l-gray-300'} hover:bg-gray-200`}
                      >
                        {ueIdx === 0 && (
                          <td rowSpan={ueCount} className="py-2 px-4 border-r-2 border-r-gray-300">{item.etudiant}</td>
                        )}
                        <td className="py-2 px-4 text-center"><strong>{ueData.unite}</strong></td>
                        <td className="py-2 px-4 text-center">{ueData.moyenne !== undefined ? ueData.moyenne : 'Pas de moyenne'}</td>
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
                          <td rowSpan={ueCount} className="py-2 px-4 text-center border-l-2 border-l-gray-300 border-r-2 border-r-gray-300">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === 'valide' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        )}
                        {ueIdx === 0 && (
                          <td rowSpan={ueCount} className="py-2 px-4 border-l-2 border-l-gray-300 border-r-2 border-r-gray-300 text-center">{item.moyenneGenerale}</td>
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
      </div><br />
      <MyResultat niveauEtud={parametre.niveau} mentionEtud={parametre.mention} parcourEtud={parametre.parcour} />
    </div>
  );
}

export default Moyenne;
