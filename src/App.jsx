import React, { useState, useRef, useEffect } from 'react'; // Import React
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

import SignIn from './SignIn.jsx';
import SignOut from './SignOut.jsx';
import ChatRoom from './ChatRoom.jsx';

firebase.initializeApp({
  apiKey: "AIzaSyB_u3atfkoaySRM2T80Rr0tmoxLoknWXGA",
  authDomain: "rac-rachat.firebaseapp.com",
  projectId: "rac-rachat",
  storageBucket: "rac-rachat.appspot.com",
  messagingSenderId: "2577915894",
  appId: "1:2577915894:web:a5fe54e95a3ef42c5971d7",
  measurementId: "G-ERSSYD9RVN"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const messagesRef = firestore.collection('messages'); // Define messagesRef here

function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <div className="App">
        <header>
          <div></div>
          <div><h1>RaChat</h1></div>
          <div><SignOut auth={auth} /></div>
        </header>
        <section>
          {user ? <ChatRoom messagesRef={messagesRef} auth={auth} /> : <SignIn auth={auth} />}
        </section>
      </div>
    </>
  )
}

export default App;