import React, { useState, useRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'; // Import Firebase Storage
import ChatMessage from './ChatMessage';

function ChatRoom(props) {
    const messagesRef = props.messagesRef;
    const auth = props.auth;
    const storage = firebase.storage(); // Initialize Firebase Storage

    const dummy = useRef();
    const fileInputRef = useRef(); // Declare the file input reference
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!formValue.trim() && !image) {
            return;
        }

        const { uid, photoURL, displayName } = auth.currentUser;
        const messageId = uuidv4();
        let imageUrl = '';

        if (image) {
            const imageRef = storage.ref().child(`images/${messageId}`);
            await imageRef.put(image);
            imageUrl = await imageRef.getDownloadURL();
        }

        await messagesRef.add({
            id: messageId,
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName,
            imageUrl
        });

        setFormValue('');
        setImage(null);
        fileInputRef.current.value = null; // Reset file input
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleChooseImage = () => {
        if (image) {
            setImage(null); // Clear the selected image
            fileInputRef.current.value = null; // Reset file input
        } else {
            fileInputRef.current.click();
        }
    };


    let lastDate = null;

    return (
        <>
            <main>
                <div>
                    {messages &&
                        messages.map((msg) => {
                            if (!msg.createdAt) {
                                return null;
                            }
                            const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
                            const messageDate = msg.createdAt.toDate().toLocaleDateString('en-US', options);
                            const isNewDay = messageDate !== lastDate;
                            lastDate = messageDate;
                            return (
                                <React.Fragment key={msg.id}>
                                    {isNewDay && <div id='span-date'><span><u><b>{messageDate}</b></u></span></div>}
                                    <ChatMessage auth={auth} key={msg.id} message={msg} messagesRef={messagesRef} />
                                </React.Fragment>
                            );
                        })}
                </div>
                <div ref={dummy}></div>
            </main>
            <form onSubmit={sendMessage}>
                <input id='text-input' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                <div className='imageBtnContainer'>
                    <button className='uploadImgBtn' type="button" onClick={handleChooseImage}>
                        {image ? 'Remove Image' : 'Choose Image'}
                    </button>
                    {image ? <p className='selectedImgText'>Selected: {image.name}</p> : <p className='selectedImgText'>‎</p>}
                </div>
                <button type="submit">
                    <img src="right-arrow.svg" alt="Send" />
                </button>
            </form>
        </>
    );
}

export default ChatRoom;
