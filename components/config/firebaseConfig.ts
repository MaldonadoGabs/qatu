// Firebase se carga desde CDN en el HTML
declare const firebase: any;

// Obtener servicios de Firebase desde el objeto global
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

console.log('🔥 Firebase inicializado correctamente');