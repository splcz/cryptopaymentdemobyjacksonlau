import axios from 'axios';
import { LocalStoragekeys } from './localStorageKeys';
import { get } from './localStorage';

export interface ErrorDetails {
	code: number | string;
	status: number | string;
	message?: string;
}

// 创建 Axios 实例
// const BASE_URL = 'https://tenv-acquirer.rp-2023app.com/';
const BASE_URL = import.meta.env['VITE_API_BASE_URL'] || '';
const axiosInstance = axios.create({
	// biome-ignore lint: false positive
	baseURL: BASE_URL, // API 基础 URL
	timeout: 10000, // 请求超时时间（毫秒）
	headers: {
		'Content-Type': 'application/json', // 默认请求头
		// biome-ignore lint: false positive
		Accept: 'application/json'
	}
});

// 通用错误处理函数
interface ErrorResponse {
	response: {
		status: string | number;
		statusText: string;
		code: number;
		data: { message: string | undefined; code: number | string };
	};
	request: XMLHttpRequest;
	data?: unknown;
	message?: string | undefined;
}
export const handleError = (error: ErrorResponse): Promise<ErrorDetails> => {
	const result: ErrorDetails = {
		code: -1,
		status: '',
		message: 'No error message'
	};
	console.log('handleError', error);
	if (error.response) {
		// 请求已发送，服务器响应状态码超出 2xx 范围
		result.status = error.response.status;

		result.message = error.response.statusText;
		if (error.response.data) {
			result.message = error.response.data.message || result.message;
			// result.code = error.response.data.code || result.code;
		}
	} else if (error.request) {
		// 请求已发送，但没有收到响应
		result.message = error.request.statusText || 'Error sending request';
		result.status = error.request.status;
	} else {
		// 在设置请求时触发错误
		result.message = error.message;
	}

	return Promise.reject(result);
};

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
	const jwtToken = get(LocalStoragekeys.JWT_TOKEN);
	const sign = get(LocalStoragekeys.SIGN);
	if (jwtToken) {
		config.headers.Authorization = `Bearer ${jwtToken}`; // 添加认证头
		config.headers['X-SToken'] = jwtToken;
	}

	if (sign) {
		config.headers['X-R-Signature'] = sign;
	}

	let currentLang = get(LocalStoragekeys.APP_LANGUAGE) || 'en';
	if (currentLang !== 'en') {
		currentLang = 'zh';
	}
	config.headers['Lang'] = currentLang;

	config.headers['X-R-Ts'] = new Date().getTime();

	return config;
}, handleError);

// 响应拦截器
axiosInstance.interceptors.response.use((response) => {
	// 对响应数据做些什么
	const res = response.data;
	if (res.code && res.code !== 'SUCCESS') {
		return Promise.reject({ code: -1, status: 200, message: res.msg });
	}
	return response.data; // 直接返回数据部分
}, handleError);

export default axiosInstance;
