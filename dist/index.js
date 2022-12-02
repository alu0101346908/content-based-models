"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
// Read file from path
function readFromFile(path) {
    const file = fs.readFileSync(path, 'utf8');
    return file.split('\n');
}
// Remove stop words
function removeStopWords(document, path) {
    const stopWords = readFromFile(path);
    stopWords.forEach((word) => {
        document = document.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    });
    return document;
}
// Lematize document with corpus file
function lematize(document, path) {
    const file = readFromFile(path);
    const corpus = JSON.parse(file);
    let splittedDocument = document.split(' ');
    splittedDocument.forEach((word, index) => {
        if (corpus[word]) {
            splittedDocument[index] = corpus[word];
        }
    });
    return splittedDocument.join(' ');
}
// Remove puntuation, numbers and special characters
function removePuntuation(document) {
    return document.replace(/[^a-zA-Z ]/g, '');
}
// Remove puntuation, numbers and special characters and stop words
function cleanDocument(document, stopWordsPath, corpusPath) {
    document = document.toLowerCase();
    document = removeStopWords(document, stopWordsPath);
    document = removePuntuation(document);
    document = removeSpaces(document);
    document = lematize(document, corpusPath);
    return document;
}
// Remove empty words
function removeSpaces(document) {
    return document.replace(/\s+/g, ' ').trim();
}
// Función que devuelve una tupla de datos siendo e1 el índice, e2 el término y e3 el valor del TF
function getTF(document) {
    let terms = document.split(' ');
    let termsFiltered = terms.filter((term) => term !== '');
    let termsFilteredMap = new Map();
    // Contamos el número de veces que aparece cada término
    termsFiltered.map((term) => {
        if (termsFilteredMap.has(term)) {
            if (typeof termsFilteredMap.get(term) == 'number') {
                termsFilteredMap.set(term, termsFilteredMap.get(term) + 1);
            }
        }
        else {
            termsFilteredMap.set(term, 1);
        }
    });
    // Calculamos el TF
    let termsFilteredMapArray = Array.from(termsFilteredMap);
    let termsFilteredMapArraySorted = termsFilteredMapArray.sort((a, b) => b[1] - a[1]);
    //let termsFilteredMapArraySortedTF: [string, number][] = termsFilteredMapArraySorted.map((term: [string, number]) => [term[0], term[1] / termsFiltered.length]);
    return termsFilteredMapArraySorted;
}
// Función that calculates the Inverse Document Frequency
function getIDF(documents) {
    let terms = [];
    documents.forEach((document) => {
        terms = terms.concat(document.split(' '));
    });
    let termsFilteredMap = new Map();
    // Contamos el número de veces que aparece cada término
    terms.map((term) => {
        if (termsFilteredMap.has(term)) {
            if (typeof termsFilteredMap.get(term) == 'number') {
                termsFilteredMap.set(term, termsFilteredMap.get(term) + 1);
            }
        }
        else {
            termsFilteredMap.set(term, 1);
        }
    });
    // Calculamos el IDF
    let termsFilteredMapArray = Array.from(termsFilteredMap);
    let termsFilteredMapArraySorted = termsFilteredMapArray.sort((a, b) => b[1] - a[1]);
    let termsFilteredMapArraySortedIDF = termsFilteredMapArraySorted.map((term) => [term[0], Math.log(documents.length / term[1])]);
    return termsFilteredMapArraySortedIDF;
}
// Programa principal
let documents = readFromFile('documents/documents-01.txt');
let documentsCleaned = [];
documents.forEach((document) => {
    let documentSplit = cleanDocument(document, 'stop-words/stop-words-en.txt', 'corpus/corpus-en.txt');
    documentsCleaned.push(documentSplit);
});
let TF = [];
documentsCleaned.forEach((document) => {
    getTF(document).forEach((value) => {
        TF.push(value);
    });
});
// console.log(TF);
console.log(getIDF(documentsCleaned));
