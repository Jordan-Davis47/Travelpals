import { connectDatabase, getAllDocuments } from "./db-util";

export async function getAllPlaces() {
	const client = await connectDatabase();
	client.connect();
	const allPlaces = await getAllDocuments(client, "places");

	const places = [];

	for (const key in allPlaces) {
		const placeIdString = allPlaces[key]._id.toString();

		places.push({
			...allPlaces[key],
			_id: placeIdString,
			id: placeIdString,
			user: allPlaces[key].user.toString(),
		});
	}

	return places;
}

export async function getFeaturedPlaces() {
	const allPlaces = await getAllPlaces();

	const mostLikedPlaces = allPlaces
		.sort((a, b) => {
			return b.likes.length - a.likes.length;
		})
		.slice(0, 5);

	return mostLikedPlaces;
}

export async function getPlaceById(id) {
	const allPlaces = await getAllPlaces();
	return allPlaces.find((place) => place.id === id);
}
