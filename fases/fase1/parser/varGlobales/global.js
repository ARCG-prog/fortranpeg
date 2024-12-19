// Crear y exportar el Map global
import { Nodo } from "../visitor/Nodo.js";
/**
 * @type {Map<string, Nodo>}
 */
export let gFuncionesCreadas = new Map();
export let config = {
    appName: 'Mi Aplicación',
    version: '1.0.0',
    variables: {
        gFuncionesCreadas
    }
};