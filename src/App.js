import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {

        const signedOutUser = {

          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          success: false

        }
        setUser(signedOutUser);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      })
  }
  const handleBlur =(event) =>{
    // console.log( event.target.name ,':', event.target.value);
    let isFormValid = true;


    if (event.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isEmailValid);

    }
    if(event.target.name === 'password'){

      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid =isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;

      setUser(newUserInfo);
    }


  }
  const handleSubmit = (event) => {
    console.log(user.email, user.password)
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then( res =>  {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch(error => {
        // Handle Errors here.
        // var errorCode = error.code;

        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ...
      });    }
    event.preventDefault();

  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut} > Sign out</button> :
          <button onClick={handleSignIn} > Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome , {user.name}</p>
          <p>Welcome, {user.email}</p>
          <img src={user.photo} alt="" />

        </div>

      }

      <h4> Our own Authentication system</h4>

      


      <form onSubmit={handleSubmit}>

        <input name="name" onBlur={handleBlur}  placeholder="Enter your name" type="text"/>
        <br/>
        <input type="text" onBlur={handleBlur} name="email" required placeholder="Write your email address" />
        <br />
        <input type="password" onBlur={handleBlur} name="password" required placeholder="Write your password" />
        <br />

        <input type="submit" value="Submit"/>
      </form>
      <p style={{color:'red'}}> {user.error} </p>
      {
        user.success &&  <p style={{color:'red'}}>User created successfully</p>
      }

    </div>
  );
}

export default App;
