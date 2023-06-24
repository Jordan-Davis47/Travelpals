import Head from "next/head";
import { Fragment } from "react";
import { getFeaturedPlaces } from "../helpers/api-util";
import PlaceList from "../components/places/PlaceList";

const HomePage = (props) => {
	return (
		<Fragment>
			<Head>
				<title>Travepals</title>
				<meta name="description" content="Find, post and share reviews and information about places you have stayed or visited for other travellers " />
			</Head>
			<PlaceList header={"Top Rated Places"} items={props.places} />
		</Fragment>
	);
};

export const getStaticProps = async () => {
	const mostLikedPlaces = await getFeaturedPlaces();

	return {
		props: {
			places: mostLikedPlaces,
			revalidate: 60,
		},
	};
};

export default HomePage;
