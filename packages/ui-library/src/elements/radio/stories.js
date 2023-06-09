import { StoryComponent } from ".";

export default {
	title: "1) Elements/Radio",
	component: StoryComponent,
	parameters: {
		docs: {
			description: {
				component: "A simple radio component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<StoryComponent { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "radio",
	name: "name",
	value: "value",
	label: "I am a radio button.",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<div>Default variant:</div>
		<StoryComponent id="radio-1" name="option-1" value="1" label="I am a radio button with default variant." />
		<hr />
		<div>Inline-block variant:</div>
		<StoryComponent id="radio-2" name="option-2" value="2" screenReaderLabel="Option #2" label="2" variant="inline-block" />
	</div>
);
Variants.parameters = {
	docs: { description: { story: "In the `inline-block` variant example, the `screenReaderLabel` prop is used to provide screen readers with a useful label." } },
};


export const DangerousLabel = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<StoryComponent id="radio-dangerous" name="option-dangerous" value="D" label={ "&bull; Dangerous label." } isLabelDangerousHtml={ true } />
	</div>
);
DangerousLabel.parameters = {
	docs: { description: { story: "This Radio element has `isLabelDangerousHtml` prop set to true, the bullet is encoded (&bull;)." } },
};
