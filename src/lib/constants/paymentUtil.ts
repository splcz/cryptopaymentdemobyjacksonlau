import { isMobile } from "../isMobile";

export enum PaymentStatus {
	UNPAID = 0,
	PAYING = 1,
	SUCCESS = 2,
	FAILED = 3,
	CANCELLED = 4
}

export const TerminalStatuses = [PaymentStatus.SUCCESS, PaymentStatus.FAILED, PaymentStatus.CANCELLED] as const;

export const PaymentToast: Record<typeof TerminalStatuses[number], string> = {
	[PaymentStatus.SUCCESS]: '支付成功',
	[PaymentStatus.FAILED]: '支付失败',
	[PaymentStatus.CANCELLED]: '支付取消'
}

export const CLIENT_TYPE = isMobile() ? 'H5' : 'WEB';