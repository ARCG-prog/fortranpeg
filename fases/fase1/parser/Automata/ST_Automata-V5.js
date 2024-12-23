// Clase para representar un nodo del árbol sintáctico
const fs = require('fs');

class Node {
    constructor(value, left = null, right = null) {
        this.value = value; // El valor del nodo (operador o símbolo)
        this.left = left;   // Nodo izquierdo (para concatenación o unión)
        this.right = right; // Nodo derecho (para concatenación o unión)
    }
}

// Función para analizar la cadena y construir un árbol de sintaxis
function parseRegex(input) {
    const stack = [];

    for (let i = 0; i < input.length; i++) {
        let char = input[i];

        console.log(`Processing character: ${char}`);
        console.log(`Current stack state:`, stack);

        switch (char) {
            case '[': { // Inicio de un conjunto
                let j = i + 1;
                let setContent = '';

                while (j < input.length && input[j] !== ']') {
                    setContent += input[j];
                    j++;
                }

                if (j === input.length) {
                    throw new Error("Sintaxis inválida: Falta corchete de cierre.");
                }

                console.log(`Set detected: [${setContent}]`);

                const orNode = setContent.split('').reduce((acc, item) => {
                    const node = new Node(item);
                    return acc ? new Node('|', acc, node) : node;
                }, null);

                i = j; // Saltar al carácter después del corchete de cierre

                // Verificar si el siguiente carácter es un operador unario
                if (i + 1 < input.length && ['*', '+', '?'].includes(input[i + 1])) {
                    const operator = input[i + 1];
                    const operatorNode = new Node(operator, orNode);
                    i++; // Saltar el operador unario

                    stack.push(operatorNode);
                    console.log(`Pushed OR node with unary operator '${operator}' to stack:`, operatorNode);
                } else {
                    stack.push(orNode);
                    console.log(`Pushed OR node to stack:`, orNode);
                }

                break;
            }

            case '*':
            case '+':
            case '?': {
                if (stack.length === 0) {
                    throw new Error(`Operador '${char}' sin operando previo.`);
                }

                const lastNode = stack.pop();
                const operatorNode = new Node(char, lastNode);
                stack.push(operatorNode);
                console.log(`Pushed unary operator '${char}' to stack:`, operatorNode);

                // Verificar si el siguiente carácter es un nuevo conjunto para concatenación
                if (i + 1 < input.length && input[i + 1] === '[') {
                    let k = i + 2;
                    let nextSetContent = '';

                    while (k < input.length && input[k] !== ']') {
                        nextSetContent += input[k];
                        k++;
                    }

                    if (k === input.length) {
                        throw new Error("Sintaxis inválida: Falta corchete de cierre en el segundo conjunto.");
                    }

                    const nextOrNode = nextSetContent.split('').reduce((acc, item) => {
                        const node = new Node(item);
                        return acc ? new Node('|', acc, node) : node;
                    }, null);

                    const concatNode = new Node('.', operatorNode, nextOrNode);
                    stack.push(concatNode);
                    console.log(`Pushed concatenation node to stack after detecting second set:`, concatNode);
                    i = k; // Saltar al carácter después del corchete de cierre del segundo conjunto
                }

                break;
            }

            case '|': {
                console.log(`Stack state when '|' encountered:`, stack);
                if (stack.length < 2) {
                    console.error(`Stack state when '|' encountered:`, stack);
                    throw new Error("Operador '|' requiere dos operandos.");
                }

                const rightNode = stack.pop();
                const leftNode = stack.pop();
                const orNode = new Node('|', leftNode, rightNode);
                stack.push(orNode);
                console.log(`Pushed OR node to stack:`, orNode);
                break;
            }

            default: { // Caracter literal o concatenación implícita
                const literalNode = new Node(char);

                // Si hay algo en la pila, automáticamente concatenamos
                if (stack.length > 0) {
                    const leftNode = stack.pop();
                    const concatNode = new Node('.', leftNode, literalNode);
                    stack.push(concatNode);
                    console.log(`Pushed concatenation node to stack:`, concatNode);
                } else {
                    stack.push(literalNode);
                    console.log(`Pushed literal node to stack:`, literalNode);
                }
                break;
            }
        }

        console.log(`Stack after processing '${char}':`, stack);
    }

    // Validar que la pila tiene exactamente un nodo al final
    while (stack.length > 1) {
        const rightNode = stack.pop();
        const leftNode = stack.pop();
        const concatNode = new Node('.', leftNode, rightNode);
        stack.push(concatNode);
        console.log(`Merged stack nodes into concatenation node:`, concatNode);
    }

    if (stack.length !== 1) {
        console.error(`Final stack state:`, stack);
        throw new Error("Expresión incompleta o malformada.");
    }

    console.log(`Final parsed tree:`, stack[0]);
    return stack.pop();
}




