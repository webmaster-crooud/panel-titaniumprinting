import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en" className="overflow-x-hidden scroll-smooth">
            <Head />
            <body className="min-h-screen bg-gradient-to-tl from-slate-100 via-slate-200 to-blue-100">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
