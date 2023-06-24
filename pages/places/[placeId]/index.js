import { Fragment, useState } from "react";
import { getAllPlaces, getPlaceById } from "../../../helpers/api-util";
import { useRouter } from "next/router";

import Head from "next/head";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import PlaceSummary from "../../../components/place-detail/PlaceSummary";
import PlaceLogistics from "../../../components/place-detail/PlaceLogistics";
import PlaceContent from "../../../components/place-detail/PlaceContent";
import Comments from "../../../components/input/Comments";
import ContentButtons from "../../../components/place-detail/ContentButtons";

const PlaceDetailPage = (props) => {
	const router = useRouter();
	const [showEdit, setShowEdit] = useState(false);
	const place = props.selectedPlace;

	const showEditPlaceHandler = () => {
		router.push(`/places/${place.id}/edit-place`);
	};

	if (!place) {
		return (
			<div className="center">
				<LoadingSpinner />
			</div>
		);
	}
	return (
		<Fragment>
			<Head>
				<title>{place.name}</title>
				<meta name="description" content={place.description} />
			</Head>
			{!showEdit && (
				<Fragment>
					<PlaceSummary title={place.name} />
					<PlaceLogistics location={place.location} imageUrl={place.imageUrl} imageAlt={place.title} tags={place.tags} user={place.user} username={place.username} likes={place.likes} />
					<PlaceContent>
						<ContentButtons place={place} showEdit={showEditPlaceHandler} />

						<p>{place.description}</p>
					</PlaceContent>

					<Comments placeId={place.id} placeOwner={place.user} />
				</Fragment>
			)}
		</Fragment>
	);
};

export const getStaticPaths = async () => {
	const places = await getAllPlaces();
	const paths = places.map((place, index) => {
		if (index < 30) {
			return { params: { placeId: place.id } };
		}
	});

	return {
		paths: paths,
		fallback: "blocking",
	};
};

export const getStaticProps = async (context) => {
	const placeId = context.params.placeId;
	const place = await getPlaceById(placeId);
	if (!place) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			selectedPlace: place,
		},
		revalidate: 60,
	};
};

export default PlaceDetailPage;