// Generación del autómata finito a partir del árbol sintáctico
function generateAutomata(node) {
    let stateCounter = 0;
    const transitions = [];
    const finalStates = new Set();

    function traverse(node) {
        if (!node) throw new Error("Nodo inválido durante la generación del autómata");

        const startState = stateCounter++;
        const endState = stateCounter++;

        switch (node.value) {
            case '|':
                if (!node.left || !node.right) throw new Error(`Nodo '|' requiere ambos hijos. Nodo izquierdo: ${JSON.stringify(node.left)}, Nodo derecho: ${JSON.stringify(node.right)}`);
                const left = traverse(node.left);
                const right = traverse(node.right);
                transitions.push([startState, '', left.start]);
                transitions.push([startState, '', right.start]);
                transitions.push([left.end, '', endState]);
                transitions.push([right.end, '', endState]);
                return { start: startState, end: endState };

            case '.':
                if (!node.left || !node.right) throw new Error(`Nodo '.' requiere ambos hijos. Nodo izquierdo: ${JSON.stringify(node.left)}, Nodo derecho: ${JSON.stringify(node.right)}`);
                const leftConcat = traverse(node.left);
                const rightConcat = traverse(node.right);
                transitions.push([leftConcat.end, '', rightConcat.start]);
                return { start: leftConcat.start, end: rightConcat.end };

            case '*':
                if (!node.left) throw new Error("Nodo '*' requiere un hijo");
                const innerStar = traverse(node.left);
                transitions.push([startState, '', innerStar.start]);
                transitions.push([startState, '', endState]);
                transitions.push([innerStar.end, '', innerStar.start]);
                transitions.push([innerStar.end, '', endState]);
                return { start: startState, end: endState };

            case '+':
                if (!node.left) throw new Error("Nodo '+' requiere un hijo");
                const innerPlus = traverse(node.left);
                transitions.push([startState, '', innerPlus.start]);
                transitions.push([innerPlus.end, '', innerPlus.start]);
                transitions.push([innerPlus.end, '', endState]);
                return { start: startState, end: endState };

            case '?':
                if (!node.left) throw new Error("Nodo '?' requiere un hijo");
                const innerOptional = traverse(node.left);
                transitions.push([startState, '', innerOptional.start]);
                transitions.push([startState, '', endState]);
                transitions.push([innerOptional.end, '', endState]);
                return { start: startState, end: endState };

            default: // Literal o conjunto
                transitions.push([startState, node.value, endState]);
                return { start: startState, end: endState };
        }
    }

    const automaton = traverse(node);
    finalStates.add(automaton.end);

    return { transitions, startState: automaton.start, finalStates };
}

// Optimización de la tabla de estados mediante la teoría de subconjuntos
function optimizeAutomaton(automaton) {
    const epsilonClosure = (states, transitions) => {
        const stack = [...states];
        const closure = new Set(states);

        while (stack.length > 0) {
            const current = stack.pop();
            for (const [start, symbol, end] of transitions) {
                if (start === current && symbol === '' && !closure.has(end)) {
                    closure.add(end);
                    stack.push(end);
                }
            }
        }
        return closure;
    };

    const move = (states, symbol, transitions) => {
        const result = new Set();
        for (const state of states) {
            for (const [start, transitionSymbol, end] of transitions) {
                if (start === state && transitionSymbol === symbol) {
                    result.add(end);
                }
            }
        }
        return result;
    };

    const dfaStates = [];
    const dfaTransitions = [];
    const dfaFinalStates = new Set();
    const stateMap = new Map();

    const startClosure = epsilonClosure(new Set([automaton.startState]), automaton.transitions);
    const unmarkedStates = [startClosure];
    stateMap.set(JSON.stringify([...startClosure]), 0);
    dfaStates.push(startClosure);

    while (unmarkedStates.length > 0) {
        const currentSet = unmarkedStates.pop();
        const currentIndex = stateMap.get(JSON.stringify([...currentSet]));

        for (const symbol of [...new Set(automaton.transitions.map(([_, s]) => s)).values()].filter(s => s !== '')) {
            const moveResult = move(currentSet, symbol, automaton.transitions);
            const closureResult = epsilonClosure(moveResult, automaton.transitions);

            if (closureResult.size === 0) continue;

            const closureKey = JSON.stringify([...closureResult]);

            if (!stateMap.has(closureKey)) {
                const newStateIndex = dfaStates.length;
                stateMap.set(closureKey, newStateIndex);
                dfaStates.push(closureResult);
                unmarkedStates.push(closureResult);
            }

            dfaTransitions.push([currentIndex, symbol, stateMap.get(closureKey)]);
        }

        if ([...currentSet].some(state => automaton.finalStates.has(state))) {
            dfaFinalStates.add(currentIndex);
        }
    }

    return {
        states: dfaStates,
        transitions: dfaTransitions,
        startState: 0,
        finalStates: dfaFinalStates
    };
}

