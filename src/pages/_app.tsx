import { LayoutApp } from '@/layouts/App';
import '@/styles/globals.css';
import 'react-tippy/dist/tippy.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <LayoutApp>
            <Component {...pageProps} />
        </LayoutApp>
    );
}
