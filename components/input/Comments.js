import { useState, useEffect, useContext } from "react";
import useHttp from "../../hooks/useHttp";
import CommentList from "./CommentList";
import NewComment from "./NewComment";
import NotificationContext from "../../store/notification-context";
import Button from "../UI/Button";

import classes from "./Comments.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

function Comments(props) {
	const { sendRequest, isLoading, message, error } = useHttp();
	const notificationCtx = useContext(NotificationContext);
	const [loadingComments, setLoadingComments] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState([]);
	const [refreshComments, setRefreshComments] = useState(false);

	console.log(props);

	const { placeId } = props;

	useEffect(() => {
		// if (showComments) {
		const fetchComments = async () => {
			setLoadingComments(true);
			const data = await sendRequest({ url: `/api/comments/${placeId}` });

			console.log(data);
			setComments(data.comments ? data.comments : []);
			setLoadingComments(false);
			setRefreshComments(false);
		};
		fetchComments();
		// }
	}, [refreshComments]);

	const refreshCommentsHandler = () => {
		setRefreshComments(true);
	};

	const toggleCommentsHandler = () => {
		setShowComments((prevStatus) => !prevStatus);
	};

	const addCommentHandler = async (commentData) => {
		if (!commentData) {
			return;
		}
		notificationCtx.showNotification({ title: "Adding comment", message: "Uploading your comment", status: "pending" });
		const requestBody = JSON.stringify(commentData);
		// const response = await fetch(`/api/comments/${placeId}`, { method: "POST", body: requestBody, headers: { "Content-Type": "application/json" } });
		const data = await sendRequest({ url: `/api/comments/${placeId}`, method: "POST", body: JSON.stringify(commentData), headers: { "Content-Type": "application/json" } });
		if (data.result === "success") {
			notificationCtx.showNotification({ title: "Success!", message: "Comment successfully uploaded!", status: "success" });
			setRefreshComments(true);
		} else {
			notificationCtx.showNotification({ title: "Error!", message: data.message || "Comment failed to upload, please try again", status: "error" });
		}
		console.log(data);
		console.log(message, error);
	};

	return (
		<section className={classes.comments}>
			<Button onClick={toggleCommentsHandler}> Add Comment</Button>
			{showComments && <NewComment onAddComment={addCommentHandler} />}
			{!loadingComments && <CommentList comments={comments} placeOwner={props.placeOwner} refresh={refreshCommentsHandler} />}
			{loadingComments && <LoadingSpinner text="loading comments, please wait" />}
		</section>
	);
}

export default Comments;
