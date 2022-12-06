# Modelos Basados en el Contenido

**Descripción de código desarrollado**

La aplicacion se encuentra desarrollada bajo el "lenguaje de programacion" Typescript, enfocandola al uso en local. Para ello recibe por argumentos del proceso el documento, el fichero stop-words y por ultimo el corpus.

En el caso de que se hayan introducido correctamente y existan, como primer paso del programa, se procedera a la limpieza de los documentos, esto es:
  - Pasar todo a minuscula.
  - Eliminar stop-words haciendo uso del fichero pasado por argumento.
  - Eliminar signos de puntuacion.
  - Eliminar espacios.
  - Lematizar usando el fichero corpus pasado por argumento.

Una vez terminada la limpieza de los documentos se procedera al calculo del TF, IDF, TF-IDF y la Similaridad Coseno entre pares de documentos (0-1, 2-3, 4-5 ....).

Los resultados se presentan en tablas por documentos salvo por los valores de IDF y TF-IDF cuyo calculo requiere de todos los documentos.

**Leyenda de ejecución**

```text
  node ./index.js [DocumentsFile] [StopWordsFile] [CorpusFile]
```

**Ejemplo de uso**

1. Clonar el repositorio.
2. Situarse en la raiz del proyecto.
3. Instalar las dependencias con npm i.
4. Realizar un npm run build.
5. Ejecutar con "node .dist/index.js -f [DocumentFile] -s [StopWordsFile] -c [CorpusFile]". 

?. Ejemplo: node ./dist/index.js -f ./documents/documents.txt -s ./stop-words/stop-words.txt -c ./corpus/corpus.txt
?. Ejectuar con -h para la ayuda.
