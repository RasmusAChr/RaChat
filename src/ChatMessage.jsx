import React, { useState } from 'react';
import { format } from 'date-fns';
import ConfirmDialog from './ConfirmDialog';
import firebase from 'firebase/compat/app';

function ChatMessage(props) {
    const { text, uid, photoURL, displayName, createdAt, id, imageUrl } = props.message; // Variables from a message.
    const [showConfirm, setShowConfirm] = useState(false);

    const messageClass = uid === props.auth.currentUser.uid ? 'sent' : 'received'; // Determines if the message is from authenticated user or not.
    const formattedDate = format(createdAt.toDate(), 'HH:mm');

    // Deletes a specific message written by user.
    const deleteMessage = async (messageId) => {
        try {
            // Gets the message database document reference.
            const query = await props.messagesRef.where('id', '==', messageId).get();
            const documentRef = query.docs[0].ref;

            // Gets the imageurl from the message.
            // If no image exists its set to none.
            const docSnapshot = await documentRef.get();
            const { imageUrl } = docSnapshot.data();
    
            // If there is an image attached in the message
            if (imageUrl) {
                // Gets a reference to the image file in Firebase Storage
                const imageRef = firebase.storage().refFromURL(imageUrl);
                // Deletes the image
                await imageRef.delete();
            }
    
            // Deletes the message document from the database
            await documentRef.delete();
        } catch (error) {
            console.error('Error removing document (message): ', error);
        }
    };

    // Shows a confirm dialog for deleting a message.
    const handleDelete = () => {
        setShowConfirm(true);
    };

    // Starts the process of deleting an image if user has confirmed.
    const confirmDelete = (confirm) => {
        setShowConfirm(false);
        if (confirm) {
            deleteMessage(id);
        }
    };

    // Determine the profile picture besides the message.
    let userPhoto;
    // If it's a sent message from the user.
    if (uid === props.auth.currentUser.uid) { 
        userPhoto = <img class='userPhoto selfPhoto' src={photoURL} alt="User" onClick={handleDelete} />;
    } 
    // If it's a recieved message from another user.
    else {
        userPhoto = <img class='userPhoto' src={photoURL} alt="User" />;
    }

    // Function to convert URLs in text into clickable links
    // Uses regex to determine whether some of the text is a link.
    const textWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
    };

    // HTML for the chat message
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

            {/* When user has clicked the delete button a
                black overlay and the confirm dialog will appear */}
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
