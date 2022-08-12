export interface User {
    nombre: string;
    apellidos: string;
    telefono: string;
}

export interface Cata {
    id: string;
    nombre: string;
    telefono: string;
    fecha: string;
    entrante?: string;
    principal?: string;
    postre?: string;
}

export interface FechaPropuesta {
    id:string;
    nombre: string;
    telefono: string;
    fechaDesdes: string;
    votosAFavor: Voto[];
    votosEnContra: Voto[];
}
export interface Voto {
    id: string;
    nombre: string[];
}