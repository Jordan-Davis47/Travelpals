import React from "react";
import { getPlaceById } from "../../../helpers/api-util";
import { getSession } from "next-auth/react";
import NewPlace from "../../../components/input/NewPlace";

const EditPlacePage = (props) => {
	return <NewPlace place={props.place} editing={true} />;
};

export const getServerSideProps = async (context) => {
	const session = await getSession({ req: context.req });

	if (!session) {
		return {
			redirect: {
				destination: "/places",
				permanent: false,
			},
		};
	}
	const place = await getPlaceById(context.query.placeId);

	return {
		props: {
			session: session,
			place: place,
		},
	};
};

export default EditPlacePage;
