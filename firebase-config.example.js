// 1. Create a free project at https://console.firebase.google.com
// 2. Add a Web App inside it, copy the config object it gives you, paste below.
// 3. In the Firebase console: Build > Firestore Database > Create database (production mode is fine).
// 4. Under Firestore > Rules, paste the rules from README.md and Publish.
// 5. Copy this file to firebase-config.js (same folder) and fill in real values.
//    firebase-config.js is what the app actually loads — this file is just the template.

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
