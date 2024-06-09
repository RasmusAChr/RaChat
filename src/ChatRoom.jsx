import React, { useState, useRef, useEffect } from 'react'; // Import React

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { v4 as uuidv4 } from 'uuid';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import ChatMessage from './ChatMessage';

function ChatRoom(props) {
    const messagesRef = props.messagesRef;
    const auth = props.auth;

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
        const messageId = uuidv4();
        await messagesRef.add({
            id: messageId,
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
                                    {isNewDay && <div id='span-date'><span><u><b>{messageDate}</b></u></span></div>} {/* Render span if it's a new day */}
                                    <ChatMessage auth={auth} key={msg.id} message={msg} messagesRef={messagesRef} />
                                </React.Fragment>
                            );
                        })}
                </div>
                <div ref={dummy}></div>
            </main>
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <button type="submit">
                    <img src="right-arrow.svg" alt="Send" />
                </button>
            </form>
        </>
    );
}

export default ChatRoom;