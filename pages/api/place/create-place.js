import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { connectDatabase, convertToObjectId } from "../../../helpers/db-util";
import { removeCharacter } from "../../../helpers/ui-util";

const handler = async (req, res) => {
	if (req.method !== "POST") {
		return;
	}

	const session = await getServerSession(req, res, authOptions);
	console.log("SERVER SESSION:", session);
	if (!session) {
		res.status(401).json({ message: "Not authorized to perform this action" });
		return;
	}

	const { name, location, description, tags, imageUrl } = req.body;

	if (!name || name.trim() === "" || !location || location.trim() === "" || !description || description.trim() === "" || !imageUrl || imageUrl.trim() === "") {
		res.status(403).json({ message: "Invalid inputs" });
		return;
	}

	let client;
	try {
		client = await connectDatabase();
		client.connect();
	} catch (err) {
		res.status(500).json({ message: "Unable to connect to database", errMessage: err });
		return;
	}

	const db = client.db();

	const userId = session.user.id;

	const dbId = convertToObjectId(userId);

	let tagsArray;
	if (tags) {
		const noCommaTags = removeCharacter(tags, ",");
		tagsArray = removeCharacter(noCommaTags.join(" "), "#");
		tagsArray = tagsArray.filter((tag) => tag.trim() !== "" && tag.trim() !== "," && tag.trim() !== "#");
	}

	const randomLikes = Math.floor(Math.random() * 50);
	const likesArray = [];
	for (let i = 0; i < randomLikes; i++) {
		const userId = Math.random() * randomLikes;

		likesArray.push(userId.toString());
	}

	const newPlace = {
		user: dbId,
		username: session.user.name,
		name,
		location,
		description,
		imageUrl,
		tags: tagsArray,
		comments: [],
		likes: likesArray,
	};

	try {
		const result = await db.collection("places").insertOne(newPlace);
		await db.collection("users").updateOne({ _id: dbId }, { $push: { places: result.insertedId } });
	} catch (err) {
		client.close();
		res.status(500).json({ message: "Failed to insert place into database", errMessage: err });
		return;
	}

	client.close();
	res.status(201).json({ message: "Place saved successfully!", place: newPlace });
};

export default handler;
