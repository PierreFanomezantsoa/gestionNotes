import React from 'react';
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 65,
    paddingHorizontal: 45,
  },
  title: {
    fontSize: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5, // Setting line height to 1.5 times the font size
  },
  textFloat: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5, // Setting line height to 1.5 times the font size
  },
  textSoustitre: {
    fontSize: 14,
    paddingTop: 9,
    textAlign: 'center',
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5, // Optional: spacing between rows
  },
  
});

const Mypdf = (propos) => {
  return (
    <Document>
      <Page style={styles.body}>
        
        {/* Floating text in a row */}
        <View style={styles.row}>
          <Text style={styles.textFloat}>UNIVERSITE DE FIANARANTSOA</Text>
          <Text style={styles.text}>Resultat des examens EGSS MCI</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.textFloat}>Faculté d' Economie, </Text>
          <Text style={styles.text}>Anneé Universitaire</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.textFloat}> de Gestion et</Text>
          <Text style={styles.text}>Niveau : {propos.nom_niveau}</Text>
              </View>
        <View style={styles.row}>
          <Text style={styles.textFloat}> de Science sociale </Text>
          <Text style={styles.textFloat}>Mention : {propos.nom_mention}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.textFloat}>de developpement</Text>
          <Text style={styles.text}>Parcours : {propos.nom_parcour}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.textFloat}>Formation :</Text>
            <Text style={styles.text}>Session :</Text>
        </View>
        
        <Text style={styles.textSoustitre}>Liste des etudiants Admin en .......</Text>
        
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
};

export default Mypdf;
