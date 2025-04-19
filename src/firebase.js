import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

// Configuração do Firebase (substitua com suas credenciais reais)
const firebaseConfig = {
  apiKey: "AIzaSyBqQ_5XQY5e7MnfMGlo264oht9894J_L0w",
  authDomain: "armazem-dona-lourdes-924c3.firebaseapp.com",
  projectId: "armazem-dona-lourdes-924c3",
  storageBucket: "armazem-dona-lourdes-924c3.appspot.com", // Certifique-se de que o storageBucket está correto
  messagingSenderId: "589661561955",
  appId: "1:589661561955:web:f6416dc52574cd69898456"
};

// Inicializa o Firebase com a configuração
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

const storage = getStorage(app);

// Exporta o db para ser usado em outros arquivos
export { db, storage }; 


