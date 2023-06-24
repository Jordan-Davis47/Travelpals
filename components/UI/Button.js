import Link from "next/link";

import classes from "./Button.module.css";

const Button = (props) => {
	if (props.link) {
		return (
			<Link className={classes.btn} href={props.link}>
				{props.children}
			</Link>
		);
	} else {
		return (
			<button type={props.type} onClick={props.onClick} className={`${classes.btn} ${props.className}`} disabled={props.disabled}>
				{props.children}
			</button>
		);
	}
};

export default Button;
