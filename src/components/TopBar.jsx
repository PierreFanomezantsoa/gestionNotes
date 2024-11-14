import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserRound, SettingsIcon, LogOut ,SearchIcon} from 'lucide-react';
import login from '../assets/login.png'; // Chemin vers l'icône de connexion

function YourComponent({  isDarkMode, setIsAuthenticated }) {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
 
  return (
    <div className=" flex items-center justify-between w-full h-[75px]   dark:text-white dark:bg-gray-600   bg-white border dark:border-gray-700 shadown shadow-md  px-5 py-3">
      {/* Conteneur pour centrer l'input */}
      <div className=" left-8 grid-cols-2 flex px-5 relative gap-3 dark:bg-gray-400  border-gray-300 rounded-full border bg-gray-100 py-2 w-10/12">
        {/* Input de recherche */}
        <SearchIcon size={22} className=' col-span-1'/>
        <input
          type="text"
          placeholder="Rechercher..."
          className={`col-span-1 w-full  dark:bg-gray-400 dark:text-gray-700 bg-gray-100 focus:outline-none border-none  ${isDarkMode ? ' text-white ' : ' text-black'} focus:outline-none `}
        />
      </div>

      <div className="w-12 h-12 right-4 bg-gray-400 rounded-full relative cursor-pointer border border-gray-500" onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}>
        <img src={login} className='rounded-full' alt="login" />
        {/* Dropdown pour l'icône login */}
      {isLoginDropdownOpen && (
      <motion.div className="absolute right-0 top-14 w-[400px] h-[500px] border border-gray-300 bg-white rounded-lg shadow-lg text-black z-50 flex flex-col justify-between">
            <div className="flex flex-col items-center px-4 py-6 border-b bg-blue-200 rounded-md border-gray-400">
                <div className="w-12 h-12 bg-gray-400 rounded-full overflow-hidden cursor-pointer border border-gray-500">
                  <img src={login} className="w-full h-full object-cover" alt="login" />
                </div>
                <p className="font-semibold mt-2">Faculté EGSS-MCI Fianarantsoa</p>
                <p className="text-sm text-gray-500">username@email.com</p>
            </div>
            <div className='px-8 py-4'>
              
          <Link to="/profile" className="w-full flex items-center px-4 py-2 hover:bg-gray-100">
          <UserRound size={20} className="mr-6" />
            <span>Profil</span>
          </Link>
        <Link to="/moyenne" className="flex items-center px-4 py-2 hover:bg-gray-100">
           <SettingsIcon size={20} className="mr-6" />
          <span>Paramètres</span>
        </Link>
            </div>
      <div className='px-8 py-4 mt-auto'>
          <p onClick={() => setIsAuthenticated(false)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer mt-auto">
            <LogOut size={20} className="mr-6" />
            <span>Déconnexion</span>
          </p>
      </div>
  </motion.div>
)}


      </div>
    </div>
  );
}

export default YourComponent;
