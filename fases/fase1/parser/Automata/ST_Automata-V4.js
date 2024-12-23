// Clase para representar un nodo del árbol sintáctico
//import { writeFileSync } from 'fs';

class Node {
    constructor(value, left = null, right = null) {
        this.value = value; // El valor del nodo (operador o símbolo)
        this.left = left;   // Nodo izquierdo (para concatenación o unión)
        this.right = right; // Nodo derecho (para concatenación o unión)
    }
}

function parseRegex(input) {
    const stack = [];
    let current = null;

    for (let char of input) {
        switch (char) {
            case '[': // Inicio de un conjunto
                stack.push(current);
                current = '';
                break;
            case ']': // Fin de un conjunto
                if (current === null) throw new Error("Sintaxis inválida: Corchete de cierre sin apertura previa");
                // Cada carácter dentro de los corchetes es tratado como un OR
                const orNodes = current.split('').reduce((acc, char) => {
                    const newNode = new Node(char);
                    return acc ? new Node('|', acc, newNode) : newNode;
                }, null);
                current = stack.pop();
                if (current instanceof Node) {
                    current = new Node('.', current, orNodes);
                } else {
                    current = orNodes;
                }
                break;
            case '*':
            case '+':
            case '?':
                if (!(current instanceof Node)) throw new Error(`Operador '${char}' sin operando previo`);
                // El operador afecta solo al último nodo (el conjunto o literal más cercano)
                current = new Node(char, current);
                break;
            case '|':
                if (!(current instanceof Node)) throw new Error("Operador '|' sin operando");
                stack.push(current);
                current = null;
                break;
            default: // Caracter literal o concatenación
                const literalNode = new Node(char);
                if (current === null) {
                    current = literalNode;
                } else if (current instanceof Node) {
                    // Si el nodo actual ya es un conjunto o un literal, concatenar
                    current = new Node('.', current, literalNode);
                } else if (typeof current === 'string') {
                    // Agregar el carácter al conjunto si estamos dentro de corchetes
                    current += char;
                }
        }
    }

    while (stack.length > 0) {
        const top = stack.pop();
        if (current === null) {
            current = top;
        } else {
            current = new Node('|', top, current);
        }
    }

    if (!(current instanceof Node)) {
        throw new Error("Expresión incompleta o malformada");
    }

    return current;
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

// function writeDotToFile(dot, filename) {
//     writeFileSync(filename, dot);
//     console.log(`Archivo DOT generado: ${filename}`);
// }
function writeDotToFile(dot, filename) {
    const blob = new Blob([dot], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    console.log(`Archivo descargado: ${filename}`);
}




// Construcción de la tabla de estados
function buildStateTable(automaton) {
    const table = [];
    for (let [start, symbol, end] of automaton.transitions) {
        table.push({ Start: start, Symbol: symbol || 'ε', End: end });
    }
    return table;
}

// Prueba
const regex = "[ab]*[cd]+|[ef]?|[uioa][01234]+";

export function myFunction(){
    console.log("Hola--------------------------------")
    try {
        debugger;
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
    
    } catch (error) {
        console.error("Error:", error.message);
    }
    

}