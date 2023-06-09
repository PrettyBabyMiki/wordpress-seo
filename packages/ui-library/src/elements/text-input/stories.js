// eslint-disable react/display-name
import { StoryComponent } from ".";

export default {
	title: "1) Elements/Text Input",
	component: StoryComponent,
	parameters: {
		docs: {
			description: {
				component: "A simple text input component. Aceept all props of a regular input element.",
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <StoryComponent { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};
