import React, { useState, useRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'; // Import Firebase Storage
import ChatMessage from './ChatMessage';
import imageCompression from 'browser-image-compression'; // Import image compression library

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
    const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Function to handle image compression
    const compressImage = async (file) => {
        try {
            const options = {
                maxSizeMB: 0.25,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    };

    // Function to handle sending a message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!formValue.trim() && !image) {
            return;
        }

        const { uid, photoURL, displayName } = auth.currentUser;
        const messageId = uuidv4();
        let imageUrl = '';

        if (image) {
            const compressedImage = await compressImage(image);
            const imageRef = storage.ref().child(`images/${messageId}`);
            const uploadTask = imageRef.put(compressedImage);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Calculate progress percentage
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Error uploading image:', error);
                    // Handle error
                },
                async () => {
                    // Upload completed successfully, get download URL
                    imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
                    console.log('File available at', imageUrl);

                    // Add message to Firestore
                    await messagesRef.add({
                        id: messageId,
                        text: formValue,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        uid,
                        photoURL,
                        displayName,
                        imageUrl,
                    });

                    setFormValue('');
                    setImage(null);
                    setUploadProgress(0); // Reset upload progress
                    fileInputRef.current.value = null; // Reset file input
                }
            );
        } else {
            // No image case
            await messagesRef.add({
                id: messageId,
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
                displayName,
                imageUrl,
            });

            setFormValue('');
            setImage(null);
            fileInputRef.current.value = null; // Reset file input
        }
    };

    const handleImageChange = async (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const compressedFile = await compressImage(file);
            setImage(compressedFile);
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
                                    {isNewDay && (
                                        <div id='span-date'>
                                            <span>
                                                <u>
                                                    <b>{messageDate}</b>
                                                </u>
                                            </span>
                                        </div>
                                    )}
                                    <ChatMessage auth={auth} key={msg.id} message={msg} messagesRef={messagesRef} />
                                </React.Fragment>
                            );
                        })}
                </div>
                <div ref={dummy}></div>
            </main>
            <form onSubmit={sendMessage}>
                <div className='inputTxtContainer'>
                    <input id='text-input' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    {uploadProgress > 0 ? <progress className="progressBar" value={uploadProgress} max='100' /> : <progress style={{visibility: "hidden"}} className="progressBar" value={uploadProgress} max='0' />}
                </div>
                
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                <div className='imageBtnContainer'>
                    <button className='uploadImgBtn' type='button' onClick={handleChooseImage}>
                        {image ? 'Remove Image' : 'Choose Image'}
                    </button>
                    {image ? (
                        <p className='selectedImgText'>Selected: {image.name}</p>
                    ) : (
                        <p className='selectedImgText'>‎</p>
                    )}
                </div>
                <div className='imgButton' onClick={handleChooseImage}>
                    {image ? <img src='deselectimgicon.png' alt='Send' /> : <img src='selectimgicon.png' alt='Send' />}
                    
                </div>
                <div className='sendButton' onClick={sendMessage}>
                    <img src='right-arrow.svg' alt='Send' />
                </div>
            </form>
        </>
    );
}

export default ChatRoom;
