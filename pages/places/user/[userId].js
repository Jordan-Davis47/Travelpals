import React from "react";
import { getUserPlaces, convertToObjectId } from "../../../helpers/db-util";
import PlaceList from "../../../components/places/PlaceList";

const UserPlacesPage = (props) => {
	console.log(props.places);
	const username = props.places[0].username;
	console.log(username);

	return (
		<div>
			<PlaceList user={username} items={props.places} />
		</div>
	);
};

export const getServerSideProps = async (context) => {
	const { params } = context;
	const userId = convertToObjectId(params.userId);

	const userPlaces = await getUserPlaces(userId);
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
