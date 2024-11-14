import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function teste() {
  // Récupérer les paramètres de l'URL : nomNiveau, nomMention, nomParcours
  const { nomNiveau, nomMention, nomParcours } = useParams();

  // État pour stocker les données des moyennes
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utiliser useEffect pour récupérer les données quand les paramètres changent
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Activer l'état de chargement
        const res = await axios.get(`http://localhost:3000/afficahe/${nomNiveau}/${nomMention}/${nomParcours}`);
        setData(res.data); // Stocker les données récupérées
        setLoading(false); // Désactiver l'état de chargement
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchData();
  }, [nomNiveau, nomMention, nomParcours]); // Déclencher la récupération de données quand ces paramètres changent

  // Gestion de l'affichage des données ou des états de chargement / erreur
  if (loading) {
    return <div>Chargement des moyennes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Moyennes des étudiants pour {nomNiveau}, {nomMention}, {nomParcours}</h2>
      <ul>
        {data.map((moyenne, index) => (
          <li key={index} className="mb-2">
            Étudiant: {moyenne.nomEtudiant} | Moyenne: {moyenne.moyenne}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default teste;
