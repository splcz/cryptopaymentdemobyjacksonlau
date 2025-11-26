export const classToThemeMap = {
	default: 'theme-default',
	blue: 'theme-blue',
	customize: 'theme-customize'
};

export interface Theme {
	primary?: string;
	background?: string;
	text?: string;
	fontFamily?: string[];
	borderRadius?: string;
}

export const stateToClassVarMap: Record<keyof Theme, string> = {
	primary: '--tw-color-primary',
	background: '--tw-color-background',
	text: '--tw-color-text',
	fontFamily: '--tw-font-customize-family',
	borderRadius: '--tw-radius-customize-radius'
};
