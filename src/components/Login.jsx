import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Image from '../assets/egss_mci.jpg'
import { FaUserLarge } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import ImageBack from '../assets/Etudiants.png'
import { FaCriticalRole } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoBagCheckSharp } from "react-icons/io5";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [compte, CreationCompte] = useState(true);
  const [connection, seconnecte] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loginPage, setLoginPage] = useState([]);
   const [showVerificationMessage, setShowVerificationMessage] = useState(false);



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const usernameRef = useRef(null); // Créez une référence

  // methode pour ajout la creation donnée :::::
 const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nom_utilisateur: '',
    mot_de_passe: '',
    role: '',
    mot_confirme:'',
    email_adress: '',
    validation_code:'',
  });

  // pour vide le formulaire 
    const resetFormData = () => {
    setFormData({
      nom_utilisateur: '',
      mot_de_passe: '',
      role: '',
      mot_confirme:'',
      email_adress: '',
      validation_code: '',
    });
  };
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (currentPage === 1 && !formData.nom_utilisateur) {
      setFormErrors({ nom_utilisateur: "Le nom d'utilisateur est requis" });
    } else {
      setFormErrors({});
      setCurrentPage((prev) => prev + 1);
    }
  };

 

  const handleSubmit = async(e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email_adress)) {
      setFormErrors({ email_adress: 'Adresse email invalide' });
      return;
    }

    console.log('Données enregistrées:', formData);
    try {
      if(formData.mot_de_passe===formData.mot_confirme){
        const resultat = await axios.post(`http://localhost:3000/api/account`, formData);
        console.log(resultat);
        console.log(resultat.data.id); 
        console.log(resultat.data.validation_code);
         setCurrentPage(2);
          setFormData((prevData) => ({
        ...prevData,
        variable: resultat.data.validation_code // Assurez-vous que `resultat.data.id` correspond à l'ID renvoyé par l'API
      })); 
      // Mettez à jour `formData` avec l'ID renvoyé
 setFormData((prevData) => ({
   ...prevData,
   id: resultat.data.id // Assurez-vous que `resultat.data.id` correspond à l'ID renvoyé par l'API
 }));
        
        // message pour envoye email 
         setShowVerificationMessage(true);
        setTimeout(() => {
          setShowVerificationMessage(false);
        }, 15000);
      } else {
        alert('Identification mots passe est different !');
      }
    } catch (erreur) {
      console.error('Erreur', erreur);
    }
  };

  // validation user

  const validation = async () => {
    if (formData.variable === formData.validation_code) {
      try {
       const resultat = await axios.post(`http://localhost:3000/api/creation`, formData);
      console.log(resultat.data);
      const reslutat1 = await axios.delete(`http://localhost:3000/api/delete/${formData.id}`,formData);
      console.log(reslutat1.data);
        CreationCompte(true);
        seconnecte(false);
      } catch (erreur) {
        console.error('Erreur code:', erreur);
      }
    } else {
      console.log('Code validation invalide ');
      const reslutat1 = await axios.delete(`http://localhost:3000/api/delete/${formData.id}`,formData);
      console.log(reslutat1.data);
      setCurrentPage(1);
      resetFormData();
    }
  }


  // fonction pour login et password
