import Image from "next/image";
import Link from "next/link";
import { jakartaSans } from "../../../lib/utils";
import { IconArrowBadgeRightFilled } from "@tabler/icons-react";
import { NavbarMenu } from "./Menu";
import { ProfileMenu } from "./Menu/Profile.menu";

export const Navbar = () => {
	return (
		<nav
			className={`max-w-full w-full fixed top-0 z-10 bg-slate-200 py-5 ${jakartaSans.className} shadow-lg`}
		>
			<div className="flex items-center justify-between w-11/12 mx-auto">
				<div className="flex items-center gap-5 justify-start relative">
					<Link href={"/"}>
						<Image
							src={"/assets/logo.svg"}
							priority
							width={100}
							height={100}
							style={{ width: "80%", height: "auto" }}
							alt="Logo Titanium Printing"
						/>

						<h1 className="sr-only">Titanium Printing</h1>
					</Link>

					<div className="flex items-center justify-start gap-3">
						<NavbarMenu />
					</div>
				</div>

				{/* Profile Menu */}
				<div className="flex items-center gap-4 justify-end relative text-slate-700">
					<ProfileMenu />
				</div>
			</div>
		</nav>
	);
};
