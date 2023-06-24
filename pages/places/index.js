import { Fragment } from "react";
import { getAllPlaces } from "../../helpers/api-util";

import Head from "next/head";
import PlaceList from "../../components/places/PlaceList";

const AllEventsPage = (props) => {
	return (
		<Fragment>
			<Head>
				<title>All Places</title>
				<meta name="description" content="Find a lot of great events that allow you to evolve..." />
			</Head>
			<PlaceList header={"All Places"} items={props.places} />
		</Fragment>
	);
};

export const getStaticProps = async (context) => {
	const places = await getAllPlaces();

	return {
		props: {
			places: places,
			revalidate: 60,
		},
	};
};

export default AllEventsPage;
