import { atom } from 'jotai';

export const alertShow = atom<{ type: string; message: string } | undefined>(undefined);
