import React, { useState, useRef, useEffect } from 'react'; // Import React
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { format } from 'date-fns';

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
          <div><SignOut /></div>
        </header>
        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </div>
    </>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button className='sign-in' onClick={signInWithGoogle}><img src='googleg.png' />Sign in with Google</button> // <img style={{ width: 'auto' }} src='google.png' />
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) {
      return;
    }
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName: auth.currentUser.displayName
    });
    setFormValue('');
  };

  let lastDate = null; // Variable to store the last message date

  return (
    <>
      <main>
        <div>
          {messages &&
            messages.map((msg) => {
              if (!msg.createdAt) {
                return null; // Skip rendering if createdAt is null or undefined
              }
              const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
              const messageDate = msg.createdAt.toDate().toLocaleDateString('en-US', options); // Get message date
              const isNewDay = messageDate !== lastDate; // Check if it's a new day
              lastDate = messageDate; // Update last date
              return (
                <React.Fragment key={msg.id}>
                  {isNewDay && <div id='span-date'><span>{messageDate}</span></div>} {/* Render span if it's a new day */}
                  <ChatMessage key={msg.id} message={msg} displayName={msg.displayName} createdAt={msg.createdAt} />
                </React.Fragment>
              );
            })}
        </div>
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">
          <img style={{ width: '100%', margin: '0' }} src="right-arrow.svg" />
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, displayName, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  // Format the date to a readable format
  const formattedDate = format(createdAt.toDate(), 'HH:mm');

  return (
    <>
      <div className={`message ${messageClass}`}>
        <span>{displayName} - {formattedDate}</span>
        <div className="message-content">
          <img src={photoURL} alt="User" />
          <p>{text}</p>
        </div>
      </div>
    </>
  )

}

export default App;
