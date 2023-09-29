type NestedKey<TObj extends Record<string, any>, Seperator extends string = ".", Prefix extends string = ""> = {
	[K in keyof TObj]: TObj[K] extends Record<string, any>
		? `${Prefix}${K & string}` | NestedKey<TObj[K], Seperator, `${Prefix}${K & string}${Seperator}`>
		: `${Prefix}${K & string}`;
}[keyof TObj];

const a = {
	b: 1,
	c: "",
	d: {
		e: "",
		f: {
			g: 2,
		},
	},
};

const b: NestedKey<typeof a, "-"> = "d-f-g";
	//^?
