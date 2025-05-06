import {initializeApp} from 'firebase/app';

import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBv4sgHRmS4K6J0r03PVOMBkLY0wJYA2uI',
    authDomain: 'dispositivos-b35b0.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'dispositivos-b35b0',
    storageBucket: 'dispositivos-b35b0.firebasestorage.app',
    messagingSenderId: '98403238337',
    appId: '1:98403238337:web:fa967bba31864775b92f40',
    // measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};
