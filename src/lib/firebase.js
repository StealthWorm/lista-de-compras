import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBKPqN0qvSPjFEbCQBWvpfUGvEfvSoeIzQ',
  authDomain: 'lista-de-compras-38d91.firebaseapp.com',
  projectId: 'lista-de-compras-38d91',
  storageBucket: 'lista-de-compras-38d91.firebasestorage.app',
  messagingSenderId: '660073881318',
  appId: '1:660073881318:web:475155bcc58295411ea527',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(
  app,
  {
    //persistentLocalCache guarda a lista e a fila de gravações neste navegador
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(), //persistentMultipleTabManager() garante que todas as abas do navegador tenham acesso à lista
    }),
  },
  'lista',
);

export { auth, db };
