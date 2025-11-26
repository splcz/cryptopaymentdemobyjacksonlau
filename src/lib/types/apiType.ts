export interface PreOrderParams {
	preSn: string;
}

export interface PreOrderResponse {
	preSn: string;
	outerOrder: string;
	outerUid: string;
	orderAmount: number;
	digitalAmount: number;
	orderCurrency: string;
	paymentDeadline: number;
	rate: number;
	period: number;
	language: string;
	paymentSuccessWebhook: string;
	appWallets: string[];
	web3Wallets: {
		walletName: string;
		chains: { chain: string; paymentAddress: string }[];
	};
	businessType: number;
	businessAction: number;
}

export interface PaymentOrderStatusParams {
	sn: string;
}

export interface PaymentOrderStatusResponse {
	data: number;
}

export interface BindTxHashParams {
	sn: string;
	txHash: string;
}

export interface BindTxHashResponse {
	data: boolean;
}

export interface QrcodeStatusParams {
	sn: string;
	qrcodeId: string;
}

export interface QrcodeStatusResponse {
	data: boolean;
}

export interface PaymentOrderParams {
	preSn: string;
	digitalAmount: number;
	coin: string;
	rate: number;
	walletType: string;
	clientType: number;
	chain: string;
	signer: string;
	isWeb3: number;
}

export interface PaymentOrderResponse {
	data: {
		sn: string;
	};
}
