import React from "react";
import TextInput from "@yoast/components/src/inputs/TextInput";
import TextArea from "@yoast/components/src/inputs/TextArea";

const ReactifiedComponentsWrapper = () => {
	return (
		<div>
			<TextInput
				label="This is the input label"
				value="This is the input value"
				type="text"
			/>
			<TextInput
				label="This input has a description"
				description="Great description!"
				type="text"
				placeholder="The best placeholder ev4h"
			/>
			<TextInput
				label="This is a number input"
				description="Great description!"
				type="number"
			/>
			<TextInput
				label="This is a email input without description where the help links to google.com"
				type="email"
				linkTo="https://www.google.com"
			/>
			<TextArea
				label="This is an textarea"
				placeholder="Ugly placeholder"
				value="Wow, what happens now??"
				description="The greatest textarea ever!!1!"
			/>
		</div>
	);
};
export default ReactifiedComponentsWrapper;
