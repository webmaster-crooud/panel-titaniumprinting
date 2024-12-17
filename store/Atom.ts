import { atom } from 'jotai';
export interface Account {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}
export const alertShow = atom<{ type: string; message: string } | undefined>(undefined);
export const authAccount = atom<Account | undefined>(undefined);
