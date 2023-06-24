import React, { useState, useCallback } from "react";

const useHttp = () => {
	const [isLoading, setIsLoading] = useState(false);

	const sendRequest = useCallback(async (requestConfig) => {
		setIsLoading(true);
		try {
			console.log(requestConfig.url);
			const response = await fetch(requestConfig.url, { method: requestConfig.method ? requestConfig.method : "GET", body: requestConfig.body ? requestConfig.body : undefined, headers: requestConfig.headers ? requestConfig.headers : undefined });
			console.log(response);
			const data = await response.json();
			console.log(data);

			let result;
			if (!response.ok) {
				result = "error";
			} else {
				result = "success";
			}

			data.result = result;
			return data;
		} catch (err) {
			console.log(err);
		}
		setIsLoading(false);
	}, []);

	return { sendRequest, isLoading };
};

export default useHttp;
