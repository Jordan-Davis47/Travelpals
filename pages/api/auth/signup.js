import { connectDatabase } from "../../../helpers/db-util";
import { hashPassword } from "../../../helpers/auth-util";

const handler = async (req, res) => {
	if (req.method !== "POST") {
		return;
	}
	const { username, email, password } = req.body;

	if (!username || username.trim() === "" || username.trim().length > 10 || !email || !email.includes("@") || !password || password.trim().length < 6 || password.trim() === "") {
		res.status(403).json({ message: "Invalid inputs, please try again" });
		return;
	}

	let client;
	try {
		client = await connectDatabase();
		client.connect();
	} catch (err) {
		res.status(500).json({ message: "Could not connect to the database", errMessage: err });
		return;
	}
	const db = client.db();

	const existingUser = await db.collection("users").findOne({ email: email });
	console.log(existingUser);

	if (existingUser) {
		client.close();
		res.status(422).json({ message: "User already exists for this email address, please use a different email" });
		return;
	}

	const hashedPassword = await hashPassword(password);

	const newUser = {
		username,
		email,
		password: hashedPassword,
		places: [],
		comments: [],
	};

	let result;
	try {
		result = await db.collection("users").insertOne(newUser);
	} catch (err) {
		client.close();
		res.status(500).json({ message: "Failed to insert into the database", errMessage: err });
		return;
	}

	res.status(201).json({ message: "Successfully created user!" });
};

export default handler;
