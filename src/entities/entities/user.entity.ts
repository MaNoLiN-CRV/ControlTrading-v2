interface AuthUser {
    id: number;
    username: string;
    role: roles;
}

type roles = 'admin' | 'user';

export type { AuthUser, roles };