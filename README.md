# RaChat
RaChat is a simple, mobile-friendly chat application built using React and Firebase. This project allows users to sign in with Google, send and receive messages in real-time, and delete their own messages.<br>

You can watch a live demo of this [here](https://rachat.rasmusac.dk/).

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Firebase Configuration](#firebase-configuration)
  - [Running the Application](#running-the-application)
- [License](#license)

## Introduction
RaChat is a responsive web application designed to facilitate real-time communication. Users can sign in using their Google accounts, participate in chat rooms, and manage their messages. The application uses Firebase for authentication, database, and hosting services.

## Features
- Mobile friendly.
- Real-time messaging.
- Google authentication.
- Easy to use interface.
- Ability to delete your own messages.

## Requirements
- Node.js and npm installed on your machine.
- A Firebase project set up for authentication and Firestore.

## Setup
### Firebase Configuration
1. **Create a Firebase Project:**
   - Go to the Firebase Console.
   - Click on "Add Project" and follow the steps to create a new project.

2. **Add Firebase to your app:**
   - In the Firebase Console, add a new web app to your project.
   - Copy the Firebase configuration details provided (apiKey, authDomain, projectId, etc).

3. **Initialize Firebase:**
   - Replace the Firebase configuration in `src/FirebaseConfigTemplate.jsx` with your project's configuration and rename the file to `FirebaseConfig.jsx`.

### Running the Application
1. **Clone the repository:**
   - `git clone https://github.com/your-username/rac-rachat.git`.
   - `cd rac-rachat`.

2. **Install dependencies:**
   - `npm install`.

3. **Start the application:**
   - `npm start`

## License
This project is licensed under the MIT License. See the [License](./LICENSE.md) file for more details.
