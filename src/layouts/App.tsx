import React from "react";
import { jakartaSans } from "../../lib/utils";
import Head from "next/head";

export const LayoutApp = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/assets/logo.svg" type="image/x-icon" />
			</Head>
			<main className={`${jakartaSans.className}`}>{children}</main>
		</>
	);
};
