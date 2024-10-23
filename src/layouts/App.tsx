import React from "react";
import { jakartaSans } from "../../lib/utils";
import Head from "next/head";
import { Navbar } from "@/components/Navbar";

export const LayoutApp = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/assets/logo.svg" type="image/x-icon" />
				<title>Dashboard | Titanium Printing</title>
			</Head>

			<Navbar />
			<main className={`${jakartaSans.className} relative`}>{children}</main>
		</>
	);
};
