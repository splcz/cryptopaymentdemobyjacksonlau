import AesGcm from './crypto';
import type { EncryptedData } from './crypto';
import { get, set, remove } from '../localStorage';
import { LocalStoragekeys } from '../localStorageKeys';
import { request } from '../networks/api';

interface RedotOptions {
	preOrderId: string | number;
	jwtToken: string;
	publicKey: string;
	privateKey?: string;
}

interface RequestParams {
	encryptedAesKey: string;
	encryptedData: string;
	iv: string;
	tag: string;
}

interface RequestResult {
	encryptedData: string;
	iv: string;
	tag: string;
}

interface ErrorInfo {}

interface OrderInfo {}

export class Redot {
	protected preOrderId: string | number;
	protected jwtToken: string;
	protected publicKey: string;
	protected privateKey: string;
	protected orderStatus: string | number;
	protected errorInfo: ErrorInfo;
	protected orderInfo: OrderInfo;
	protected aesGcm: AesGcm | null = null;
	constructor(options: RedotOptions) {
		// super(options);
		const { preOrderId, jwtToken, publicKey, privateKey } = options;
		this.preOrderId = preOrderId;
		this.jwtToken = jwtToken;
		this.publicKey = publicKey;
		this.privateKey = privateKey;
		this.orderStatus = '';
		this.errorInfo = {};
		this.orderInfo = {};
		this.init();
	}
	/**
	 * Captures a manually created event and sends it to Sentry.
	 *
	 *
	 */
	private init(): void {
		this.aesGcm = new AesGcm({ publicKey: this.publicKey });
		// this.setJwtTokenToLocalStorage(this.jwtToken);
	}

	private setJwtTokenToLocalStorage(jwtToken: string): void {
		const key = LocalStoragekeys.JWT_TOKEN;
		const currentToken = get(key);
		if (currentToken) {
			remove(key);
		}
		set(key, jwtToken);
	}

	private setSignToLocalStorage(privateKey: string): void {
		const key = LocalStoragekeys.SIGN;
		const currentToken = get(key);
		if (currentToken) {
			remove(key);
		}
		set(key, privateKey);
	}
	destroy(): void {
		// 重置初始化状态
		const key = LocalStoragekeys.JWT_TOKEN;
		const currentToken = get(key);
		if (currentToken) {
			remove(key);
		}
	}

	refreshJwtToken(jwtToken: string): boolean {
		if (jwtToken) {
			this.jwtToken = jwtToken;
			this.setJwtTokenToLocalStorage(jwtToken);
			return true;
		}
		return false;
	}

	getAesGcmInstance(): AesGcm | null {
		return this.aesGcm;
	}

	async requestApi<U, T>(url: string, options: U): Promise<T> {
		try {
			// 验签
			const sign = await this.aesGcm?.signWithSha256Rsa(this.privateKey, options as Object);
			this.setSignToLocalStorage(sign as string);

			const result = await this.aesGcm?.encrypt(options as Object);

			let { encryptedData, iv, tag, keyUint8Array, encryptedAesKey } = result as unknown as EncryptedData;

			const data = await request<RequestParams, RequestResult>(url, { encryptedAesKey, encryptedData, iv, tag });
			const { encryptedData: encryptedData1, iv: iv1, tag: tag1 } = data;

			const res = (await this.aesGcm?.decrypt(
				encryptedData1,
				iv1,
				tag1,
				keyUint8Array as Uint8Array<ArrayBuffer>
			)) as string;

			return JSON.parse(res) as T;
			// const data = await request<U, T>(url, options);
			// return data;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	}
}
