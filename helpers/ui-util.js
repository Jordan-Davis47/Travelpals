export const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeEachWord = (string) => {
	return string
		.split(" ")
		.map((string) => capitalizeFirstLetter(string))
		.join(" ");
};

export const removeCharacter = (string, character) => {
	const stringArray = string.split(" ");
	const newStrings = stringArray.map((string) => {
		const newString = string.includes(character) ? string.replace(character, "") : string;
		return newString;
	});
	console.log(newStrings);
	return newStrings;
};
