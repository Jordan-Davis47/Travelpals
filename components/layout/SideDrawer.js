import React, { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Button from "../UI/Button";

import classes from "./SideDrawer.module.css";

const SideDrawer = (props) => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const menuClasses = props.showState ? `${classes.sideDrawer} ${classes.active}` : `${classes.sideDrawer}`;

	useEffect(() => {
		router.events.on("routeChangeStart", props.closeMenu);

		// unsubscribe
		return () => router.events.off("routeChangeStart", props.closeMenu);
	}, [router.events]);

	return (
		<div className={menuClasses}>
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
						<Link href="/places/create-place">Create A Place</Link>
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
		</div>
	);
};

export default SideDrawer;
