import React from "react";

import classes from "./LoadingSpinner.module.css";

const LoadingSpinner = (props) => {
	return (
		<div className={props.asOverlay && ` ${classes.loadingSpinnerOverlay}`}>
			<div className={classes.ldsDualRing}></div>
			<p>{props.text}</p>
		</div>
	);
};

export default LoadingSpinner;
