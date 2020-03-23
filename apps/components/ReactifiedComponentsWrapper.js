import React from "react";
import TextInput from "@yoast/components/src/inputs/TextInput";
import TextArea from "@yoast/components/src/inputs/TextArea";
import RadioButtonGroup from "@yoast/components/src/radiobutton/RadioButtonGroup";

const ReactifiedComponentsWrapper = () => {
	return (
		<div className="yoast">
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
				description="The minimum number is 3 and the maximum is 6 (if you use arrow keys)."
				type="number"
				min={ 3 }
				max={ 6 }
			/>
			<TextInput
				label="This is a email input without description where the help links to google.com"
				type="email"
				linkTo="https://www.google.com"
			/>
			<TextInput
				label="This is a password input"
				type="password"
				linkTo="https://www.google.com"
			/>
			<TextArea
				label="This is a textarea"
				placeholder="Ugly placeholder"
				value="Wow, what happens now??"
				description="The greatest textarea ever!!1!"
			/>
			<RadioButtonGroup
				options={ [
					{
						value: "hey",
						label: "hey",
						checked: false,
					},
					{
						value: "hi",
						label: "hi",
						checked: true,
					}
				] }
				label="Horizontal radiobutton group"
				groupName="group1"
			/>
			<RadioButtonGroup
				options={ [
					{
						value: "haha",
						label: "haha",
						checked: false,
					},
					{
						value: "hoho",
						label: "hoho",
						checked: true,
					}
				] }
				label="Vertical radiobutton group"
				vertical={ true }
				groupName="group2"
			/>
		</div>
	);
};
export default ReactifiedComponentsWrapper;
