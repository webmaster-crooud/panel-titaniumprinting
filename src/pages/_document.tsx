import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en" className="overflow-x-hidden scroll-smooth">
			<Head />
			<body className="bg-slate-100 text-slate-900">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
