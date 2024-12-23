{{
    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'
    let idIdentificadores=new Map();
    
    import { nLiterales,nUnion,nOpciones,nProducciones,nIdentificador,nExpresion,nPunto,nRango,nGramatica
    } from './visitor/Nodo.js';
}}

gramatica = _ pr:producciones+ _ {
    debugger;
    /*for(let i=0;i<pr.length;i++){//recorrer las producciones gramaticales y verificar si hay identificadores iguales
        if(idIdentificadores.has(pr[i].id)){//si ya existe el identificador,entonces se agrega a la lista para poder hacer saltos en el nodo
            let lista=idIdentificadores.get(pr[i].id);
            for(let j=0;j<lista.length;j++){
                lista[j].setNodoId(pr[i]);
            }
        }
    }
    return pr[0];*/
    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }
    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
    return new nGramatica(pr);
    
}
/*
    _    "whitespace" = [ \t\n\r]*
    Integer  "integer" = [0-9]+
*/
producciones = _ id:identificador _ alias:(literales)? _ "=" _ op:opciones (_";")? { 
        return new nProducciones(id,alias,op);
}

opciones = una:union op:(_ "/" _ @union)* {
    return new nOpciones([una,...op]);
}

union = expa:expresion union:(_ @expresion !(_ literales? _ "=" ) )* {
    return new nUnion([expa,...union]);
}

expresion = ("@")? _ id:(identificador _ ":")?_ vari:varios? _ exp:expresiones _ veces:([?+*]/conteo)? {
    /*console.log(JSON.stringify(exp));*/
    if (exp instanceof nIdentificador) {//si es un identificador, se agrega a la lista para luego poder asignar saltos hasta la produccion gramatica
      if (idIdentificadores.has(exp.id))//si ya existe el identificador,entonces se agrega a la lista
        idIdentificadores.get(exp.id).push(exp);
      else//si no existe, se crea una nueva lista
        idIdentificadores.set(exp.id,[exp]);
    }
    else if(exp instanceof nPunto && vari!=null && vari=="!")//es por !. error en la gramatica
        exp.setNegacion(true);
    
    return new nExpresion(id,exp,veces);
}

/*etiqueta = ("@")? _ id:identificador _ ":" (varios)?*/

varios = @("!"/"$"/"@"/"&")

expresiones  =  id:identificador { 
                                    usos.push(id); 
                                    let iden = new nIdentificador(id);
                                    return iden; 
                                }
                / lit:literales i:"i"? { return new nLiterales(lit,i?true:false); }
                / "(" _ @opciones _ ")" 
                / cor:corchetes "i"? /**/ {return new nRango(cor);}
                / "." {return new nPunto(false); }
                / "!." {return new nPunto(true); }

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
    = "[" cont:(/*rango /*/ contenido) "]" {
        //let cont=cont;
        let caracteres="";
        let rangos="";
        for(let i=0;i<cont.length;i++){
          if(cont[i]=="-" && i>0 && i<cont.length-1){//si es un rango
            let inicio=cont[i-1];
            let fin=cont[i+1];
            if(inicio.charCodeAt(0) > fin.charCodeAt(0)) {//si el rango es inválido
              errores.push(new ErrorReglas(`Rango inválido: [${inicio}-${fin}]`));
            }
            else{
              let res="";
              for(let j=inicio.charCodeAt(0);j<=fin.charCodeAt(0);j++){
                res+=String.fromCharCode(j);
              }
              rangos+=res;
              caracteres=caracteres.slice(0,-1)
              i++;
            }
          }else{
            caracteres+=cont[i];
          }
        }
        return "["+caracteres+rangos+"]";
        //return `Entrada válida: [${input}]`;
        /*  
            let map = new Map();
            if !map.has("cont") {
                map.set("corchetes", "funcion corchetes()");
            }
            
            return funcCorchetes(map);
        */
       //throw new Error("No implementado");
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
    = //(/*corchete /*/ texto)+
    //val:$([^[\]-] "-" [^[\]-]) { return [val,"r"]; } //rango 0-9
    /*/*/ val:$([^[\]]+) { return val.split(""); } //str abc

corchete
    = "[" contenido "]"

texto
    = [^\[\]]+ { /**/}

literales = '"' str:$stringDobleComilla* '"' { return str; }
            / "'" str:$stringSimpleComilla* "'"{ return str; }

stringDobleComilla = !('"' / "\\" / finLinea) .
                    / "\\" escape

stringSimpleComilla = !("'" / "\\" / finLinea) .
                    / "\\" escape

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

identificador = [_a-z]i[_a-z0-9]i* { return text() } 



_ = (Comentarios /[ \t\n\r])* {
    
}


Comentarios = 
    "//" [^\n]* {}
    / "/*" (!"*/" .)* "*/" {}

