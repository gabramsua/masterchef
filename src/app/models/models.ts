export interface User {
    nombre: string;
    apellidos: string;
    telefono: string;
    cata1?: string;
    cata2?: string;
    isAspirante: boolean;
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
    isAlmuerzo: boolean;
    isPrimeraCata?: boolean;
    fotoEntrante?: string;
    fotoPrincipal?: string;
    fotoPostre?: string;
    votacionesAbiertas?: boolean;
    acabada?: boolean;
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
    isAlmuerzo: boolean;
}
export interface Plato {
    nombre?: string;
    descripcion?: string;
    foto?: string;
}

export interface PuntuacionesDeCata {
    juez: Valoracion[];
}

export interface Valoracion {
    cantidad: number;
    estetica: number;
    sabor: number;
    nombre: string;
    nombrePlato?: string;
    // descripcionPlato?: string;
}

export interface Puntuaciones {
    id?: string;
    puntuacion: PuntuacionesDeCata[];
    cocinero: string;
    telefono: string;
}