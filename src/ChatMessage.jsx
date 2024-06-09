import React, { useState } from 'react'; // Import React

import { format } from 'date-fns';

import ConfirmDialog from './ConfirmDialog';

function ChatMessage(props) {
    const { text, uid, photoURL, displayName, createdAt, id } = props.message; // Destructure id from props.message
    const [showConfirm, setShowConfirm] = useState(false);

    const messageClass = uid === props.auth.currentUser.uid ? 'sent' : 'received';

    // Format the date to a readable format
    const formattedDate = format(createdAt.toDate(), 'HH:mm');

    const deleteMessage = async (messageId) => {
        try {
            const query = await props.messagesRef.where('id', '==', messageId).get();
            const documentRef = query.docs[0].ref;
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

    let deleteButton;
    if (uid === props.auth.currentUser.uid) {
        deleteButton = <img src={photoURL} alt="User" onClick={handleDelete} />;
    } else {
        deleteButton = <img src={photoURL} alt="User" />;;
    }

    return (
        <>
            <div className={`message ${messageClass}`}>
                <span id='name-span'>{displayName} - {formattedDate}</span>
                <div className="message-content">
                    <div>
                        {deleteButton}
                    </div>
                    <p>{text}</p>
                </div>
            </div>
            {showConfirm && (
                <ConfirmDialog onConfirm={confirmDelete} />
            )}
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