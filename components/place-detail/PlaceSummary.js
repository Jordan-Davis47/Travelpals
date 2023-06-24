import { capitalizeEachWord } from "../../helpers/ui-util";

import classes from "./PlaceSummary.module.css";

function EventSummary(props) {
	const { title } = props;
	const capitalizedTitle = capitalizeEachWord(title);

	return (
		<section className={classes.summary}>
			<h1>{capitalizedTitle}</h1>
		</section>
	);
}

export default EventSummary;
