import React, { useState } from 'react';
import { format } from 'date-fns';
import ConfirmDialog from './ConfirmDialog';
import firebase from 'firebase/compat/app';

function ChatMessage(props) {
    const { text, uid, photoURL, displayName, createdAt, id, imageUrl } = props.message;
    const [showConfirm, setShowConfirm] = useState(false);

    const messageClass = uid === props.auth.currentUser.uid ? 'sent' : 'received';
    const formattedDate = format(createdAt.toDate(), 'HH:mm');

    const deleteMessage = async (messageId) => {
        try {
            const query = await props.messagesRef.where('id', '==', messageId).get();
            const documentRef = query.docs[0].ref;
            const docSnapshot = await documentRef.get();
            const { imageUrl } = docSnapshot.data();
    
            if (imageUrl) {
                // Get a reference to the image file in Firebase Storage
                const imageRef = firebase.storage().refFromURL(imageUrl);
                // Delete the image
                await imageRef.delete();
            }
    
            // Delete the message document
            await documentRef.delete();
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    const handleDelete = () => {
        setShowConfirm(true);
    };

    const confirmDelete = (confirm) => {
        setShowConfirm(false);
        if (confirm) {
            deleteMessage(id);
        }
    };

    let userPhoto;
    if (uid === props.auth.currentUser.uid) {
        userPhoto = <img class='userPhoto selfPhoto' src={photoURL} alt="User" onClick={handleDelete} />;
    } else {
        userPhoto = <img class='userPhoto' src={photoURL} alt="User" />;
    }

    // Function to convert URLs in text into clickable links
    const textWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
    };

    return (
        <>
            <div className={`message ${messageClass}`}>
                <span id='name-span'>{displayName} - {formattedDate}</span>
                <div className="message-content">
                    <div>
                        {userPhoto}
                    </div>
                    {text ? <p dangerouslySetInnerHTML={{ __html: textWithLinks(text) }} /> : <a href={imageUrl} target="_blank"><img className='messagePhoto imgWithText' src={imageUrl} alt="Sent"/></a>}
                    
                </div>
                <div className='messagePhotoContainer'>
                {imageUrl && text && <a href={imageUrl} target="_blank"><img className='messagePhoto' src={imageUrl} alt="Sent"/></a>}
                </div>
                
            </div>
            {showConfirm && (
                <>
                    <div className="overlay"></div>
                    <ConfirmDialog onConfirm={confirmDelete} />
                </>
            )}
        </>
    );
}

export default ChatMessage;
