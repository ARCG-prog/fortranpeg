import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm';
import { parse } from './parser/gramatica.js';
import { ErrorReglas } from './parser/error.js';


//importaciones
import InterpreteToken from './parser/visitor/visitInterpreteToken/InterpreteToken.js';
import { config } from './parser/varGlobales/global.js';
import { Lista } from './parser/Lista/Lista.js';
//end importaciones
//mis funciones
// Función para crear y descargar un archivo
function descargarArchivo(contenido, nombreArchivo, tipoContenido) {
    const a = document.createElement('a');
    const archivo = new Blob([contenido], { type: tipoContenido });
    a.href = URL.createObjectURL(archivo);
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
//fin mis funciones
//mis variables
    //crear un boton
const btn_analizar = document.getElementById('btn_analizar');
const btn_descargar = document.getElementById('btn_descargar');
//fin mis variables

export let ids = []
export let usos = []
export let errores = []



// Crear el editor principal
const editor = monaco.editor.create(
    document.getElementById('editor'), {
        value: '',
        language: 'java',
        theme: 'tema',
        automaticLayout: true
    }
);

// Crear el editor para la salida
const salida = monaco.editor.create(
    document.getElementById('salida'), {
        value: '',
        language: 'java',
        readOnly: true,
        automaticLayout: true
    }
);

let decorations = [];


// Analizar contenido del editor
const analizar = () => {
    //console.log(runVisitor());

    const entrada = editor.getValue();

   

    ids.length = 0
    usos.length = 0
    errores.length = 0
    let textoFortran=" ";

    //try {
        config.variables.gFuncionesCreadas.clear();
        const nodo = parse(entrada)
        let interprete1 = new InterpreteToken();
        debugger;
        /**@type {Lista}*/let lista=nodo.accept(interprete1);
        textoFortran=lista.generarTodoElCodigo();
        
        // Uso de la función
        //descargarArchivo(textoFortran, 'modulo.f90', 'text/plain');
        btn_descargar.addEventListener('click', () => {
            descargarArchivo(textoFortran, 'entrada.f90', 'text/plain');
        });


        if(errores.length > 0){
            salida.setValue(
                `Error: ${errores[0].message}`
            );
            return
        }else{
            salida.setValue("Análisis Exitoso");
        }

        // salida.setValue("Análisis Exitoso");
        // Limpiar decoraciones previas si la validación es exitosa
        decorations = editor.deltaDecorations(decorations, []);
    /*} catch (e) {

        if(e.location === undefined){
            
            salida.setValue(
                `Error: ${e.message}`
            );

        }else {

        

            // Mostrar mensaje de error en el editor de salida
            salida.setValue(
                `Error: ${e.message}\nEn línea ${e.location.start.line} columna ${e.location.start.column}`
            );

            // Resaltar el error en el editor de entrada
            decorations = editor.deltaDecorations(decorations, [
                {
                    range: new monaco.Range(
                        e.location.start.line, 
                        e.location.start.column, 
                        e.location.start.line, 
                        e.location.start.column + 1
                    ),
                    options: {
                        inlineClassName: 'errorHighlight', // Clase CSS personalizada para cambiar color de letra
                    }
                },
                {
                    range: new monaco.Range(
                        e.location.start.line, 
                        e.location.start.column, 
                        e.location.start.line, 
                        e.location.start.column
                    ),
                    options: {
                        glyphMarginClassName: 'warningGlyph', // Clase CSS para mostrar un warning en el margen
                    }
                }
            ]);
        }
        
    }*/
};

// Escuchar cambios en el contenido del editor
/*editor.onDidChangeModelContent(() => {
    analizar();
});*/
btn_analizar.addEventListener('click', ()=>{
    analizar();
});



// CSS personalizado para resaltar el error y agregar un warning
const style = document.createElement('style');
style.innerHTML = `
    .errorHighlight {
        color: red !important;
        font-weight: bold;
    }
    .warningGlyph {
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="orange" d="M8 1l7 14H1L8 1z"/></svg>') no-repeat center center;
        background-size: contain;
    }
`;
document.head.appendChild(style);