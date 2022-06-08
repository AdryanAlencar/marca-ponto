import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'marcaponto-1e262.appspot.com'
});
  
const bucket = getStorage().bucket();

const checkFile = async (fileName: string) => {
    let file = bucket.file(fileName);
    let exists = await file.exists();

    return exists[0];
}

const saveContent = async (fileName: string, content: string) => {
    let file = bucket.file(fileName);
    let upload = file.save(content);

    return upload;
}

const getContent = async (fileName: string) => {
    let file = bucket.file(fileName);
    let content = await file.download();

    return content.toString();
}

export { checkFile, saveContent, getContent }