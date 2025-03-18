interface Cliente {
    idcliente: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    direccion: string;
    codigoPostal: number;
    pais: string;
    provincia: string;
    localidad: string;
    telefono: string;
    movil: string;
    email: string;
    email2: string;
    tipoCliente: number;
    alertasSMS: number;
    alertasMAIL: number;
    user: string;
    pass: string;
    experiencia: string;
    comentarios: string;
    dni: string;
    licencia: string;
    expiracion: Date;
}

export type { Cliente };
