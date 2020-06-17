import React, { Fragment } from "react";
import TextInput from "@yoast/components/src/inputs/TextInput";
import TextArea from "@yoast/components/src/inputs/TextArea";
import CheckboxGroup from "@yoast/components/src/checkbox/CheckboxGroup";
import RadioButtonGroup from "@yoast/components/src/radiobutton/RadioButtonGroup";
import { MultiSelect, Select } from "@yoast/components/src/select/Select";
import Toggle from "@yoast/components/src/toggle/Toggle";
import DataModel from "@yoast/components/src/data-model/DataModel";
import {
	Button,
	ButtonStyledLink,
	CloseButton,
} from "@yoast/components/src/button";

/**
 * Temporary onclick function.
 *
 * @returns {void}
 */
function clickerDiClick() {
	console.log( "You are an exceptional clicker!" );
}

const buttonGrouping = <Fragment>
	<h3>Buttons</h3>
	<Button type="button" onClick={ clickerDiClick } title="Testing whether other props are also passed, like this tooltip">Default button</Button>
	<Button type="button" variant="primary" onClick={ clickerDiClick }>Primary button</Button>
	<Button type="button" variant="secondary" onClick={ clickerDiClick }>Secondary button</Button>
	<Button type="button" variant="upsell" onClick={ clickerDiClick }>Buy button</Button>
	<Button type="button" variant="hide" onClick={ clickerDiClick }>Hide button</Button>
	<Button type="button" variant="remove" onClick={ clickerDiClick }>Remove button</Button>
	<h3>Links</h3>
	<ButtonStyledLink variant="primary" href={ "#" }>Primary link</ButtonStyledLink>
	<ButtonStyledLink variant="secondary" href={ "#" }>Secondary link</ButtonStyledLink>
	<ButtonStyledLink variant="upsell" href="#">Buy Link</ButtonStyledLink>
	<ButtonStyledLink variant="hide" href="#">Hide Link</ButtonStyledLink>
	<ButtonStyledLink variant="remove" href="#">Remove Link</ButtonStyledLink>
	<h3>Icons</h3>
	<CloseButton onClick={ clickerDiClick } />
</Fragment>;

/**
 * Function that displays all the reactified components that we currently have.
 *
 * @returns {*} A div with all reactified components.
 */
const ReactifiedComponentsWrapper = () => {
	return (
		<div className="yoast">

			<h2>Buttons</h2>
			<h3>Row</h3>
			<div
				style={ {
					padding: "24px",
				} }
			>
				{ buttonGrouping }
			</div>

			<h3>Column</h3>
			<div
				style={ {
					display: "flex",
					flexDirection: "column",
					padding: "24px",
				} }
			>
				{ buttonGrouping }
			</div>
			<hr />

			<h2>Inputs</h2>
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
			<CheckboxGroup
				label="Heya best checkboxes"
				options={ [
					{
						label: "Fancy label",
						id: "fancy-checkbox",
					},
					{
						label: "option with id 1",
						id: "horizontal-check-1",
					},
				] }
				checked={ [ "fancy-checkbox" ] }
			/>
			<CheckboxGroup
				label="Horizontal checkboxes"
				vertical={ false }
				options={ [
					{
						label: "Nice 1",
						id: "id1",
					},
					{
						label: "option with id 3",
						id: "id3",
					},
				] }
				checked={ [ "id1" ] }
				onChange={ console.warn }
			/>
			<RadioButtonGroup
				options={ [
					{
						value: "hey-value",
						label: "Hey there!",
					},
					{
						value: "hi-value",
						label: "Hi there!",
					},
				] }
				label="Horizontal radiobutton group"
				groupName="group1"
				selected="hi"
			/>
			<RadioButtonGroup
				options={ [
					{
						value: "haha-value",
						label: "Haha, that's funny!",
					},
					{
						value: "hoho-value",
						label: "Hohoho, I'm santa!",
					},
				] }
				label="Vertical radiobutton group"
				vertical={ true }
				groupName="group2"
			/>
			<MultiSelect
				label="This is a styled multiselect"
				id="my-awesome-multiselect"
				name="my-selection"
				options={
					[
						{ name: "option 1", value: "opt1" },
						{ name: "option 2", value: "opt2" },
						{ name: "option 3", value: "opt3" },
						{ name: "option 4", value: "opt4" },
					]
				}
				selected={ [ "opt1", "opt3" ] }
			/>
			<Select
				label="This is a styled select"
				id="my-awesome-multiselect"
				name="my-selection"
				options={
					[
						{ name: "option 1", value: "opt1" },
						{ name: "option 2", value: "opt2" },
						{ name: "option 3", value: "opt3" },
						{ name: "option 4", value: "opt4" },
					]
				}
				selected={ "opt1" }
			/>
			<Toggle
				label="React Toggle"
				offText="off"
				onText="on"
				name="toggle"
				id="weird-id-that-is-unique"
				linkTo="https://yoast.com"
				linkText="A helpful link!"
				onChange={ console.warn }
			/>
			<hr />

			<h2>DataModel</h2>
			<DataModel
				items={ [
					{
						width: 100,
						name: "brand",
						number: 66,
					},
					{
						width: 77,
						name: "strategie",
						number: 66,
					},
					{
						width: 45,
						name: "tip",
						number: 66,
					},
					{
						width: 35,
						name: "logo",
						number: 66,
					},
					{
						width: 30,
						name: "name",
						number: 66,
					},
					{
						width: 20,
						name: "SEO",
						number: 66,
					},
					{
						width: 10,
						name: "people",
						number: 66,
					},
					{
						width: 5,
						name: "image",
						number: 66,
					},
					{
						width: 1,
						name: "post",
						number: 66,
					},
				] }
			/>
		</div>
	);
};
export default ReactifiedComponentsWrapper;
