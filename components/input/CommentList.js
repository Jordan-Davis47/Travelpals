import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useNotification from "../../hooks/useNotification";
import useHttp from "../../hooks/useHttp";

import DeleteIcon from "../icons/DeleteIcon";
import classes from "./CommentList.module.css";

const CommentList = (props) => {
	return (
		<ul className={classes.comments}>
			{props.comments && props.comments.map((comment) => <Comment key={comment._id} id={comment._id} text={comment.text} placeOwner={props.placeOwner} user={comment.user} username={comment.username} refresh={props.refresh} />)}
		</ul>
	);
};

const Comment = (props) => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [isUsersComment, setIsUsersComment] = useState(false);
	const { sendRequest } = useHttp();
	const { showError, showPending, showSuccess } = useNotification();
	if (session) {
		if (session.user.id === props.user && !isUsersComment) {
			setIsUsersComment(true);
		}
	}

	const deleteCommentHandler = async () => {
		showPending({ title: "Delete comment", message: "Removing comment from the system, please wait..." });
		const placeId = router.query.placeId;
		console.log(props.id);
		const data = await sendRequest({
			url: `/api/comments/${placeId}`,
			method: "DELETE",
			body: JSON.stringify({ commentId: props.id, user: props.user, placeOwner: props.placeOwner }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session}`,
			},
		});
		console.log(data);
		if (data.result === "success") {
			showSuccess({ title: "Delete comment", message: "Comment successfully removed" });
			props.refresh();
		} else {
			showError({ title: "Delete comment", message: data.message || "Failed to remove comment, please try again" });
		}
	};

	return (
		<li key={props._id}>
			<p>{props.text}</p>
			<DeleteIcon onClick={deleteCommentHandler} />
			<div>
				By <address>{props.username}</address>
			</div>
		</li>
	);
};

export default CommentList;
