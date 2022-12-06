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
const process_1 = require("process");
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
    let termsFilteredMapArraySortedTF = termsFilteredMapArraySorted.map((term, index) => [index, term[0], term[1] / termsFiltered.length]);
    return termsFilteredMapArraySortedTF;
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
// Función para el cálculo del TF-IDF
function getTFIDF(documents) {
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
    // Calculamos el TF-IDF
    let termsFilteredMapArraySortedTFIDF = termsFilteredMapArraySortedIDF.map((term) => [term[0], term[1] * termsFilteredMap.get(term[0])]);
    return termsFilteredMapArraySortedTFIDF;
}
// Calculate the cosine similarity between two documents
function getCosineSimilarity(document1, document2) {
    let terms1 = document1.split(' ');
    let terms2 = document2.split(' ');
    let terms1Filtered = terms1.filter((term) => term !== '');
    let terms2Filtered = terms2.filter((term) => term !== '');
    let terms1FilteredMap = new Map();
    let terms2FilteredMap = new Map();
    // Contamos el número de veces que aparece cada término
    terms1Filtered.map((term) => {
        if (terms1FilteredMap.has(term)) {
            if (typeof terms1FilteredMap.get(term) == 'number') {
                terms1FilteredMap.set(term, terms1FilteredMap.get(term) + 1);
            }
        }
        else {
            terms1FilteredMap.set(term, 1);
        }
    });
    terms2Filtered.map((term) => {
        if (terms2FilteredMap.has(term)) {
            if (typeof terms2FilteredMap.get(term) == 'number') {
                terms2FilteredMap.set(term, terms2FilteredMap.get(term) + 1);
            }
        }
        else {
            terms2FilteredMap.set(term, 1);
        }
    });
    // Calculamos el TF
    let terms1FilteredMapArray = Array.from(terms1FilteredMap);
    let terms1FilteredMapArraySorted = terms1FilteredMapArray.sort((a, b) => b[1] - a[1]);
    let terms1FilteredMapArraySortedTF = terms1FilteredMapArraySorted.map((term) => [term[0], term[1] / terms1Filtered.length]);
    let terms2FilteredMapArray = Array.from(terms2FilteredMap);
    let terms2FilteredMapArraySorted = terms2FilteredMapArray.sort((a, b) => b[1] - a[1]);
    let terms2FilteredMapArraySortedTF = terms2FilteredMapArraySorted.map((term) => [term[0], term[1] / terms2Filtered.length]);
    // Calculamos el IDF
    let terms1FilteredMapArraySortedIDF = terms1FilteredMapArraySortedTF.map((term) => [term[0], Math.log(2 / term[1])]);
    let terms2FilteredMapArraySortedIDF = terms2FilteredMapArraySortedTF.map((term) => [term[0], Math.log(2 / term[1])]);
    // Calculamos el TF-IDF
    let terms1FilteredMapArraySortedTFIDF = terms1FilteredMapArraySortedIDF.map((term) => [term[0], term[1] * terms1FilteredMap.get(term[0])]);
    let terms2FilteredMapArraySortedTFIDF = terms2FilteredMapArraySortedIDF.map((term) => [term[0], term[1] * terms2FilteredMap.get(term[0])]);
    // Calculamos el producto escalar
    let dotProduct = 0;
    terms1FilteredMapArraySortedTFIDF.forEach((term) => {
        terms2FilteredMapArraySortedTFIDF.forEach((term2) => {
            if (term[0] === term2[0]) {
                dotProduct += term[1] * term2[1];
            }
        });
    });
    // Calculamos la norma de los vectores
    let norm1 = 0;
    terms1FilteredMapArraySortedTFIDF.forEach((term) => {
        norm1 += term[1] * term[1];
    });
    let norm2 = 0;
    terms2FilteredMapArraySortedTFIDF.forEach((term) => {
        norm2 += term[1] * term[1];
    });
    // Calculamos la similitud coseno
    return dotProduct / Math.sqrt(norm1) * Math.sqrt(norm2);
}
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
console.log("===== Welcome to the content-based document analysis program =====");
if (process.argv[2] == "-h") {
    console.log("To run the program correctly \nnode ./index.js -f [DocumentsFile] -s [StopWordsFile] -c [CorpusFile]");
    console.log("Exiting....");
    (0, process_1.exit)();
}
let documentsFile = "";
let stopWordsFile = "";
let corpusFile = "";
if (process.argv.length < 8) {
    console.log("Passed arguments are lesser than expected");
    console.log("node ./index.js -f [DocumentsFile] -s [StopWordsFile] -c [CorpusFile]");
    (0, process_1.exit)();
}
else {
    documentsFile = process.argv[3];
    stopWordsFile = process.argv[5];
    corpusFile = process.argv[7];
}
//comprobar si existen los ficheros
if (!fs.existsSync(documentsFile)) {
    console.log("The documents file does not exist");
    (0, process_1.exit)();
}
if (!fs.existsSync(stopWordsFile)) {
    console.log("The stop words file does not exist");
    (0, process_1.exit)();
}
if (!fs.existsSync(corpusFile)) {
    console.log("The corpus file does not exist");
    (0, process_1.exit)();
}
// Programa principal
let documents = readFromFile(documentsFile);
let documentsCleaned = [];
documents.forEach((document) => {
    let documentSplit = cleanDocument(document, stopWordsFile, corpusFile);
    documentsCleaned.push(documentSplit);
});
let TF = [];
documentsCleaned.forEach((document) => {
    getTF(document).forEach((value) => {
        TF.push(value);
    });
});
// Mostrar los resultados de TF
let documentsTFTables = [];
for (let i = 0; i < documentsCleaned.length; i++) {
    let name = `Document ${i}`;
    let result2 = [];
    let aux = {};
    getTF(documentsCleaned[i]).forEach((value) => {
        let aux = {
            Term: value[1],
            TF: value[2],
        };
        result2.push(aux);
    });
    documentsTFTables.push(result2);
}
console.log('\x1b[32m%s\x1b[0m', 'TF');
documentsTFTables.slice().forEach((value, index) => {
    // color rojo
    console.log('\x1b[31m%s\x1b[0m', `Document ${index}`);
    console.table(value);
});
// Mostrar los resultados de IDF
let result2 = {};
getIDF(documentsCleaned).forEach((value) => {
    let aux = {
        [value[0]]: value[1],
    };
    result2 = Object.assign(result2, aux);
});
console.log('\n');
console.log('\x1b[32m%s\x1b[0m', 'IDF');
console.table(result2);
// Mostrar los resultados de TF-IDF
let result3 = {};
getTFIDF(documentsCleaned).forEach((value) => {
    let aux = {
        [value[0]]: value[1],
    };
    result3 = Object.assign(result3, aux);
});
console.log('\n');
console.log('\x1b[32m%s\x1b[0m', 'TF-IDF');
console.table(result3);
// Comparación de cosenos
let result = {};
for (let i = 0; i < documentsCleaned.length; i += 2) {
    let name = `Document ${i} - Document ${i + 1}`;
    let aux = {
        [name]: getCosineSimilarity(documentsCleaned[i], documentsCleaned[i + 1]),
    };
    result = Object.assign(result, aux);
}
// Console table with the results of the comparison of each pair of documents
// Create space between the tables and the results
console.log('\n');
console.log('\x1b[32m%s\x1b[0m', 'Cosine Similarity');
console.table(result);