const ConnectionUser = async (e) => {
    e.preventDefault();

    if (username === '') {
        alert('Veuillez entrer le nom d\'utilisateur !');
    } else if (password === '') {
        alert('Veuillez entrer le mot de passe !');
    } else {
        try {
            const response = await axios.post('http://localhost:3000/api/connection', {
                nomuser: username,
                motpasse: password
            });

            const res = response.data;
            if (res.message === 'success') {
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                alert(res.message); // Affiche le message d'erreur spécifique (Nom d'utilisateur ou Mot de passe incorrect)
            }
        } catch (erreur) {
            console.log('Erreur lors de la connexion :', erreur);
            alert('Mot passe ou nom utilisateur incorrecte !');
        }
    }
};


  // methode pour afficher formulaire compte 
  const afficheCreate = () => {
    CreationCompte(false);
    seconnecte(true);
    setCurrentPage(1);
    resetFormData();
    console.log('bonjour !!');
  }

  //redirection au page champs nom utilisateur 
   const focusOnUsername = () => {
    if (usernameRef.current) {
      usernameRef.current.focus(); // Utilisez la référence pour mettre le focus
    }
  };
  // conection 
  const connection_compte = () => {
    focusOnUsername();
    CreationCompte(true);
    seconnecte(false);
    console.log('bonjour !!');
  }
  

 

  return (
    <div className="h-[20%] justify-between flex flex-col-2 fixed">
      <div className="relative h-screen w-screen flex bg-no-repeat justify-center items-center">
        {/* Conteneur de l'image floue */}
        <div className="fixed top-19 bg-indigo-100 m-7 ms-0 pb-6 bg-cover bg-center w-[300px] h-[300px] rounded-full filter backdrop-blur-lg right-[68%] "></div>
        <div className="fixed top-[16%] bg-indigo-200 m-7 ms-4 pb-7 bg-cover bg-center w-[100px] h-[100px] rounded-full filter backdrop-blur-lg right-[56%]"></div>
        <div className="fixed top-[35%] bg-indigo-100 m-7 ms-4 pb-7 bg-cover bg-center w-[100px] h-[100px] rounded-full filter backdrop-blur-lg right-[23%]"></div>

        {/* Contenu textuel et bouton avec un flou d'arrière-plan */}
        <div className="right-[45%] fixed z-10 flex text-center flex-col space-y-10 w-2/4 py-0 justify-center items-center h-4/5 font-bold font-serif ">
          <h1 className="text-black text-2xl dark:text-white " style={{ textShadow: '4px 3px 4px rgba(0, 0, 0, 0)' }}>Bienvenue sur le système de gestion des notes des étudiants.</h1>
          <div className="flex flex-col space-y-4 relative">
            <img src={ImageBack} alt="image" className='w-[600px] h-[500px] '/>
            <button onClick={ connection_compte} className="font-serif rounded-full px-10 py-2" >
              <span className='z-30'>Veuillez connecter !</span>
            </button>
            <button onClick={afficheCreate} className="font-serif text-green-600 rounded-full px-10 py-2">
              <span className='z-30'>S' incrirer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire de connexion au tableau de bord */}
      <div className={connection ? 'hidden':'block' +'flex flex-col justify-center space-y-5 h-[25%] items-center   w-[35%] absolute right-[7%] top-[75%] dark:shadow-gray-700'}>
        <div className='space-y-[14%] border border-gray-400 backdrop-blur-md bg-white 
        text-center px-[14%] py-[18%] rounded-lg shadow-lg  dark:shadow-gray-700
      '>
          <h1 className='text-1xl font-bold font-serif uppercase absolute top-[8%] right-[40%] dark:text-black' >Faculté EGSS-MCI</h1>
          <img src={Image} alt="Avatar"  className='w-[10%] h-[12%] border rounded-full absolute top-[-2%] right-[47%]'/>
          <form onSubmit={ConnectionUser} className='space-y-[12%]'>
                  <div className='relative dark:text-black'>
                <input
                     type="text"
                     ref={usernameRef} 
                    id='nom'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 focus:outline-none border-black font-sans"
                  autocomplete='off'
                  />
                  <label for='nom' className='peer-focus:text-purple-600 absolute left-12 -top-3 font-serif text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all' >Nom utilisateur </label>
                  <FaUserLarge className='absolute left-0 -top-2' size={24} />
            </div>
              <div className='relative dark:text-black'>
                <input
                type={showPassword ? 'text' : 'password'} 
                  id='motde'
                   value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 focus:outline-none border-black font-serif"
                  autocomplete='off'
                  />
                  <label for='motde' className='peer-focus:text-purple-600 absolute left-12 -top-3 font-serif text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all' >Mot de passe </label>
              <IoIosLock className='absolute left-0 -top-2' size={24} />
              <div className="my-4 flex justify-end cursor-pointer absolute -top-3 right-2" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <BsEyeSlashFill className='absolute right-0' size={18} /> // Icon rehefa aseho ny tenimiafina
                ) : (
                  <BsEyeFill className='absolute right-0' size={18} /> // Icon rehefa afenina ny tenimiafina
                )}
              </div>
            </div>
            <div className='text-center'>
              <button type="submit"  className=' w-full py-3 bg-blue-400 text-white font-serif uppercase 
           rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:outline-none active:bg-green-600'>Se connecter</button>
            </div>
          </form>
        </div>
      </div>
      {/*formulaire creation compte :: */}

      <div className={compte ? 'hidden':'block' +'flex flex-col justify-center  w-[35%] h-screen items-center absolute right-[7%] top-[45%] '}>
        <div className='space-y-[4%] border border-gray-400  backdrop-blur-md bg-white  px-[5%] py-[19%] rounded-lg shadow-lg text-center dark:shadow-gray-700'>
          <h1 className='text-1xl font-bold font-serif uppercase absolute top-[12%] left-[35%] dark:text-black' >Creation compte</h1>
        <form onSubmit={handleSubmit} className="space-y-6  max-w-md py-15 mx-auto">
    {currentPage === 1 && (
              <>
                <div className='space-y-10 dark:text-black '>
                  <div className='relative'>
                     
                <input
                  type="text"
                  name="nom_utilisateur"
                  value={formData.nom_utilisateur}
                      onChange={handleChange}
                      id='nomuser'
                  className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors border-b-2 focus:outline-none border-black font-cursive peer "
                  autocomplete='off'
                 
                />
                {formErrors.nom_utilisateur && (
                  <p className="text-red-500">{formErrors.nom_utilisateur}</p>
                  )}
                    <FaUserLarge className='absolute left-0 -top-2' size={24}/>
                    <label for='nomuser' className='peer-focus:text-purple-600 absolute left-12 -top-3 font-serif text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all'>Nom d'utilisateur</label>
                </div>
                <div className='relative'>
                <input
                  type={showPassword1 ? 'text' : 'password'} 
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                      onChange={handleChange}
                      id='motde'
                  className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 focus:outline-none border-black font-serif"
                  autocomplete='off'
                  />
                  <label for='motde' className='peer-focus:text-purple-600 absolute left-12 -top-3 font-serif text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all' >Mot de passe </label>
                    <IoIosLock className='absolute left-0 -top-2' size={24} />
                    <div className="my-4 flex justify-end cursor-pointer absolute -top-3 right-2" onClick={togglePasswordVisibility1}>
                {showPassword1 ? (
                  <BsEyeSlashFill className='absolute right-0' size={18} /> // Icon rehefa aseho ny tenimiafina
                ) : (
                  <BsEyeFill className='absolute right-0' size={18} /> // Icon rehefa afenina ny tenimiafina
                )}
              </div>
                </div>
                <div className='relative'> 
                <input
                  type={showPassword2 ? 'text' : 'password'} 
                  name="mot_confirme"
                  value={formData.mot_confirme}
                      onChange={handleChange}
                      id='confirme'
                  className="w-full px-12  py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 focus:outline-none border-black font-serif"
                  autocomplete='off'
                  />
                    <label for='confirme' className='peer-focus:text-purple-600 absolute left-12 -top-3 font-serif text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all'>Confirmé mot de passe</label>
                    <IoIosLock className='absolute left-0 -top-2' size={24} />
                    <div className="my-4 flex justify-end cursor-pointer absolute -top-3 right-2" onClick={togglePasswordVisibility2}>
                {showPassword2 ? (
                  <BsEyeSlashFill className='absolute right-0' size={18} /> // Icon rehefa aseho ny tenimiafina
                ) : (
                  <BsEyeFill className='absolute right-0' size={18} /> // Icon rehefa afenina ny tenimiafina
                )}
              </div>
                </div>
                <div className='relative'>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                      onChange={handleChange}
                      id='role'
                  className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 focus:outline-none border-black font-serif"
                  autocomplete='off'
                
                  />
                    <label for='role' className='peer-focus:text-purple-600 absolute text-4sm left-12 -top-3 font-serif cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all'>Role</label>
                  <FaCriticalRole className='absolute left-0 -top-2' size={24}/>
                </div>
                <div className='relative'>    
                  <input
                    type="email"
                    name="email_adress"
                    value={formData.email_adress}
                      onChange={handleChange}
                      id='email'
                    className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 border-black focus:outline-none  font-serif"
                   
                  />
                    <label className='peer-focus:text-purple-600 absolute left-12 -top-3 text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4' for="email">Email</label>
                  <MdEmail className='absolute left-0 -top-2' size={24}/>
                </div>
                </div>
               
      </>
            )}
              <div >
      {currentPage === 1 && (
        <button
          type="submit"
          className="w-full font-serif uppercase py-3 bg-green-400 text-white font-medium rounded hover:bg-green-500"
        >
          Suivant
        </button>
      )}
    </div>
  </form>

    {currentPage === 2 && (
            <>
      {showVerificationMessage && (
        <div style={{  marginBottom: '10px' }} className='text-white bg-green-400 border rounded-md w-full py-3'>
          Il y a un code de vérification dans votre email, veuillez le consulter.
        </div>
              )}
              
               <div className='relative'>    
                  <input
                    type="text"
                      name="validation_code"
                      value={formData.validation_code}
                      onChange={handleChange}
                      id='validation'
                    className="w-full px-12 py-2 focus:border-purple-600 focus:border-b-3 transition-colors peer border-b-2 border-black focus:outline-none  font-serif"
                   
                  />
                    <label className='peer-focus:text-purple-600 absolute left-12 -top-3 text-4sm cursor-text peer-focus:text-xs peer-focus:-top-4' for="validation">Code validation</label>
                <IoBagCheckSharp className='absolute left-0 -top-2' size={24} />
                 {formErrors.validation_code && (
                    <p className="text-red-500">{formErrors.validation_code}</p>
                  )}
                </div>
        <input
          type="text"
          name="id"
          value={formData.id}
          readOnly
          className="w-full px-4 py-3 font-cursive bg-gray-100 outline outline-gray-200 rounded-lg hidden"
        />
              <button onClick={(e) => validation(formData.id)} className="w-full py-3
        uppercase font-serif bg-blue-400 text-white font-medium rounded hover:bg-blue-500">
          Enregistrer
        </button>
      </>
    )}

  
   
        </div>
      </div>
    </div>
  );
}

export default Login;
