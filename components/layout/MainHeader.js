import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import Button from "../UI/Button";
import SideDrawer from "./SideDrawer";

import classes from "./MainHeader.module.css";

const MainHeader = (props) => {
	const { data: session, status } = useSession();
	const [showMenu, setShowMenu] = useState(false);

	const menuToggleHandler = () => {
		setShowMenu((prevState) => !prevState);
	};

	const closeMenuHandler = () => {
		setShowMenu(false);
	};

	const menuIconClasses = showMenu ? `${classes.menuContainer} ${classes.menuOpen}` : classes.menuContainer;

	return (
		<header className={classes.header}>
			<div className={classes.logo}>
				<Link href="/">TravelPals</Link>
			</div>
			<nav className={classes.navigation}>
				<ul>
					{session && (
						<li>
							<Link href={`/places/user/${session.user.id}`}>My Places</Link>
						</li>
					)}
					<li>
						<Link href="/places">Browse Places</Link>
					</li>
					{session && (
						<li>
							<Link href="/places/create-place">Create Place</Link>
						</li>
					)}
					{!session && (
						<li>
							<Link href="/auth">Login</Link>
						</li>
					)}
					{session && (
						<li>
							<Button
								onClick={() => {
									signOut({ callbackUrl: "/", redirect: false });
								}}
							>
								Logout
							</Button>
						</li>
					)}
				</ul>
				<div className={menuIconClasses} onClick={menuToggleHandler}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</nav>
			{showMenu && <SideDrawer closeMenu={closeMenuHandler} showState={showMenu} />}
		</header>
	);
};

export default MainHeader;
