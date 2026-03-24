import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey:            "AIzaSyDchXajXFpL1jKdH_lTYZSrMgIfH7zLWQc",
  authDomain:        "aeddi-c09a7.firebaseapp.com",
  projectId:         "aeddi-c09a7",
  storageBucket:     "aeddi-c09a7.firebasestorage.app",
  messagingSenderId: "660311085352",
  appId:             "1:660311085352:android:288f02b728d932cc9cc01d",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export default app;