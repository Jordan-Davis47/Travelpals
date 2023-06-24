import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useNotification from "../../hooks/useNotification";

import Button from "../UI/Button";
import classes from "./NewPlace.module.css";
import ImageUpload from "./ImageUpload";
import useHttp from "../../hooks/useHttp";

const CreatePlace = (props) => {
	const { showSuccess, showError, showPending } = useNotification();
	const { sendRequest } = useHttp();
	const { data: session } = useSession();
	const router = useRouter();
	const [file, setFile] = useState();
	const nameRef = useRef();
	const locationRef = useRef();
	const descriptionRef = useRef();
	const tagsRef = useRef();

	const cancelHandler = () => {
		router.push(`/places/${props.place.id}`);
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		if (!session) {
			return;
		}
		showPending({ title: props.editing ? "Update Place" : "Create Place", message: props.editing ? "Updating your place, please wait..." : "Creating your new place, please wait..." });
		const enteredName = nameRef.current.value;
		const enteredLocation = locationRef.current.value;
		const enteredDescription = descriptionRef.current.value;
		const enteredTags = tagsRef.current.value;

		if (enteredName.trim() === "" || enteredLocation.trim() === "" || enteredDescription.trim() === "") {
			return;
		}

		let uploadedImageUrl;

		if (file) {
			const cloudinaryData = new FormData();
			cloudinaryData.append("file", file);
			cloudinaryData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
			cloudinaryData.append("folder", "Travelpal user images");
			const cloudinaryURL = `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/image/upload`;

			const cloudinaryResponse = await fetch(cloudinaryURL, { method: "POST", body: cloudinaryData });
			const parsed = await cloudinaryResponse.json();
			uploadedImageUrl = parsed.url;
		}
		if (!uploadedImageUrl) {
			uploadedImageUrl = props.place.imageUrl;
		}

		const fetchUrl = props.editing ? `/api/place/${props.place.id}` : "/api/place/create-place";
		const fetchMethod = props.editing ? "PATCH" : "POST";

		const requestBody = JSON.stringify({ name: enteredName, location: enteredLocation, description: enteredDescription, tags: enteredTags, imageUrl: uploadedImageUrl });

		const data = await sendRequest({ url: fetchUrl, method: fetchMethod, body: requestBody, headers: { "Content-Type": "application/json" } });

		if (data.result === "success") {
			showSuccess({ title: props.editing ? "Update Place" : "Create Place", message: props.editing ? "Place successfully updated!" : "Place successfully created!" });
			props.editing ? router.push(`/places/${router.query.placeId}`) : router.replace(`/places/${data.place._id}`);
		} else {
			showError({ title: props.editing ? "Update place" : "Create place", message: props.editing ? data.message || "Updating place failed, please try again" : data.message || "Creating place failed, please try again..." });
		}
	};

	const pickedFileHandler = (e) => {
		setFile(e.target.files[0]);
	};

	const currentImg = props.place ? props.place.imageUrl : false;

	const header = props.editing ? "Edit your place" : "Share a new place";

	return (
		<section className={classes.createPlace}>
			<h2>{header}</h2>

			<form onSubmit={submitHandler}>
				<div className={classes.inputControl}>
					<div className={classes.control}>
						<label htmlFor="name">Name</label>
						<input id="name" type="text" ref={nameRef} required defaultValue={props.place ? props.place.name : ""} />
					</div>
					<div className={classes.control}>
						<label htmlFor="address">Location</label>
						<input id="address" type="text" required ref={locationRef} defaultValue={props.place ? props.place.location : ""} />
					</div>
					<div className={classes.control}>
						<label htmlFor="description">Description</label>
						<textarea id="description" rows="4" ref={descriptionRef} required defaultValue={props.place ? props.place.description : ""} />
					</div>
					<div className={classes.control}>
						<label htmlFor="tags">Tags (optional)</label>
						<textarea id="tags" rows="1" ref={tagsRef} required defaultValue={props.place ? props.place.tags : ""} />
					</div>
					<div className={classes.buttonContainer}>
						<Button>{props.editing ? "Confirm" : "Create Place"}</Button>
						{props.editing && (
							<Button type="button" onClick={cancelHandler} className={classes.cancel}>
								Cancel
							</Button>
						)}
					</div>
				</div>
				<div className={classes.imgSection}>
					<ImageUpload currentImg={currentImg} pickFile={pickedFileHandler} />
				</div>
			</form>
		</section>
	);
};

export default CreatePlace;
