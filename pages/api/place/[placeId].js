import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { removeCharacter } from "../../../helpers/ui-util";
import { connectDatabase, convertToObjectId } from "../../../helpers/db-util";

const handler = async (req, res) => {
	const placeId = req.query.placeId;

	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ message: "You are not authorized to perform this action" });
		return;
	}

	let client;
	try {
		client = await connectDatabase();
		client.connect();
	} catch (err) {
		res.status(500).json({ message: "Failed to connect to the database", errMessage: err });
		return;
	}

	const db = client.db();

	const placeDbId = convertToObjectId(placeId);
	const userDbId = convertToObjectId(session.user.id);

	const selectedPlace = await db.collection("places").findOne({ _id: placeDbId });

	if (!selectedPlace) {
		res.status(404).json({ message: "Could not find place for the provided ID" });
		client.close();
		return;
	}

	if (selectedPlace.user.toString() !== session.user.id) {
		client.close();
		res.status(401).json({ message: "You are not authorized to perform this action" });
		return;
	}

	if (req.method === "DELETE") {
		try {
			await db.collection("places").findOneAndDelete({ _id: placeDbId });
			await db.collection("users").updateOne({ _id: userDbId }, { $pull: { places: placeDbId } });
			await db.collection("comments").deleteMany({ placeId: placeDbId });
		} catch (err) {
			client.close();
			res.status(500).json({ message: "Error changing the database data", errMessage: err });
			return;
		}

		client.close();
		res.status(200).json({ message: "Successfully deleted place!" });
	}

	if (req.method === "PATCH") {
		const { name, location, description, tags, imageUrl } = req.body;

		if (!name || name.trim() === "" || !location || location.trim() === "" || !description || description.trim() === "" || !imageUrl || imageUrl.trim() === "") {
			res.status(403).json({ message: "Invalid inputs" });
			return;
		}

		let tagsArray;
		if (tags) {
			const noCommaTags = removeCharacter(tags, ",");
			tagsArray = removeCharacter(noCommaTags.join(" "), "#");
			tagsArray = tagsArray.filter((tag) => tag.trim() !== "" && tag.trim() !== "," && tag.trim() !== "#");
		}

		const updatedPlace = {
			name,
			location,
			description,
			imageUrl,
			tags: tagsArray,
		};

		try {
			await db.collection("places").updateOne({ _id: placeDbId }, { $set: { name: name, location: location, description: description, imageUrl: imageUrl, tags: tagsArray } });
		} catch (err) {
			res.status(500).json({ message: "Could not update place in database", errMessage: err });
			return;
		}

		client.close();
		res.status(201).json({ message: "Successfully updated place!", place: updatedPlace });
	}
};

export default handler;
