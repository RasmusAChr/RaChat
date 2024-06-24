import React, { useState, useEffect } from 'react';
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

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="loading-screen">
      Loading...
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      {user ? (
        <>
          <header>
            <div></div>
            <div><h1>RaChat</h1></div>
            <div><SignOut auth={auth} /></div>
          </header>
          <section>
            <ChatRoom messagesRef={messagesRef} auth={auth} />
          </section>
        </>
      ) : (
        <>
          <header>
            <div style={user ? { display: 'block' } : { display: 'none' }} ></div>
            <div style={{ width: '100%' }}><h1>RaChat</h1></div>
          </header>
          <section>
            <div className="welcome-message">
              <h2>Welcome to RaChat</h2>
              <p>This is my own home-made live chat platform. To be able to use the chat, you'll have to sign in using a Google account. Feel free to try it out, but remember to keep a sober tone, since it's a public chat. To delete a message of your own, you can click on your profile picture besides the message. Visit the <a style={{ color: '#4385f0' }} href="https://github.com/RasmusAChr/RaChat">Github Repository</a> to learn more.</p>
            </div>
            <SignIn auth={auth} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
