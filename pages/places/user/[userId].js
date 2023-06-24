import React from "react";
import { getUserPlaces, convertToObjectId } from "../../../helpers/db-util";
import PlaceList from "../../../components/places/PlaceList";

const UserPlacesPage = (props) => {
	console.log(props.places);

	if (!props.places.length) {
		return (
			<div className="center">
				<p>No places to show...</p>
			</div>
		);
	}

	return (
		<div>
			<PlaceList user={props.places[0].username} items={props.places} />
		</div>
	);
};

export const getServerSideProps = async (context) => {
	const { params } = context;
	const userId = convertToObjectId(params.userId);
	console.log(userId);

	const userPlaces = await getUserPlaces(userId);
	console.log(userPlaces);
	userPlaces.map((place) => {
		place._id = place._id.toString();
		place.id = place._id;
		place.user = place.user.toString();
	});

	return {
		props: { places: userPlaces },
	};
};

export default UserPlacesPage;
