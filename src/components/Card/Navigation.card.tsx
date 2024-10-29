import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type propsNavigationCard = {
	url: string;
	title: string;
};

export const NavigationCard = ({
	navCard,
}: {
	navCard: propsNavigationCard[];
}) => {
	const router = useRouter();
	const { pathname } = router;
	return (
		<div className="flex items-center justify-start w-auto overflow-hidden">
			{navCard.map((nav, index) => (
				<Link
					key={index}
					href={nav.url}
					className={`px-5 py-2 font-semibold text-slate-500 text-sm 
						${navCard.length === 1 ? "rounded-xl" : ""}
						${index === 0 ? "rounded-tl-xl" : ""}
						${index === navCard.length - 1 ? "rounded-tr-xl" : "rounded-none"}  
						${pathname !== nav.url ? "bg-slate-200" : "bg-slate-300"}`}
				>
					{nav.title}
				</Link>
			))}
		</div>
	);
};
