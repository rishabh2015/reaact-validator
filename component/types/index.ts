export type TAnyOrNone<T> = {
	[P in keyof T]?: T[P];
};