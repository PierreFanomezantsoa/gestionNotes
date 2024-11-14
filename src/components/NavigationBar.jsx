import  { useState } from 'react';
import { Link ,useLocation} from 'react-router-dom'; // Import de Link pour la navigation
import logo from './../assets/egss_mci.jpg';
import { motion } from 'framer-motion';
import {
  SettingsIcon,
  Menu
} from 'lucide-react';
import { MdDashboard ,MdOutlineMenuBook,MdAccountCircle } from "react-icons/md";
import { IoSchoolSharp } from "react-icons/io5";
import { MdArrowDropDownCircle } from "react-icons/md";
import { FaStore } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaLandmark } from "react-icons/fa";



function NavigationBar() {
function activeLink(type = null) {
  const { pathname } = useLocation(); // Maka ny path ankehitriny
  
  let classes = 'cursor-pointer';

  // Manamarina raha manomboka amin'ny '/' ianao
  if (pathname === type && type != '/') {
    classes += ' text-blue-500 bg-blue-100 cursor-pointer border-l-4 rounded-lg'; // Mampiseho ny active style
  } else if (pathname.startsWith(type)) {
    // Manampy ny style amin'ny sub-pages raha ilaina
    classes += ' text-blue-500 bg-blue-100 cursor-pointer border-l-4 rounded-lg';
  } else {
    // Raha tsy mifanaraka ny path, manala ny active style amin'ny '/' raha tsy amin'ny page fandraisana
    if (type === '/' && pathname !== '/') {
      classes += ' text-white'; // Miala amin'ny active style raha tsy amin'ny page fandraisana
    }
  }

  return classes;
}



// Navigation links with active states
const navLinks = [
  {
    name: 'Acceuil',
    icon: MdDashboard,
    path: '/dashboard',
    active: activeLink('/dashboard'),
  },
  {
    name: 'Etudiants',
    icon: IoSchoolSharp,
    path: '/another-page',
    active: activeLink('/another-page'),
  },
  {
    name: 'Professeur',
    icon: MdAccountCircle,
    path: '/Professeur',
    active: activeLink('/Professeur'),
  },
  {
    name: 'Element constitif',
    icon: MdOutlineMenuBook,
    path: '/element_constitif',
    active: activeLink('/element_constitif'),
  },
  {
    name: 'Eco-Ge',
    icon: FaStore,
    mention: [
      {
        name: 'Economie',
        subSubItems: [
          { name: 'L2 Economie', path: '/afficahe/L2/Eco-ge/Economie', active: activeLink('/afficahe/L2/Eco-ge/Economie') },
          { name: 'L3 Economie', path: '/afficahe/L3/Eco-ge/Economie', active: activeLink('/afficahe/L3/Eco-ge/Economie') },
          { name: 'M1 Economie', path: '/afficahe/M1/Eco-ge/Economie', active: activeLink('/afficahe/M1/Eco-ge/Economie') },
          { name: 'M2 Economie', path: '/afficahe/M2/Eco-ge/Economie', active: activeLink('/afficahe/M2/Eco-ge/Economie') },
        ]
      },
      {
        name: 'Gestion',
        subSubItems1: [
          { name: 'L2 Gestion', path: '/afficahe/L2/Eco-ge/Gestion', active: activeLink('/afficahe/L2/Eco-ge/Gestion') },
          { name: 'L3 Gestion', path: '/afficahe/L3/Eco-ge/Gestion', active: activeLink('/afficahe/L3/Eco-ge/Gestion') },
          { name: 'M1 Gestion', path: '/afficahe/M1/Eco-ge/Gestion', active: activeLink('/afficahe/M1/Eco-ge/Gestion') },
          { name: 'M2 Gestion', path: '/afficahe/M2/Eco-ge/Gestion', active: activeLink('/afficahe/M2/Eco-ge/Gestion') },
        ]
      },
      { name: 'L1 Tronc-Commun', path: '/eco_ge', active: activeLink('/eco_ge') },
    ]
  },
  {
    name: 'Sience-Sociale',
    icon: HiMiniUserGroup,
    subItems: [
      {
        name: 'Socio economique',
        path: '/socio_eco',
        active: activeLink('/socio_eco'),
        socioEco: [
          { name: 'L2 socio Eco', path: '/afficahe/L2/socio/Economie', active: activeLink('/afficahe/L2/socio/Economie') },
          { name: 'L3 socio Eco', path: '/afficahe/L3/socio/Economie', active: activeLink('/afficahe/L3/socio/Economie') },
          { name: 'M1 socio Eco', path: '/afficahe/M1/socio/Economie', active: activeLink('/afficahe/M1/socio/Economie') },
          { name: 'M2 socio Eco', path: '/afficahe/M2/socio/Economie', active: activeLink('/afficahe/M2/socio/Economie') },
        ]
      },
      {
        name: 'Socio politique',
        path: '/socio_politique',
        active: activeLink('/socio_politique'),
        socioPolitique: [
          { name: 'L2 socio', path: '/afficahe/L2/socioi/Politique', active: activeLink('/afficahe/L2/socioi/Politique') },
          { name: 'L3 socio', path: '/afficahe/L3/socioi/Politique', active: activeLink('/afficahe/L3/socioi/Politique') },
          { name: 'M1 socio', path: '/afficahe/M1/socioi/Politique', active: activeLink('/afficahe/M1/socioi/Politique') },
          { name: 'M2 socio', path: '/afficahe/M2/socioi/Politique', active: activeLink('/afficahe/M2/socioi/Politique') },
        ]
      },
      {
        name: 'Environnement',
        path: '/socio_environement',
        active: activeLink('/socio_environement'),
        socioEnvironement: [
          { name: 'L2 environnement', path: '/afficahe/L2/socio/Environement', active: activeLink('/afficahe/L2/socio/Environement') },
          { name: 'L3 environnement', path: '/afficahe/L3/socio/Environement', active: activeLink('/afficahe/L3/socio/Environement') },
          { name: 'M1 environnement', path: '/afficahe/M1/socio/Environement', active: activeLink('/afficahe/M1/socio/Environement') },
          { name: 'M2 environnement', path: '/afficahe/M2/socio/Environement', active: activeLink('/afficahe/M2/socio/Environement') },
        ]
      },
      { name: 'L1 Tronc-commun', path: '/commun', active: activeLink('/commun') },
    ]
  },
  {
    name: 'MCI',
    icon: FaLandmark,
    path: '/Etudiants/MCI',
    active: activeLink('/Etudiants/MCI')
  },
  {
    name: 'Parametre',
    icon: SettingsIcon,
    path: '/moyenne',
    active: activeLink('/moyenne')
  },
];

const variants = {
  expanded: { width: '20%' },
  nonExpanded: { width: '5%' }
};

  const [isExpanded, setIsExpanded] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown principal
  const [gestion, setGestion] = useState(false); // Sous-dropdown gestion dans mention eco-ge
  const [dropMention, setMention] = useState(false); // dropdown mention 
  const [isSubDropdownOpen1, setIsSubDropdownOpen1] = useState(false); // dropdown sur  Economie 
  const [socio1, setSocio1] = useState(false); // sous-dropdown pour science socile eco
  const [socio2, setSocio2] = useState(false); // sous-dropdown pour science socile politique
  const [socio3, setSocio3] = useState(false); // sous-dropdown pour science socile enviroment

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonExpanded"}
      variants={variants}
      className={` px-5 py-6 flex flex-col font-serif bg-gray-600 text-white font-medium uppercase shadow-md  overflow-auto scrollbar-none scrollbar-track-slate-500    w-1/5 h-screen relative dark:bg-gray-500
         scrollbar-track-rounded-full ` + (isExpanded ? "px-10" : "px-4")}
    >
      {/* Logo */}
      <div className="logo-div flex space-x-4 items-center text-white text-blod uppercase dark:text-white  ">
        <img src={logo} className="w-9 rounded-full" alt="logo" />
        <span className={isExpanded ? "block" : "hidden "}>EGSS - MCI</span>
      </div><br />
       <div className="logo-div flex space-x-4 items-center text-gray-700 text-blod shadow-lg dark:text-white border rounded-md h-1 bg-gray-200">
        
      </div>

      {/* Bouton menu */}
      <div onClick={() => setIsExpanded(!isExpanded)} className=" cursor-pointer w-8 h-8 text-gray-200 z-40 dark:text-white rounded absolute -right-[-5%] top-8 flex items-center justify-center ">
        <Menu size={20} />
      </div>

      {/* Icône login */}
      

      {/* Navigation links */}

      
      <div className="  flex flex-col mt-10 p-1 space-y-6 text-white font-serif dark:text-white uppercase   scrollbar overflow-y-auto">
        {navLinks.map((item, index) => (
          <div key={index}  >
            <Link
              to={item.path || '#'} // Utiliser 'to' pour définir la route
            className={"flex items-center p-1  font-serif" + item.active}
            >
              <div className="flex items-center space-x-4 font-serif" >
                <item.icon  className='text-2xl'/>
                <span className={isExpanded ? "block" : "hidden"}>{item.name}</span>
              </div>

              {/* Ajouter une icône animée pour le dropdown */}
              {item.subItems && (
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }} // Rotation de 180° quand le dropdown est ouvert
                  transition={{ duration: 0.3 }}
                  className="ml-auto cursor-pointer "
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                </motion.span>
              )}

              {item.mention && (
                <motion.span
                  animate={{ rotate: dropMention ? 180 : 0 }} // Rotation de 180° quand le dropdown est ouvert
                  transition={{ duration: 0.3 }}
                  className="ml-auto cursor-pointer "
                  onClick={() => setMention(!dropMention)}
                >
                  <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                </motion.span>
              )}
            </Link>
            

            {/* Dropdown pour "Drapdown" */}
            {isDropdownOpen && item.subItems && (
              <div className=" ml-6 space-y-4 p-4  font-serif uppercase  " >
                {item.subItems.map((subItem, subIndex) => (
                  <div key={subIndex}  >
                    <Link to={subItem.path} className={"flex items-center font-serif  me-[-6%] p-1 dark:text-white uppercase " + subItem.active}>
                      <span className={isExpanded ? "block" : "hidden"} >{subItem.name}</span>
                      {/* Sous-dropdown avec icône animée */}
                      {subItem.socioEco && (
                        <motion.span
                          animate={{ rotate: socio1 ? 180 : 0 }} // Animation de la flèche du sous-dropdown
                          transition={{ duration: 0.3 }}
                          onClick={() => setSocio1(!socio1)}
                          className="ml-auto cursor-pointer"
                        >
                          <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                        </motion.span>
                      )}
                      {/* dropdown pour socio politique  */}

                        {subItem.socioPolitique && (
                        <motion.span
                          animate={{ rotate: socio2 ? 180 : 0 }} // Animation de la flèche du sous-dropdown
                          transition={{ duration: 0.3 }}
                          onClick={() => setSocio2(!socio2)}
                          className="ml-auto cursor-pointer"
                        >
                          <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                        </motion.span>
                      )}
                       {/* dropdown pour socio environement  */}

                        {subItem.socioEnvironement && (
                        <motion.span
                          animate={{ rotate: socio3 ? 180 : 0 }} // Animation de la flèche du sous-dropdown
                          transition={{ duration: 0.3 }}
                          onClick={() => setSocio3(!socio3)}
                          className="ml-auto cursor-pointer"
                        >
                          <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                        </motion.span>
                      )}
                    </Link>

                    {/* Sous-dropdown pour socio economique */}
                    {socio1 && subItem.socioEco && (
                      <div className="ml-4 space-y-6 p-3 dark:text-white">
                        {subItem.socioEco.map((subSubItem, subSubIndex) => (
                          <Link key={subSubIndex} to={subSubItem.path} className={"flex items-center  justify-between space-x-2 p-1 uppercase " + subSubItem.active  }>
                            <span className={isExpanded ? "block" : "hidden"}>{subSubItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* dropdown pour socio politique  */}
                      {socio2 && subItem.socioPolitique && (
                      <div className="ml-4 space-y-6 p-3  dark:text-white">
                        {subItem.socioPolitique.map((subSubItem, subSubIndex) => (
                          <Link key={subSubIndex} to={subSubItem.path} className={"flex items-center  justify-between space-x-2 p-1 uppercase " + subSubItem.active  }>
                            <span className={isExpanded ? "block" : "hidden"}>{subSubItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* dropdown pour socio environement  */}
                      {socio3 && subItem.socioEnvironement && (
                      <div className="ml-4 space-y-6 p-3 dark:text-white">
                        {subItem.socioEnvironement.map((subSubItem, subSubIndex) => (
                          <Link key={subSubIndex} to={subSubItem.path} className={"flex items-center  justify-between space-x-2 p-1 uppercase " + subSubItem.active  }>
                            <span className={isExpanded ? "block" : "hidden"}>{subSubItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

              {/* dropdown pour mention */}
             {dropMention && item.mention && (
              <div className=" ml-9 space-y-3 p-2  font-serif uppercase " >
                {item.mention.map((subItem, subIndex) => (
                  <div key={subIndex}  >
                    <Link to={subItem.path} className={"flex items-center font-serif  justify-between space-x-4  me-[-3%]  p-1 dark:text-white uppercase " + subItem.active}>
                      <span className={isExpanded ? "block" : "hidden"} >{subItem.name}</span>
                      {/* Sous-dropdown avec icône animée */}
                     
                      {subItem.subSubItems1 && (
                        <motion.span
                          animate={{ rotate: gestion ? 180 : 0 }} // Animation de la flèche du sous-dropdown
                          transition={{ duration: 0.3 }}
                          onClick={() => setGestion(!gestion)}
                          className="ml-auto cursor-pointer"
                        >
                          <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                        </motion.span>
                      )}
                       {subItem.subSubItems && (
                        <motion.span
                          animate={{ rotate: isSubDropdownOpen1 ? 180 : 0 }} // Animation de la flèche du sous-dropdown
                          transition={{ duration: 0.3 }}
                          onClick={() => setIsSubDropdownOpen1(!isSubDropdownOpen1)}
                          className="ml-auto cursor-pointer"
                        >
                          <MdArrowDropDownCircle size={28} className={isExpanded ? "block text-gray-400" : "hidden"} />
                        </motion.span>
                      )}
                    </Link>

                 {isSubDropdownOpen1 && subItem.subSubItems && (
                      <div className="ml-4 space-y-6  p-3 dark:text-white">
                        {subItem.subSubItems.map((subSubItem, subSubIndex) => (
                          <Link key={subSubIndex} to={subSubItem.path} className={"flex items-center  justify-between space-x-3 p-1 uppercase " + subSubItem.active  }>
                            <span className={isExpanded ? "block" : "hidden"}>{subSubItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                      {/* Sous-dropdown pour economie */}
                    {gestion && subItem.subSubItems1 && (
                      <div className="ml-4 space-y-6 p-3 dark:text-white">
                        {subItem.subSubItems1.map((subSubItem, subSubIndex) => (
                          <Link key={subSubIndex} to={subSubItem.path} className={"flex items-center  justify-between space-x-3 p-1 uppercase " + subSubItem.active  }>
                            <span className={isExpanded ? "block" : "hidden"}>{subSubItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default NavigationBar;
