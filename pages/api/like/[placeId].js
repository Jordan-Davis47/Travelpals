import { getServerSession } from "next-auth";
import { connectDatabase, convertToObjectId } from "../../../helpers/db-util";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
	if (req.method === "PATCH") {
		const { placeId, addLike } = req.body;

		if (!placeId) {
			res.status(422).json({ message: "invalid data" });
			return;
		}

		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			res.status(401).json({ message: "Not authorized to perform this action" });
			return;
		}

		const placeDbId = convertToObjectId(placeId);

		let client;
		try {
			client = await connectDatabase();
			client.connect();
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Connecting To DB Failed" });
			return;
		}

		const db = client.db();

		const place = await db.collection("places").findOne({ _id: placeDbId });
		if (addLike && place.likes.includes(session.user.id)) {
			client.close();
			res.status(422).json({ message: "You have already liked this place" });
			return;
		}

		try {
			if (addLike) {
				await db.collection("places").updateOne({ _id: placeDbId }, { $push: { likes: session.user.id } });
			} else {
				await db.collection("places").updateOne({ _id: placeDbId }, { $pull: { likes: session.user.id } });
			}
		} catch (err) {
			client.close();
			res.status(500).json({ message: "Inserting Data Failed" });
			return;
		}

		res.status(200).json({ message: "Successfully liked place" });
	}
};

export default handler;
