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
        {user ?
          <header>
            <div></div>
            <div><h1>RaChat</h1></div>
            <div><SignOut auth={auth} /></div>
          </header>
          :
          <header>
            <div style={user ? { display: 'block' } : { display: 'none' }} ></div>
            <div style={{ width: '100%' }}><h1>RaChat</h1></div>
          </header>
        }
        <section>
          {user ? <ChatRoom messagesRef={messagesRef} auth={auth} /> :
            <>
              <div className="welcome-message">
                <h2>Welcome to RaChat</h2>
                <p>This is my own home-made live chat platform. To be able to use the chat, you'll have to sign in using a Google account. Feel free to try it out, but remember to keep a sober tone, since it's a public chat. To delete a message of your own, you can click on your profile picture besides the message. Visit the <a style={{ color: '#4385f0' }} href="https://github.com/RasmusAChr/RaChat">Github Repository</a> to learn more.</p>
              </div>
              <SignIn auth={auth} />
            </>}
        </section>
      </div>
    </>
  )
}

export default App;