// Minimización del DFA mediante partición
function minimizeDFA(dfa) {
    let partitions = [];
    let newPartitions = [];

    const allStates = new Set(dfa.states.map((_, i) => i));
    const finalStates = new Set([...dfa.finalStates]);
    const nonFinalStates = new Set([...allStates].filter(state => !finalStates.has(state)));

    partitions.push(finalStates, nonFinalStates);

    const getPartition = state => partitions.findIndex(partition => partition.has(state));

    let changed = true;
    while (changed) {
        newPartitions = [];
        changed = false;

        for (const partition of partitions) {
            const groups = new Map();

            for (const state of partition) {
                const signature = JSON.stringify([...new Set(dfa.transitions.filter(([start]) => start === state).map(([_, symbol, end]) => [symbol, getPartition(end)]))]);
                if (!groups.has(signature)) {
                    groups.set(signature, new Set());
                }
                groups.get(signature).add(state);
            }

            newPartitions.push(...groups.values());
            if (groups.size > 1) changed = true;
        }

        partitions = newPartitions;
    }

    const stateMapping = new Map();
    partitions.forEach((partition, index) => {
        for (const state of partition) {
            stateMapping.set(state, index);
        }
    });

    const minimizedTransitions = [];
    for (const [start, symbol, end] of dfa.transitions) {
        const mappedStart = stateMapping.get(start);
        const mappedEnd = stateMapping.get(end);
        if (!minimizedTransitions.some(([s, sym, e]) => s === mappedStart && sym === symbol && e === mappedEnd)) {
            minimizedTransitions.push([mappedStart, symbol, mappedEnd]);
        }
    }

    const minimizedFinalStates = new Set([...dfa.finalStates].map(state => stateMapping.get(state)));

    return {
        states: partitions.map((_, i) => i),
        transitions: minimizedTransitions,
        startState: stateMapping.get(dfa.startState),
        finalStates: minimizedFinalStates
    };
}

// Generar DOT para el árbol sintáctico
function generateTreeDot(node, parentId = 0, nextId = { value: 1 }) {
    let dot = '';
    const currentId = parentId;

    dot += `  ${currentId} [label="${node.value}"];
`;

    if (node.left) {
        const leftId = nextId.value++;
        dot += `  ${currentId} -> ${leftId};
`;
        dot += generateTreeDot(node.left, leftId, nextId);
    }

    if (node.right) {
        const rightId = nextId.value++;
        dot += `  ${currentId} -> ${rightId};
`;
        dot += generateTreeDot(node.right, rightId, nextId);
    }

    return dot;
}

// Generar DOT para el autómata
function generateAutomatonDot(automaton) {
    let dot = `digraph Automaton {
  rankdir=LR;
`;

    // Añadir estados finales
    for (let finalState of automaton.finalStates) {
        dot += `  ${finalState} [shape=doublecircle];
`;
    }

    // Añadir transiciones
    for (let [start, symbol, end] of automaton.transitions) {
        dot += `  ${start} -> ${end} [label="${symbol || 'ε'}"];
`;
    }

    dot += '}';
    return dot;
}

function writeDotToFile(dot, filename) {
    fs.writeFileSync(filename, dot);
    console.log(`Archivo DOT generado: ${filename}`);
}

// Construcción de la tabla de estados
function buildStateTable(automaton) {
    const table = [];
    for (let [start, symbol, end] of automaton.transitions) {
        table.push({ Start: start, Symbol: symbol || 'ε', End: end });
    }
    return table;
}


