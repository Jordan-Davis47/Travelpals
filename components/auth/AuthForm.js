import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import useHttp from "../../hooks/useHttp";
import useNotification from "../../hooks/useNotification";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
	const { showError, showPending, showSuccess } = useNotification();
	const router = useRouter();
	const { sendRequest } = useHttp();
	const [isLoginMode, setIsLoginMode] = useState();
	const emailRef = useRef();
	const passwordRef = useRef();
	const usernameRef = useRef();

	const switchAuthModeHandler = () => {
		setIsLoginMode((prevState) => !prevState);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		const enteredEmail = emailRef.current.value;
		const enteredPassword = passwordRef.current.value;

		if (isLoginMode) {
			showPending({ title: "Logging in", message: "Logging user in..." });
			const result = await signIn("credentials", { redirect: false, email: enteredEmail, password: enteredPassword });

			if (!result.error) {
				showSuccess({ title: "Logged in", message: "Logging user in was successful" });
				router.replace("/");
			} else {
				showError({ title: "Logged in", message: "Logging user in failed, please try again" });
			}
		} else {
			showPending({ title: "Signing up", message: "Creating user..." });

			const enteredUsername = usernameRef.current.value;

			if (!enteredUsername || enteredUsername.trim() === "" || enteredUsername.trim().length > 10 || !enteredEmail || !enteredEmail.includes("@") || !enteredPassword) {
				showError({ title: "Invalid inputs", message: "Please check your inputs and try again" });
				return;
			}

			if (enteredPassword.trim().length < 6 || enteredPassword.trim() === "") {
				showError({ title: "Invalid Inputs", message: "Password must be 6 or more characters" });
			}

			const requestBody = JSON.stringify({ email: enteredEmail, password: enteredPassword, username: enteredUsername });

			const data = await sendRequest({ url: "/api/auth/signup", method: "POST", body: requestBody, headers: { "Content-Type": "application/json" } });

			if (data.result === "success") {
				showSuccess({ title: "Signing up", message: "User successfully created!" });

				showPending({ title: "Logging in", message: "Logging user in..." });
				const result = await signIn("credentials", { redirect: false, email: enteredEmail, password: enteredPassword });

				if (!result.error) {
					showSuccess({ title: "Logged in", message: "Logging user in was successful" });
					router.replace("/");
				} else {
					showError({ title: "Logged in", message: "Logging user in failed, please try again" });
				}
			} else {
				showError({ title: "Signing up failed", message: data.message || "Creating user failed, please try again" });
			}
		}
	};

	return (
		<section className={classes.auth}>
			<h1>{isLoginMode ? "Login" : "Sign Up"}</h1>

			<form onSubmit={submitHandler}>
				{!isLoginMode && (
					<div className={classes.control}>
						<label htmlFor="username">Your Username</label>
						<input type="text" id="username" required ref={usernameRef} />
					</div>
				)}
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" required ref={emailRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" required ref={passwordRef} />
				</div>
				<div className={classes.actions}>
					<button>{isLoginMode ? "Login" : "Create Account"}</button>
					<button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
						{isLoginMode ? "Create new account" : "Login with existing account"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
