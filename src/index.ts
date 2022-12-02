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
function getTF(document: string): [number, string, number][] {
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
    let termsFilteredMapArraySortedTF: [number, string, number][] = termsFilteredMapArraySorted.map((term: [string, number], index: number) => [index, term[0], term[1] / termsFiltered.length]);
    return termsFilteredMapArraySortedTF;
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



// Función para el cálculo del TF-IDF
function getTFIDF(documents: string[]): [string, number][] {
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
  // Calculamos el TF-IDF
  let termsFilteredMapArraySortedTFIDF: [string, number][] = termsFilteredMapArraySortedIDF.map((term: [string, number]) => [term[0], term[1] * (termsFilteredMap.get(term[0]) as number)]);
  return termsFilteredMapArraySortedTFIDF;
}



// Calculate the cosine similarity between two documents
function getCosineSimilarity(document1: string, document2: string): number {
  let terms1: string[] = document1.split(' ');
  let terms2: string[] = document2.split(' ');
  let terms1Filtered: string[] = terms1.filter((term: string) => term !== '');
  let terms2Filtered: string[] = terms2.filter((term: string) => term !== '');
  let terms1FilteredMap: Map<string, number> = new Map();
  let terms2FilteredMap: Map<string, number> = new Map();
  // Contamos el número de veces que aparece cada término
  terms1Filtered.map((term: string) => {
    if (terms1FilteredMap.has(term)) {
      if(typeof terms1FilteredMap.get(term) == 'number') {
          terms1FilteredMap.set(term, terms1FilteredMap.get(term) as number + 1);
      }
    } else {
      terms1FilteredMap.set(term, 1);
    }
  });
  terms2Filtered.map((term: string) => {
    if (terms2FilteredMap.has(term)) {
      if(typeof terms2FilteredMap.get(term) == 'number') {
          terms2FilteredMap.set(term, terms2FilteredMap.get(term) as number + 1);
      }
    } else {
      terms2FilteredMap.set(term, 1);
    }
  });
  // Calculamos el TF
  let terms1FilteredMapArray: [string, number][] = Array.from(terms1FilteredMap);
  let terms1FilteredMapArraySorted: [string, number][] = terms1FilteredMapArray.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  let terms1FilteredMapArraySortedTF: [string, number][] = terms1FilteredMapArraySorted.map((term: [string, number]) => [term[0], term[1] / terms1Filtered.length]);
  let terms2FilteredMapArray: [string, number][] = Array.from(terms2FilteredMap);
  let terms2FilteredMapArraySorted: [string, number][] = terms2FilteredMapArray.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  let terms2FilteredMapArraySortedTF: [string, number][] = terms2FilteredMapArraySorted.map((term: [string, number]) => [term[0], term[1] / terms2Filtered.length]);
  // Calculamos el IDF
  let terms1FilteredMapArraySortedIDF: [string, number][] = terms1FilteredMapArraySortedTF.map((term: [string, number]) => [term[0], Math.log(2 / term[1])]);
  let terms2FilteredMapArraySortedIDF: [string, number][] = terms2FilteredMapArraySortedTF.map((term: [string, number]) => [term[0], Math.log(2 / term[1])]);
  // Calculamos el TF-IDF
  let terms1FilteredMapArraySortedTFIDF: [string, number][] = terms1FilteredMapArraySortedIDF.map((term: [string, number]) => [term[0], term[1] * (terms1FilteredMap.get(term[0]) as number)]);
  let terms2FilteredMapArraySortedTFIDF: [string, number][] = terms2FilteredMapArraySortedIDF.map((term: [string, number]) => [term[0], term[1] * (terms2FilteredMap.get(term[0]) as number)]);
  // Calculamos el producto escalar
  let dotProduct: number = 0;
  terms1FilteredMapArraySortedTFIDF.forEach((term: [string, number]) => {
    terms2FilteredMapArraySortedTFIDF.forEach((term2: [string, number]) => {
      if (term[0] === term2[0]) {
        dotProduct += term[1] * term2[1];
      }
    });
  });
  // Calculamos la norma de los vectores
  let norm1: number = 0;
  terms1FilteredMapArraySortedTFIDF.forEach((term: [string, number]) => {
    norm1 += term[1] * term[1];
  });
  let norm2: number = 0;
  terms2FilteredMapArraySortedTFIDF.forEach((term: [string, number]) => {
    norm2 += term[1] * term[1];
  });
  // Calculamos la similitud coseno
  return dotProduct / Math.sqrt(norm1) * Math.sqrt(norm2);
}



// Programa principal
let documents: string[] = readFromFile('documents/documents-01.txt');
let documentsCleaned: string[] = [];
documents.forEach((document: string) => {
    let documentSplit = cleanDocument(document, 'stop-words/stop-words-en.txt','corpus/corpus-en.txt')
    documentsCleaned.push(documentSplit);
});
let TF: [number, string, number][] = [];
documentsCleaned.forEach((document: string) => {
  getTF(document).forEach((value: [number, string, number]) => {
    TF.push(value);
  });
});

let documentsTFTables : Object[] = [];
for (let i = 0; i < documentsCleaned.length; i++) {
  let name :string = `Document ${i}`
  let result2 : Object[] = [];
  getTF(documentsCleaned[i]).forEach((value: [number, string, number]) => {
    let aux : Object = { // creo un objeto auxiliar con dos propiedades (term y tf)
      Term: value[1],
      TF: value[2],
    }
    result2.push(aux);
  });
  documentsTFTables.push(result2);

}
documentsTFTables.slice().reverse().forEach((value: Object, index) => {
  console.log(`Document ${index}`)
  console.table(value);
});








// Compare each pair of documents
let result : Object = {};
for (let i = 0; i < documentsCleaned.length; i += 2) {
  let name :string = `Document ${i} - Document ${i + 1}`
  let aux : Object = {
    [name]: getCosineSimilarity(documentsCleaned[i], documentsCleaned[i + 1]),
  }
  result = Object.assign(result, aux);
}

// Console table with the results of the comparison of each pair of documents
console.table(result)