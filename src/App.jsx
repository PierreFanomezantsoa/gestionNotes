import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import TopBar from './components/TopBar';
import { Sun, Moon } from "lucide-react";
import Moyenne from "./components/Etudiants/Afficahage_moyenne";
import Note from "./components/Note/ListNote";
import Acceuil from './components/Acceuil';
import AnotherPage from './components/AnotherPage';
import Myelement_const from "./components/Note/Myelement_constitif";
import Login from './components/Login';
import './App.css';
import Professeur from "./components/Porofesseur/AffichageProfesseur";
import Parcours from './components/Etudiants/Parcours';
import CryptoJS from 'crypto-js';
import Marketing from './components/Etudiants/Mareting';
import backgroundBlure from '../src/assets/back4.jpg';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const encryptData = (data) => CryptoJS.AES.encrypt(data, 'your-secret-key').toString();
  const decryptData = (data) => {
    try {
      const bytes = CryptoJS.AES.decrypt(data, 'your-secret-key');
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Failed to decrypt data:", error);
      return null;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => decryptData(localStorage.getItem('isAuthenticated')) === 'true');
  const handleAuthentication = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('isAuthenticated', encryptData(status.toString()));
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Router>
      <div className="w-full h-screen flex fixed">
        {/* Background image with blur effect using Tailwind CSS */}
        <div
          className="absolute -inset-2 bg-cover bg-center "
          style={{ backgroundImage: `url(${backgroundBlure})` }}
        ></div>

        <button
          onClick={toggleTheme}
          className="absolute z-50 top-5 right-[7%] px-4 py-2 text-gray-700 dark:text-white rounded"
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>


        {isAuthenticated && <NavigationBar isDarkMode={isDarkMode} className='z-30'/>}
        <div className="flex-1 flex flex-col rounded-md relative z-40  bg-black bg-opacity-5 backdrop-blur-sm">
          {isAuthenticated && (
            <TopBar isDarkMode={isDarkMode} className="px-15 justify-center shadow-lg shadow-indigo-500/20 rounded-lg" setIsAuthenticated={handleAuthentication}/>
          )}
          <main className=" flex-grow scrollbar overflow-y-auto h-[750px]  text-black dark:text-white rounded-lg m-2 pb-10">
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/" element={<Login setIsAuthenticated={handleAuthentication} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Myelement_const />} />
                  <Route path="/moyenne" element={<Moyenne />} />
                  <Route path="/afficahe/:nomNiveau1/:nomMention2/:nomParcours3" element={<Note />} />
                  <Route path="/Parcours" element={<Parcours />} />
                  <Route path="/Professeur" element={<Professeur />} />
                  <Route path="/Etudiants/MCI" element={<Marketing />} />
                  <Route path="/element_constitif" element={<Acceuil />} />
                  <Route path="/another-page" element={<AnotherPage />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
