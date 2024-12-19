{{
    
    // let identificadores = []

    // import { identificadores } from '../index.js'

    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'


    import { nLiterales, 
        nIdentificador,
        nProducciones,
        nGramatica
    } from './visitor/Nodo.js';
}}

gramatica = _ pr:producciones+ _ {
    return new nGramatica(pr);
    /*let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }

    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }*/
}

producciones = _ id:identificador _ (literales)? _ "=" _ op:opciones (_";")? { 
        return new nProducciones(id, op);
    }

opciones = una:union op:(_ "/" _ unb:union {return unb;})* {
        return op.reduce((acc, curr) => acc + "<>" + curr, una); //una=inicio
    }

union = expa:expresion (_ expresion !(_ literales? _ "=") )* {return expa;}

expresion  = (etiqueta/varios)? _ exp:expresiones _ ([?+*]/conteo)? {return exp;}

etiqueta = ("@")? _ id:identificador _ ":" (varios)?

varios = ("!"/"$"/"@"/"&")

expresiones  =  id:identificador { /*usos.push(id)*/ }
                / lit:literales "i"? {return lit;}
                / "(" _ opciones _ ")"
                / corchetes "i"? /**/
                / "."
                / "!."

// conteo = "|" parteconteo _ (_ delimitador )? _ "|"

conteo = "|" _ (numero / id:identificador) _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "|"
        / "|" _ (numero / id:identificador)? _ "," _ opciones _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "," _ opciones _ "|"

// parteconteo = identificador
//             / [0-9]? _ ".." _ [0-9]?
// 			/ [0-9]

// delimitador =  "," _ expresion

// Regla principal que analiza corchetes con contenido
corchetes
    = "[" contenido:(/*rango /*/ contenido)+ "]" {
        //return `Entrada válida: [${input}]`;
        /*  

            let map = new Map();
            if !map.has("contenido") {
                map.set("corchetes", "funcion corchetes()");
            }
            
            return funcCorchetes(map);
        */
    }

// Regla para validar un rango como [A-Z]
rango
    = inicio:caracter "-" fin:caracter {
        /*if (inicio.charCodeAt(0) > fin.charCodeAt(0)) {
            throw new Error(`Rango inválido: [${inicio}-${fin}]`);

        }
        return `${inicio}-${fin}`;*/
    }

// Regla para caracteres individuales
caracter
    = [a-zA-Z0-9_ ] { /*return text()*/}
    
// Coincide con cualquier contenido que no incluya "]"
contenido
    = (/*corchete /*/ texto)+

corchete
    = "[" contenido "]"

texto
    = [^\[\]]+ { /**/}

literales = '"' stringDobleComilla* '"' { return new nLiterales(); }
            / "'" stringSimpleComilla* "'"{ return new nLiterales(); }

stringDobleComilla = !('"' / "\\" / finLinea) . {}
                    / "\\" escape {}
                    / continuacionLinea {}

stringSimpleComilla = !("'" / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

continuacionLinea = "\\" secuenciaFinLinea

finLinea = [\n\r\u2028\u2029]

escape = "'"
        / '"' 
        / "\\"
        / "b"
        / "f"
        / "n"
        / "r"
        / "t"
        / "v"
        / "u"

secuenciaFinLinea = "\r\n" / "\n" / "\r" / "\u2028" / "\u2029"

// literales = 
//     "\"" [^"]* "\""
//     / "'" [^']* "'"

numero = [0-9]+

identificador = [_a-z]i[_a-z0-9]i* { return new nIdentificador();/*return text()*/ } 



_ = (Comentarios /[ \t\n\r])* {
    
}


Comentarios = 
    "//" [^\n]* {}
    / "/*" (!"*/" .)* "*/" {}

