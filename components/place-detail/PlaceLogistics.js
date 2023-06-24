import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { capitalizeFirstLetter } from "../../helpers/ui-util";
import Image from "next/image";
import AddressIcon from "../icons/address-icon";
import Link from "next/link";
import LogisticsItem from "./LogisticsItem";
import classes from "./PlaceLogistics.module.css";
import LikeIcon from "../icons/LikeIcon";
import useHttp from "../../hooks/useHttp";

function PlaceLogistics(props) {
	const { location, imageUrl, imageAlt, tags, user, username, likes } = props;
	const { data: session, status } = useSession();
	const router = useRouter();
	const { sendRequest } = useHttp();
	const [hasBeenClicked, setHasBeenClicked] = useState(false);
	const userId = session ? session.user.id : "";
	const [isLiked, setIsLiked] = useState(likes.includes(userId));

	const placeId = router.query.placeId;

	const toggleLikeHandler = () => {
		console.log("clicked");
		setIsLiked((prevState) => !prevState);
		setHasBeenClicked(true);
	};

	useEffect(() => {
		if (session && hasBeenClicked) {
			const addLike = isLiked;
			const uploadLike = async () => {
				const data = await sendRequest({ url: `/api/like/${placeId}`, method: "PATCH", body: JSON.stringify({ placeId, addLike }), headers: { "Content-Type": "application/json" } });

				return data;
			};

			uploadLike().then((data) => console.log(data));
		}
	}, [isLiked]);

	const placeIsLiked = likes.includes(userId);

	let likeBtnClass;
	if (isLiked) {
		likeBtnClass = classes.clicked;
	}
	if (placeIsLiked) {
		likeBtnClass = classes.active;
	}

	const capitalizedLocation = capitalizeFirstLetter(location);

	return (
		<section className={classes.logistics}>
			<div className={classes.image}>
				<Image src={imageUrl} alt={imageAlt} width="400" height="400" />
			</div>
			<ul className={classes.list}>
				<LogisticsItem icon={AddressIcon}>
					<address>{capitalizedLocation}</address>
				</LogisticsItem>
				<div className={classes.tags}>
					{tags.map((tag, index) => (
						<p key={index}>{capitalizeFirstLetter(tag)}</p>
					))}
				</div>
				<div className={classes.footerContainer}>
					<div className={classes.username}>
						<Link href={`/places/user/${user}`}>
							<span>Author: {username}</span>
						</Link>
					</div>
					<LikeIcon className={likeBtnClass} onClick={toggleLikeHandler} />
				</div>
			</ul>
		</section>
	);
}

export default PlaceLogistics;
