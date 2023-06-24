import Link from "next/link";

import classes from "./PlaceItem.module.css";
import DateIcon from "../icons/date-icon";
import ArrowRightIcon from "../icons/arrow-right-icon";
import AddressIcon from "../icons/address-icon";
import Button from "../UI/Button";
import Image from "next/image";

const PlaceItem = (props) => {
	const { title, image, tags, location, id, username, user, likes } = props;
	console.log(props);

	const exploreLink = `/places/${id}`;
	return (
		<li className={classes.item}>
			<Image src={image} alt={title} width="400" height="400" />
			<div className={classes.content}>
				<div className={classes.summary}>
					<h2>{title}</h2>

					<div className={classes.address}>
						<AddressIcon />
						<address>{location}</address>
					</div>
					<div className={classes.tags}>
						{tags.map((tag, index) => (
							<p key={index}>{tag}</p>
						))}
					</div>
				</div>
				<div className={classes.actions}>
					<p className={classes.username}>
						<Link href={`/places/user/${user}`}>
							<span>Likes: {likes.length}</span>
							<span>Author: {username}</span>
						</Link>
					</p>
					<Button link={exploreLink}>
						<span>Explore Place</span>
						<span className={classes.icon}>
							<ArrowRightIcon />
						</span>
					</Button>
				</div>
			</div>
		</li>
	);
};

export default PlaceItem;
