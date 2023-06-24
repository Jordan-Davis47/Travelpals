import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDatabase } from "../../../helpers/db-util";
import { comparePasswords } from "../../../helpers/auth-util";

export const authOptions = {
	secret: process.env.NEXT_AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			authorize: async (credentials, req) => {
				let client;
				try {
					client = await connectDatabase();
					client.connect();
				} catch (err) {
					res.status(500).json({ message: "Could not connect to the database", errMessage: err });
					return;
				}

				const db = client.db();

				const exisitingUser = await db.collection("users").findOne({ email: credentials.email });

				if (!exisitingUser) {
					client.close();
					res.status(401).json({ message: "Could not find user for provided inputs, please try again" });
					return null;
				}

				const isValidPassword = await comparePasswords(credentials.password, exisitingUser.password);

				if (!isValidPassword) {
					client.close();
					res.status(401).json({ message: "Incorrect credentials provided, please try again" });
					return null;
				}

				client.close();

				const userId = exisitingUser._id.toString();

				const user = { email: exisitingUser.email, name: exisitingUser.username, id: userId };

				return user;
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			session.user = token.user;
			return session;
		},
		async jwt({ token, user, account }) {
			if (user) {
				console.log("JWT ACCOUNT CHECK");
				token.user = user;
				token.accessToken = user.data.accessToken;
				token.accessTokenExpiry = user.data.accessTokenExpiry;
				token.refreshToken = user.data.refreshToken;
			}
			return token;
		},
	},
};

export default NextAuth(authOptions);
