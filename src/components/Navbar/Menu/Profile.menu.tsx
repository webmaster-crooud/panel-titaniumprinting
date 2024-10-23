import {
	IconBellFilled,
	IconLogout,
	IconMessageFilled,
} from "@tabler/icons-react";
import Link from "next/link";

export const ProfileMenu = () => {
	return (
		<>
			<button className="relative">
				<IconMessageFilled size={20} />
				<div className="absolute top-0 right-0 z-[1]">
					<div className="flex items-center justify-center w-2 h-2 rounded-full bg-red-500"></div>
				</div>
			</button>

			<Link
				href={"/profile"}
				className="text-sm font-semibold pl-3 border-l border-slate-500"
			>
				Hi, Mikael
			</Link>
			<button className="px-4 font-semibold py-1.5 bg-red-600 text-slate-100 text-xs rounded-lg">
				<IconLogout size={18} stroke={2} />
			</button>
		</>
	);
};
