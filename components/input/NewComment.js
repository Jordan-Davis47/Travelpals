import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Button from "../UI/Button";

import classes from "./NewComment.module.css";

function NewComment(props) {
	const [isInvalid, setIsInvalid] = useState(false);
	const router = useRouter();
	const placeId = router.query;
	const commentInputRef = useRef();

	function sendCommentHandler(event) {
		event.preventDefault();

		const enteredComment = commentInputRef.current.value;

		if (!enteredComment || enteredComment.trim() === "") {
			setIsInvalid(true);
			return;
		}

		props.onAddComment({
			text: enteredComment,
			placeId,
		});
		commentInputRef.current.value = "";
	}

	return (
		<form className={classes.form}>
			<div className={classes.control}>
				<label htmlFor="comment">Your comment</label>
				<textarea id="comment" rows="3" ref={commentInputRef}></textarea>
			</div>
			{isInvalid && <p>Please enter a valid comment</p>}
			<Button onClick={sendCommentHandler}>Submit</Button>
		</form>
	);
}

export default NewComment;
