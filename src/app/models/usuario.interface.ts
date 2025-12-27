export interface Usuario {
    id: number;
    nombreUsuario: string;
    contraseña: string;
    rol: string;
}
export interface Cliente {
    id: string | number;
    nombre: string;
    apellido: string;
    direccion: string;
    ciudad: string;
    telefono: string;
    email: string;
}

export interface Credenciales {
    nombreUsuario: string;
    contraseña: string;
}