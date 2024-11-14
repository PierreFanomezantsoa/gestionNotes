import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const StudentResults = () => {
  const [annee, setAnnee] = useState([]);
  const [semestre, setSemestre] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [Affresult, setResultat] = useState([]);
  const [histogramData, setHistogramData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/moyenne/L2/Eco-ge/Economie/2021-2022/S3`);
      if (res.data && Array.isArray(res.data.results)) {
        setResultat(res.data.results || []);
        updateHistogram(res.data.results);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données', err);
    }
  };

  const updateHistogram = (results) => {
    const validCounts = Array(5).fill(0);
    const invalidCounts = Array(5).fill(0);
    const intervals = ['0-10', '10-12', '12-14', '14-16', '16-20'];

    results.forEach(result => {
      const average = result.moyenneGenerale;
      const status = result.status;

      let index;
      if (average < 10) index = 0;
      else if (average < 12) index = 1;
      else if (average < 14) index = 2;
      else if (average < 16) index = 3;
      else index = 4;

      if (status === 'valide') {
        validCounts[index]++;
      } else {
        invalidCounts[index]++;
      }
    });

    setHistogramData({
      labels: intervals,
      datasets: [
        {
          label: 'Validés',
          data: validCounts,
          backgroundColor: 'rgba(34, 17, 254, 0.6)',
          borderColor: 'rgba(34, 17, 254, 1)',
          borderWidth: 1,
        },
        {
          label: 'Non Validés',
          data: invalidCounts,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
      ],
    });

    const totalValid = validCounts.reduce((acc, count) => acc + count, 0);
    const totalInvalid = invalidCounts.reduce((acc, count) => acc + count, 0);

    setPieData({
      labels: ['Validés', 'Non Validés'],
      datasets: [
        {
          data: [totalValid, totalInvalid],
          backgroundColor: ['rgba(64, 17, 254, 0.6)', 'rgba(239, 68, 68, 0.6)'],
          borderColor: ['rgba(64, 17, 254, 1)', 'rgba(239, 68, 68, 1)'],
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearsRes = await axios.get('http://localhost:3000/annees');
        const semestersRes = await axios.get('http://localhost:3000/semestres');
        setAnnee(yearsRes.data);
        setSemestre(semestersRes.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des années ou semestres:', error);
      }
    };

    fetchData();
    fetchAllUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="bg-white dark:bg-gray-200 dark:text-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 dark:text-black">Statistiques</h2>
          <div className="space-y-6">
            <div className="h-[300px]">
              <Bar
                data={histogramData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Distribution des Notes',
                      padding: 20,
                    },
                  },
                  scales: {
                    x: {
                      title: { display: true, text: 'Intervalles de Notes' },
                    },
                    y: {
                      title: { display: true, text: 'Nombre' },
                    },
                  },
                }}
              />
            </div>
            <div className="h-[300px]">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Répartition Validés/Non Validés',
                      padding: 20,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Table Section */}
        <div className="bg-white dark:bg-gray-400 rounded-lg shadow-lg p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Résultats des Étudiants <span className="text-blue-500">L2</span> <span className="text-blue-500">Eco-ge</span>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Parcours</label>
                <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
                  Economie
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Année</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 dark:text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner année</option>
                  {annee.map((item, index) => (
                    <option key={index} value={item.annee}>{item.annee}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Semestre</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 dark:text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner semestre</option>
                  {semestre.map((item, index) => (
                    <option key={index} value={item.nom_semestre}>{item.nom_semestre}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={fetchAllUsers}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Afficher
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:bg-gray-400">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 ">
                <tr className='bg-blue-400 text-white '>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-serif">Étudiant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-serif">Unité d'enseignement</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-serif">Moyenne UE</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-serif">Élément constitutif</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-serif">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-serif">Moyenne</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-400  divide-y divide-gray-200">
                {Affresult.length > 0 ? (
                  Affresult.map((item, i) => (
                    item.moyennes.map((ueData, ueIdx) => (
                      <motion.tr
                        key={`${i}-${ueIdx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: ueIdx * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-400"
                      >
                        {ueIdx === 0 && (
                          <td rowSpan={item.moyennes.length} className="px-6 py-2 whitespace-nowrap text-sm font-medium  dark:text-white text-gray-900">
                            {item.etudiant}
                          </td>
                        )}
                        <td className="px-6 py-2 whitespace-nowrap text-sm dark:text-white text-gray-900">{ueData.unite}</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm dark:text-white text-gray-900">{ueData.moyenne ?? 'N/A'}</td>
                        <td className="px-5 py-2 text-sm dark:text-white text-gray-900">
                          <ul className="list-none list-inside">
                            {ueData.matieres?.map((matiere, idx) => (
                              <li key={idx}>{matiere}</li>
                            ))}
                          </ul>
                        </td>
                        {ueIdx === 0 && (
                          <td rowSpan={item.moyennes.length} className="px-6 py-4 whitespace-nowrap text-sm">
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
                          <td rowSpan={item.moyennes.length} className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white text-gray-900">
                            {item.moyenneGenerale ?? 'N/A'}
                          </td>
                        )}
                      </motion.tr>
                    ))
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun résultat disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;