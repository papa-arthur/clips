import firebase from 'firebase/compat/app'

export default interface IClip{
    docID?: string
    uid: string;
    displayName: string;
    title: string;
    fileName: string;
    clipUrl: string;
    screenshotUrl: string
    screenshotFileName: string
    timestamp: firebase.firestore.FieldValue
}