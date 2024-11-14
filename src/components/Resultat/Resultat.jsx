import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Text, View } from '@react-pdf/renderer';
import Mypdf from './example';
import { FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

function ResultatPage(parametre) {
  const [Affresult, setResultat] = useState([]);
  const [annee, setAnnee] = useState([]);

  // Function to fetch academic year data
  const AffichageAnnee = async () => {
    try {
      const resultatAnnee = await axios.get('http://localhost:3000/api/annee');
      setAnnee(resultatAnnee.data);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  // Function to fetch student results
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/moyenne/${parametre.niveauEtud}/${parametre.mentionEtud}/${parametre.parcourEtud}/2021-2022/S2`);
      if (res.data && Array.isArray(res.data.results)) {
        setResultat(res.data.results);
      } else {
        console.error("Format de données invalide reçu de l'API");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    AffichageAnnee();
  }, [parametre.niveauEtud, parametre.mentionEtud, parametre.parcourEtud]);

  // Inline CSS styles
  const styles = {
    tableContent: {
      width: '105%',
      border: '1px solid black',
    },
    headerRow: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      flexDirection: 'row',
      fontSize: '10px',
      display: 'flex',
    },
    headerCell: {
      border: '0.5px solid black', 
      padding: '7px',
      fontSize: '7px',
      textAlign: 'center',
      flex: 1, // Ensures each header cell has equal width by default
      minWidth: 100, // Set a minimum width for each column
      wordBreak: 'break-word', // Allow long words to break and wrap
    },
    dataRow: {
      border: '0.5px solid black', 
      flexDirection: 'row',
      fontSize: '7px',
      display: 'flex',
    },
    dataCell: {
      border: '0.5px solid black', 
      padding: '7px',
      fontSize: '7px',
      textAlign: 'center',
      flex: 1, // Ensures each data cell has equal width by default
      minWidth: 100, // Set a minimum width for each column
      wordBreak: 'break-word', // Enable word wrapping
      overflowWrap: 'break-word', // Ensure long words are split properly
    },
    noData: {
      textAlign: 'center',
      fontStyle: 'italic',
      fontSize: '7px',
    },
  };

  const tableContent = (
    <View style={styles.tableContent}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { minWidth: 40 }]}>N° M</Text>
        <Text style={[styles.headerCell, { minWidth: 70 }]}>Étudiant</Text>
        <Text style={[styles.headerCell, { minWidth: 80 }]}>UE1</Text>
        <Text style={[styles.headerCell, { minWidth: 40 }]}>Total UE1</Text>
        <Text style={[styles.headerCell, { minWidth: 80 }]}>UE2</Text>
        <Text style={[styles.headerCell, { minWidth: 40 }]}>Total UE2</Text>
        <Text style={[styles.headerCell, { minWidth: 40 }]}>UE3</Text>
        <Text style={[styles.headerCell, { minWidth: 30 }]}>Total UE3</Text>
        <Text style={[styles.headerCell, { minWidth: 50 }]}>Status</Text>
        <Text style={[styles.headerCell, { minWidth: 50 }]}>Total Générale</Text>
      </View>

      {/* Table Rows */}
      {Affresult.length > 0 ? (
        Affresult.map((item, i) => (
          <View
            key={i}
            style={[styles.dataRow, { backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#ffffff' }]}>
            {/* Display Student Name */}
            <Text style={[styles.dataCell , { minWidth: 40 }]}>{item.numetud}</Text>
            <Text style={[styles.dataCell , { minWidth: 70 }]}>{item.etudiant}</Text>

            {/* Display Unit (UE1, UE2, UE3) and their Average */}
            {item.moyennes && item.moyennes.length > 0 ? (
              <>
                <Text style={[styles.dataCell , { minWidth: 80 }]}>
                  {item.moyennes[0]?.matieres || '-'}
                </Text>
                <Text style={[styles.dataCell , { minWidth: 40 }]}>
                  {item.moyennes[0]?.moyenne || '-'}
                </Text>
                <Text style={[styles.dataCell , { minWidth: 80 }]}>
                  {item.moyennes[1]?.matieres || '-'}
                </Text>
                <Text style={[styles.dataCell , { minWidth: 40 }]}>
                  {item.moyennes[1]?.moyenne || '-'}
                </Text>
                <Text style={[styles.dataCell , { minWidth: 40 }]}>
                  {item.moyennes[2]?.matieres || '-'}
                </Text>
                <Text style={[styles.dataCell , { minWidth: 30 }]}>
                  {item.moyennes[2]?.moyenne || '-'}
                </Text>
              </>
            ) : (
              <Text style={[styles.dataCell , { minWidth: 70 }]}>-</Text>
            )}

            {/* Display General Average */}
            <Text style={[styles.dataCell, { minWidth: 50 }]}>{item.status || 'Pas de moyenne'}</Text>
            <Text style={[styles.dataCell, { minWidth: 50 }]}>{item.moyenneGenerale || 'Pas de moyenne'}</Text>
          </View>
        ))
      ) : (
        <View style={styles.noData}>
          <Text>Aucune donnée disponible.</Text>
        </View>
      )}
    </View>
  );

  return (
    <div>
      <PDFDownloadLink
        document={
          <Mypdf
            children={tableContent}
            nom_niveau={`${parametre.niveauEtud}`}
            nom_mention={`${parametre.mentionEtud}`}
            nom_parcour={`${parametre.parcourEtud}`}
            session='Normal'
          />
        }
        fileName={`Resultat_${parametre.niveauEtud}_${parametre.mentionEtud}_${parametre.parcourEtud}`}
      >
        <button style={{ padding: '10px 20px', border: 'none', borderRadius: '5px' }} className='text-red-400 bg-gray-200'>
          <FaFilePdf size={35} />
        </button>
      </PDFDownloadLink>
    </div>
  );
}

export default ResultatPage;
