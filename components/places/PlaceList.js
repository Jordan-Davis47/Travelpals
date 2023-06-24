import React, { Fragment } from "react";
import PlaceItem from "./PlaceItem";

import classes from "./PlaceList.module.css";

const PlaceList = (props) => {
	const { items } = props;
	let header;
	if (props.user) {
		header = props.user.charAt(0).toUpperCase() + props.user.slice(1) + "'s" + " " + "Places";
	} else if (props.header) {
		header = props.header;
	}

	return (
		<Fragment>
			{header && <h2 className={classes.header}>{header}</h2>}
			<ul className={classes.list}>
				{items.map((place) => (
					<PlaceItem key={place._id} id={place.id} title={place.name} location={place.location} description={place.description} tags={place.tags} image={place.imageUrl} username={place.username} user={place.user} likes={place.likes} />
				))}
			</ul>
		</Fragment>
	);
};

export default PlaceList;
