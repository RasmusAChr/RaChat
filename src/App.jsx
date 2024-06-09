import React, { useState, useRef, useEffect } from 'react'; // Import React
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import FirebaseConfig from './FirebaseConfig.jsx';

import { useAuthState } from 'react-firebase-hooks/auth';

import SignIn from './SignIn.jsx';
import SignOut from './SignOut.jsx';
import ChatRoom from './ChatRoom.jsx';

firebase.initializeApp(FirebaseConfig);

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