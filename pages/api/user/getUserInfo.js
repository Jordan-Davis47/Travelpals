import { connectDatabase } from "../../../helpers/db-util";

const handler = async (req, res) => {
	if (req.method !== "POST") {
		return;
	}

	const userEmail = req.body.email;

	let client;
	try {
		client = await connectDatabase();
		client.connect();
	} catch (err) {
		res.status(500).json({ message: "Could not connect to database", errMessage: err });
		return;
	}

	const db = client.db();

	const exisitingUser = await db.collection("users").findOne({ email: userEmail });
	if (!exisitingUser) {
		res.status(401).json({ message: "Could not find user for provided email" });
		client.close();
		return;
	}

	const userData = {
		userEmail: userEmail,
		username: exisitingUser.username,
		userId: exisitingUser._id.toString(),
	};

	res.status(200).json({ message: "User data retrieved successfully", userData: userData });
};

export default handler;
