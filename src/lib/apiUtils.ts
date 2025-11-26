import { Redot } from './core/redot';

/**
 * 统一的 API 请求函数
 * @param url - API 路径
 * @param params - 请求参数
 * @param publicKey - 公钥
 * @returns Promise 包含 data 字段的响应对象
 */
export const fetchUrl = async (
	url: string,
	params: Record<string, unknown>,
	publicKey: string,
	privateKey?: string
): Promise<{ data: object | string | null }> => {
	try {
		console.log('fetchUrl🍎🍎🍎', url, params, publicKey);
		const redot = new Redot({ preOrderId: '', jwtToken: '', publicKey, privateKey });
		if (redot) {
			const result = (await redot.requestApi(url, params)) as { data: object };
			return result;
			// if (result && typeof result === 'object' && 'data' in result) {
			//  const { data = null } = result;
			//  console.log('result:', result);
			//  return data;
			// }
		}
	} catch (error) {
		console.error('Error:', error);
		return Promise.reject(error);
	}
	return Promise.reject(new Error('Redot initialization failed'));
};
