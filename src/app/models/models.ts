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
    nombreEntrante?: string;
    descripcionEntrante?: string;
    nombrePrincipal?: string;
    descripcionPrincipal?: string;
    nombrePostre?: string;
    descripcionPostre?: string;
}

export interface FechaPropuesta {
    id: string;
    nombre: string;
    telefono: string;
    fechaDesde: string;
    votosAFavor: string[];
    votosEnContra: string[];
    descartada: boolean;
    establecida: boolean;
}