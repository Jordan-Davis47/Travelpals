import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useNotification from "../../hooks/useNotification";
import useHttp from "../../hooks/useHttp";

import Button from "../UI/Button";
import classes from "./ContentButtons.module.css";

const ContentButtons = (props) => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { showError, showPending, showSuccess } = useNotification();
	const { sendRequest } = useHttp();

	const placeId = router.query.placeId;

	const editPlaceHandler = () => {
		props.showEdit();
	};

	const deletePlaceHandler = async () => {
		showPending({ title: "Delete Place", message: "Removing place from system, please wait..." });

		const data = await sendRequest({
			url: `/api/place/${placeId}`,
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${session}`,
			},
		});

		if (data.result === "success") {
			showSuccess({ title: "Delete Place", message: "Successfully deleted place" });
			router.replace("/");
		} else {
			showError({ title: "Delete place", message: data.message || "Error attempting to delete place, please try again" });
		}
	};

	return (
		<Fragment>
			{session && (
				<div className={classes.container}>
					<Button onClick={editPlaceHandler} className={classes.btn}>
						Edit
					</Button>
					<Button onClick={deletePlaceHandler} className={classes.btn}>
						Delete
					</Button>
				</div>
			)}
		</Fragment>
	);
};

export default ContentButtons;