function generateFortranCode(automaton) {
    const { states, startState, finalStates, transitions } = automaton;

    // Crear un mapa de transiciones por estado
    const stateTransitions = {};
    transitions.forEach(([start, symbol, end]) => {
        if (!stateTransitions[start]) {
            stateTransitions[start] = {};
        }
        stateTransitions[start][symbol] = end;
    });

    let fortranCode = `program AutomataValidator
  implicit none
  character(len=100) :: inputString
  integer :: currentState, i
  logical :: isAccepted
  logical :: continueLoop  ! Variable de control para el ciclo

  print *, 'Enter a string to validate:'
  read(*,*) inputString

  currentState = ${startState}
  isAccepted = .false.
  continueLoop = .true.  ! Inicializamos la variable de control

  do i = 1, len_trim(inputString)
    if (.not. continueLoop) exit  ! Salir del ciclo si continueLoop es falso

    select case(currentState)
`;

    // Generar código Fortran para cada estado
    for (const state of states) {
        fortranCode += `
        case (${state})
        `;
        let contador = 1;
        let cantidadTrans = transitions.filter(subArray => subArray[0] === state).length;

        for (const trans of transitions){
            if (trans[0] == state){
                if (contador == 1){
                    fortranCode += `       
            if (inputString(i:i) == '${trans[1]}') then
                currentState = ${trans[2]}
                isAccepted = .true.
                    `;
                    if (contador == cantidadTrans){
                        fortranCode += `
            else
                isAccepted = .false.
                continueLoop = .false.  ! Cambiamos la variable de control
            end if
                        `;
                    }
                    contador++;
                } else if (contador < cantidadTrans){
                    fortranCode += `        
            else if (inputString(i:i) == '${trans[1]}') then
                currentState = ${trans[2]}
                isAccepted = .true.
            `;
            contador++;
                }else if(contador == cantidadTrans) {
                    fortranCode += `
            else if (inputString(i:i) == '${trans[1]}') then 
                currentState = ${trans[2]}
                isAccepted = .true.
            else
                isAccepted = .false.
                continueLoop = .false.  ! Cambiamos la variable de control
            end if
                    `;
                }
            } 
        }

        if(cantidadTrans > 1){
            // validar que el state esté en finalStates
            if(finalStates.has(state)){
                fortranCode += `
            if ( (i) == len_trim(inputString)) then
                isAccepted = .true.
                continueLoop = .false.
            else
                isAccepted = .false.
            end if
        `;
            }
        } else if (cantidadTrans < 1){
            fortranCode += `
            if ( i  - 1 < len_trim(inputString)) then
                isAccepted = .false.
                continueLoop = .false.
            else
                isAccepted = .true.
            end if
        `;
        }
    }



    fortranCode += `
    case default
        print *, 'Error: Invalid state or transition.'
        continueLoop = .false.  ! Cambiamos la variable de control
    end select
  end do

  if (isAccepted) then
    print *, 'The string is accepted.'
  else
    print *, 'The string is rejected.'
  end if
end program AutomataValidator
`;

    return fortranCode;
}


// Prueba
//const regex = "[ab].[ui].[012]+";
const regex = "[ab]*[cd]+|[ef]?|[uioa][01234]+";
try {
    const syntaxTree = parseRegex(regex);
    console.log("Árbol sintáctico generado:", JSON.stringify(syntaxTree, null, 2));
    // Generar y escribir DOT para el árbol sintáctico
    const treeDot = `digraph Tree {${generateTreeDot(syntaxTree)}}`;
    writeDotToFile(treeDot, 'tree.dot');

    // Generar autómata inicial
    const automaton = generateAutomata(syntaxTree);
    const automatonDot = generateAutomatonDot(automaton);
    writeDotToFile(automatonDot, 'automaton_initial.dot');

    // Optimizar el autómata
    const optimizedAutomaton = optimizeAutomaton(automaton);
    const optimizedDot = generateAutomatonDot(optimizedAutomaton);
    writeDotToFile(optimizedDot, 'automaton_optimized.dot');

    // Minimizar el DFA
    const minimizedDFA = minimizeDFA(optimizedAutomaton);
    const minimizedDot = generateAutomatonDot(minimizedDFA);
    writeDotToFile(minimizedDot, 'automaton_minimized.dot');


    // Mostrar tablas de estados
    const initialStateTable = buildStateTable(automaton);
    console.table(initialStateTable);

    const optimizedStateTable = buildStateTable({
        transitions: optimizedAutomaton.transitions,
        finalStates: optimizedAutomaton.finalStates,
    });
    console.table(optimizedStateTable);

    const minimizedStateTable = buildStateTable({
        transitions: minimizedDFA.transitions,
        finalStates: minimizedDFA.finalStates,
    });
    console.table(minimizedStateTable);

    console.log("-----------------------------Autoama---------------------------")
    console.log(minimizedDFA)

    console.log("-----------Código Fortran Automata--------------")
    console.log(generateFortranCode(minimizedDFA))

} catch (error) {
    console.error("Error:", error.message);
}

