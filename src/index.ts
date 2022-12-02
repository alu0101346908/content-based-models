import * as fs from 'fs';


// Read file from path
function readFromFile(path: string): string[] {
  const file: string = fs.readFileSync(path, 'utf8');
  return file.split('\n');
}

// Remove stop words
function removeStopWords(document: string, path: string): string {
  const stopWords: string[] = readFromFile(path);
  stopWords.forEach((word: string) => { 
    document = document.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  });
  return document;
}


// Lematize document with corpus file
function lematize(document: string, path:string): string {
  const file: any = readFromFile(path);
  const corpus = JSON.parse(file);
  let splittedDocument: string[] = document.split(' ')
  splittedDocument.forEach((word: string, index: number) => {
    if (corpus[word]) {
      splittedDocument[index] = corpus[word];
    }
  });
  return splittedDocument.join(' ');
}

// Remove puntuation, numbers and special characters
function removePuntuation(document: string): string {
  return document.replace(/[^a-zA-Z ]/g, '');
}


// Remove puntuation, numbers and special characters and stop words
function cleanDocument(document: string, stopWordsPath: string, corpusPath: string): string {
  document = document.toLowerCase();
  document = removeStopWords(document, stopWordsPath);
  document = removePuntuation(document);
  document = removeSpaces(document);
  document = lematize(document, corpusPath);
  return document;
}


// Remove empty words
function removeSpaces(document: string): string {
  return document.replace(/\s+/g, ' ').trim();
}



// Función que devuelve una tupla de datos siendo e1 el índice, e2 el término y e3 el valor del TF
function getTF(document: string): [string, number][] {
    let terms: string[] = document.split(' ');
    let termsFiltered: string[] = terms.filter((term: string) => term !== '');
    let termsFilteredMap: Map<string, number> = new Map();
    // Contamos el número de veces que aparece cada término
    termsFiltered.map((term: string) => {
      if (termsFilteredMap.has(term)) {
        if(typeof termsFilteredMap.get(term) == 'number') {
            termsFilteredMap.set(term, termsFilteredMap.get(term) as number + 1);
        }
      } else {
        termsFilteredMap.set(term, 1);
      }
    });
    // Calculamos el TF
    let termsFilteredMapArray: [string, number][] = Array.from(termsFilteredMap);
    let termsFilteredMapArraySorted: [string, number][] = termsFilteredMapArray.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    //let termsFilteredMapArraySortedTF: [string, number][] = termsFilteredMapArraySorted.map((term: [string, number]) => [term[0], term[1] / termsFiltered.length]);
    return termsFilteredMapArraySorted;
}

// Función that calculates the Inverse Document Frequency
function getIDF(documents: string[]): [string, number][] {
  let terms: string[] = [];
  documents.forEach((document: string) => {
    terms = terms.concat(document.split(' '));
  });
  let termsFilteredMap: Map<string, number> = new Map();
  // Contamos el número de veces que aparece cada término
  terms.map((term: string) => {
    if (termsFilteredMap.has(term)) {
      if(typeof termsFilteredMap.get(term) == 'number') {
          termsFilteredMap.set(term, termsFilteredMap.get(term) as number + 1);
      }
    } else {
      termsFilteredMap.set(term, 1);
    }
  });
  // Calculamos el IDF
  let termsFilteredMapArray: [string, number][] = Array.from(termsFilteredMap);
  let termsFilteredMapArraySorted: [string, number][] = termsFilteredMapArray.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  let termsFilteredMapArraySortedIDF: [string, number][] = termsFilteredMapArraySorted.map((term: [string, number]) => [term[0], Math.log(documents.length / term[1])]);
  return termsFilteredMapArraySortedIDF;
}

// Programa principal
let documents: string[] = readFromFile('documents/documents-01.txt');
let documentsCleaned: string[] = [];
documents.forEach((document: string) => {
    let documentSplit = cleanDocument(document, 'stop-words/stop-words-en.txt','corpus/corpus-en.txt')
    documentsCleaned.push(documentSplit);
});
let TF: [string, number][] = [];
documentsCleaned.forEach((document: string) => {
  getTF(document).forEach((value: [string, number]) => {
    TF.push(value);
  });
});
// console.log(TF);
console.log(getIDF(documentsCleaned));