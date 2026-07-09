const DB_NAME = 'DietAppDB';
const DB_VERSION = 1;
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = event => {
            db = event.target.result;
            // Inf_1: Dados imutáveis
            if (!db.objectStoreNames.contains('Inf_1')) {
                db.createObjectStore('Inf_1', { keyPath: 'id' });
            }
            // Inf_2: Alimentos, Pratos, Nomes de Refeições
            if (!db.objectStoreNames.contains('Inf_2')) {
                db.createObjectStore('Inf_2', { keyPath: 'id', autoIncrement: true });
            }
            // Inf_3: Histórico atrelado a datas (ex: "2026-07-08")
            if (!db.objectStoreNames.contains('Inf_3')) {
                db.createObjectStore('Inf_3', { keyPath: 'date' });
            }
        };
        request.onsuccess = event => { db = event.target.result; resolve(); };
        request.onerror = event => reject(event.target.error);
    });
}

function saveData(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function getData(storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getAllData(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
