// shadcn/ui 推荐的 cn 工具函数
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function cn(...inputs: any[]) {
	return inputs.filter(Boolean).join(' ');
}
