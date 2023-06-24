import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

export const connectDatabase = async () => {
	const client = new MongoClient(
		`mongodb+srv://${process.env.NEXT_PUBLIC_MONGO_DB_USERNAME}:${process.env.NEXT_PUBLIC_MONGO_DB_PASSWORD}@${process.env.NEXT_PUBLIC_MONGO_DB_CLUSTER}.oqz4591.mongodb.net/${process.env.NEXT_PUBLIC_MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
		{
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		}
	);

	return client;
};

export const insertDocument = async (db, collection, document) => {
	const result = await db.collection(collection).insertOne(document);
	return result;
};

export const getAllDocuments = async (client, collection) => {
	const db = client.db();

	const documents = await db.collection(collection).find().toArray();
	return documents;
};

export const convertToObjectId = (string) => {
	const objectId = new ObjectId(string);
	return objectId;
};

export const getUserPlaces = async (userId) => {
	const client = await connectDatabase();
	client.connect();
	const db = client.db();
	const userPlaces = await db.collection("places").find({ user: userId }).toArray();

	return userPlaces;
};
