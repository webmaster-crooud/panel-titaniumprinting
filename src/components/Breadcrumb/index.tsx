import { useRouter } from "next/router";
import { IconChevronsRight } from "@tabler/icons-react";
import React from "react";
import Link from "next/link";

export const Breadcrumb = () => {
	const router = useRouter();
	const pathNames = router.pathname.split("/").filter((x) => x);

	return (
		<div className="mb-5">
			<ul className="text-xs font-bold tracking-wide flex items-center gap-2 justify-start text-slate-900">
				<li>...</li>
				{pathNames.map((name, index) => (
					<React.Fragment key={index}>
						{index < pathNames.length && (
							<li>
								<IconChevronsRight size={14} stroke={2.5} />
							</li>
						)}
						<li className="flex items-center justify-start capitalize">
							<Link href={name}>{name}</Link>
						</li>
					</React.Fragment>
				))}
			</ul>
		</div>
	);
};
