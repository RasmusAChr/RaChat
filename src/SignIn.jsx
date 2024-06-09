import React from "react";
import firebase from 'firebase/compat/app';

function SignIn(props) {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        props.auth.signInWithPopup(provider);
    }

    return (
        <button className='sign-in' onClick={signInWithGoogle}><img src='googleg.png' alt="Google Logo" />Sign in with Google</button>
    )
}

export default SignIn;