import Head from "next/head";
import "../styles/globals.css";

import Layout from "../components/layout/Layout";
import { NotificationContextProvider } from "../store/notification-context";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<NotificationContextProvider>
			<SessionProvider session={session}>
				<Layout>
					<Head>
						<title>Travepals</title>
						<meta name="description" content="Travepals" />
						<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					</Head>

					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</NotificationContextProvider>
	);
}

export default MyApp;
