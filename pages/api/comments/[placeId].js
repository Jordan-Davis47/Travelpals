import { connectDatabase, insertDocument, convertToObjectId } from "../../../helpers/db-util";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
	const placeDbId = convertToObjectId(req.query.placeId);

	let client;
	try {
		client = await connectDatabase();
		client.connect();
	} catch (err) {
		res.status(500).json({ message: "Connecting to database failed!", errorMsg: err });
		return;
	}

	const db = client.db();

	if (req.method === "GET") {
		try {
			const documents = await db.collection("comments").find({ placeId: placeDbId }).toArray();
			client.close();
			res.status(200).json({ comments: documents });
			return;
		} catch (err) {
			client.close();
			res.status(500).json({ message: "Getting comments failed" });
			return;
		}
	}

	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		client.close();
		res.status(401).json({ message: "You are not authorized to perform this action" });
		return;
	}

	if (req.method === "POST") {
		const { text } = req.body;

		if (text.trim() === "" || !text) {
			res.status(422).json({ message: "Invalid input" });
			client.close();
			return;
		}

		const userDbId = convertToObjectId(session.user.id);

		const newComment = {
			text,
			placeId: placeDbId,
			user: userDbId,
			username: session.user.name,
		};

		try {
			const result = await insertDocument(db, "comments", newComment);
			const placeResult = await db.collection("places").updateOne({ _id: placeDbId }, { $push: { comments: result.insertedId.toString() } });
		} catch (err) {
			client.close();
			res.status(500).json({ message: "Inserting document failed!" });
			return;
		}
		client.close();
		res.status(201).json({ message: "Successfully added comment", comment: newComment });
		return;
	}

	if (req.method === "DELETE") {
		const { commentId, user, placeOwner } = req.body;

		const commentDbId = convertToObjectId(commentId);

		if (user !== session.user.id && placeOwner !== session.user.id) {
			console.log("USER PLACE NOT EQUAL");
			client.close();
			res.status(401).json({ message: "You are not authorized to perform this action" });
			return;
		}

		try {
			const result = await db.collection("comments").findOneAndDelete({ _id: commentDbId });
			const placeResult = await db.collection("places").updateOne({ _id: placeDbId }, { $pull: { comments: commentId } });
		} catch (err) {
			client.close();
			res.status(500).json({ message: "Failed to delete comment from database" });
			return;
		}

		res.status(200).json({ message: "Successfully deleted comment" });
		return;
	}
};

export default handler;
