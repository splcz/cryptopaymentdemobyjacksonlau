import axiosInstance from '../axios';
// import { errorHandler } from '../utils/error';
import { apiUrl } from '../constants/api';
import type {
	PreOrderParams,
	PaymentOrderParams,
	PaymentOrderStatusParams,
	PreOrderResponse,
	PaymentOrderResponse,
	PaymentOrderStatusResponse,
	QrcodeStatusParams,
	QrcodeStatusResponse,
	BindTxHashParams,
	BindTxHashResponse
} from '../types/apiType';
// import type { ErrorDetails } from '@redotpay/redotkit-common';

export const request = async <U, T>(url: string, options?: U): Promise<T> => {
	try {
		const data = await axiosInstance.post<U, T>(url, options);

		return data;
		// return Promise.reject({ code: 0, status: 0, message: 'Invalid response' });
	} catch (error) {
		// errorHandler(error as ErrorDetails);
		return Promise.reject(error);
	}
};

export const getPreOrderInfo = async (options: PreOrderParams): Promise<PreOrderResponse> => {
	const data = await request<PreOrderParams, PreOrderResponse>(apiUrl.preOrderDetailsApi, options);

	return data;
};

export const getPaymentOrderStatus = async (options: PaymentOrderStatusParams): Promise<PaymentOrderStatusResponse> => {
	const data = await request<PaymentOrderStatusParams, PaymentOrderStatusResponse>(apiUrl.orderStatusApi, options);
	return data;
};

export const getQrCodeStatus = async (options: QrcodeStatusParams): Promise<QrcodeStatusResponse> => {
	const data = await request<QrcodeStatusParams, QrcodeStatusResponse>(apiUrl.orderStatusApi, options);
	return data;
};

export const bindTxHash = async (options: BindTxHashParams): Promise<BindTxHashResponse> => {
	const data = await request<BindTxHashParams, BindTxHashResponse>(apiUrl.bindTxHashApi, options);
	return data;
};

export const createOrder = async (options: PaymentOrderParams): Promise<PaymentOrderResponse> => {
	const data = await request<PaymentOrderParams, PaymentOrderResponse>(apiUrl.bindTxHashApi, options);
	return data;
};
