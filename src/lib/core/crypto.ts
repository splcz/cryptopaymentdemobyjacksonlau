export interface EncryptedData {
	iv: string;
	encryptedAesKey: string;
	encryptedData: string;
	keyUint8Array: Uint8Array<ArrayBuffer>;
	key: CryptoKey;
	tag: string;
}

export default class AesGcm {
	protected publicKey: string;
	// protected key: CryptoKey | null;
	constructor(options: { publicKey: string }) {
		const { publicKey = '' } = options;
		this.publicKey = publicKey;
	}

	/**
	 * 将 PEM 格式私钥导入为 Web Crypto 的 CryptoKey
	 * @param {string} pemPrivateKey - PEM 格式的私钥（如示例中的密钥）
	 * @returns {Promise<CryptoKey>} 导入后的 CryptoKey（私钥）
	 */
	protected async importPemPrivateKey(pemPrivateKey: string): Promise<CryptoKey | undefined> {
		try {
			// 1. 解析PEM格式：移除头部、尾部和换行符
			const pemClean = pemPrivateKey
				.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, '')
				.replace(/\s+/g, ''); // 去除所有空白字符
			// const pemClean = pemPrivateKey
			// 	.replace(/-----BEGIN PRIVATE KEY-----/, '') // 移除开头标签
			// 	.replace(/-----END PRIVATE KEY-----/, '') // 移除结尾标签
			// 	.replace(/\s+/g, ''); // 移除所有换行和空格

			const buffer = this.base64ToArrayBuffer(pemClean);

			// 3. 导入为 CryptoKey（适用于 SHA256withRSA 签名）
			const cryptoKey = await window.crypto.subtle.importKey(
				'pkcs8', // 私钥格式：PKCS#8（对应 -----BEGIN PRIVATE KEY-----）
				buffer,
				{
					name: 'RSASSA-PKCS1-v1_5', // 算法：RSA 签名标准（对应 SHA256withRSA）
					hash: { name: 'SHA-256' } // 哈希算法：SHA-256
				},
				false, // 私钥是否可提取（通常设为 false，避免泄露）
				['sign'] // 用途：仅用于签名
			);

			return cryptoKey;
		} catch (error) {
			console.error('Error importing private key:', error);
		}
		return undefined;
	}

	/**
	 * 用 RSA 私钥对数据进行 SHA256withRSA 签名
	 * @param {CryptoKey} privateKey - RSA 私钥
	 * @param {string} data - 待签名的数据（字符串）
	 * @returns {string} 签名结果（Base64 格式）
	 */
	async signWithSha256Rsa(privateKey: string, data: string | object): Promise<string> {
		let plaintextStr = '';
		if (typeof data !== 'string') {
			plaintextStr = JSON.stringify(data);
		} else {
			plaintextStr = data;
		}
		// 1. 将数据转为 ArrayBuffer
		const dataBuffer = new TextEncoder().encode(plaintextStr);

		const keyCrypto = (await this.importPemPrivateKey(privateKey)) as CryptoKey;
		console.log('keyCrypto', keyCrypto);
		// 2. 用私钥签名（内部自动完成 SHA-256 哈希 + RSA 加密）
		const signatureBuffer = await window.crypto.subtle.sign(
			'RSASSA-PKCS1-v1_5', // 与密钥算法一致
			keyCrypto,
			dataBuffer
		);

		// 3. 二进制签名转为 Base64 格式（便于传输和存储）
		return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
	}
	/**
	 * 从 spki 格式导入 RSA 公钥
	 * @param {string} publicKeyBase64 Base64 编码的公钥字符串
	 * @returns {Promise<CryptoKey>} RSA公钥
	 */
	protected async importPublicKey(publicKeyBase64: string): Promise<CryptoKey | undefined> {
		try {
			// 1. 解析PEM格式：移除头部、尾部和换行符
			const pemClean = publicKeyBase64
				.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, '')
				.replace(/\s+/g, ''); // 去除所有空白字符

			const buffer = this.base64ToArrayBuffer(pemClean);

			return window.crypto.subtle.importKey(
				'spki',
				buffer,
				{ name: 'RSA-OAEP', hash: 'SHA-256' },
				true, // 导入的公钥是否允许再次导出
				['encrypt'] // 仅用于加密
			);
		} catch (error) {
			console.error('Error importing public key:', error);
		}
		return undefined;
	}

	/**
	 * 导出 RSA spki 格式，用于传输给其他方）
	 * @param {CryptoKey} publicKey RSA公钥
	 * @returns {Promise<string>} Base64 编码的公钥字符串
	 */
	protected async exportPublicKey(publicKey: CryptoKey): Promise<string> {
		const spki = await window.crypto.subtle.exportKey('spki', publicKey);
		return this.arrayBufferToBase64(new Uint8Array(spki));
	}

	/**
	 * 导出密钥为 raw 格式（Uint8Array）
	 * @param {CryptoKey} key 加密密钥
	 * @returns {Promise<Uint8Array>} 原始密钥数据
	 */
	protected async exportKey(key: CryptoKey): Promise<Uint8Array> {
		const rawKey = await window.crypto.subtle.exportKey('raw', key);
		return new Uint8Array<ArrayBuffer>(rawKey);
	}

	/**
	 * 从 raw 格式导入密钥
	 * @param {Uint8Array} rawKey 原始密钥数据
	 * @returns {Promise<CryptoKey>} 加密密钥
	 */
	protected async importKey(rawKey: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
		return window.crypto.subtle.importKey(
			'raw',
			rawKey,
			{ name: 'AES-GCM' },
			false, // 导入的密钥是否允许再次导出
			['encrypt', 'decrypt']
		);
	}

	/**
	 * 加密并提取密文和tag
	 * @param {Object | string} plaintext 明文
	 * @returns {Promise<{ iv: string; encryptedData: string; tag: string, encryptedAesKey: string; keyUint8Array: Uint8Array }>} 包含IV、密文、认证标签和加密后的AES密钥的对象
	 */
	async encrypt(plaintext: Object | string): Promise<EncryptedData | undefined> {
		try {
			const tagLength = 128; // 认证标签长度（位）
			let plaintextStr = '';
			if (typeof plaintext !== 'string') {
				plaintextStr = JSON.stringify(plaintext);
			} else {
				plaintextStr = plaintext;
			}
			// 生成 12 字节 IV（GCM 推荐长度，兼容性最好）
			const iv = window.crypto.getRandomValues(new Uint8Array(12));
			const key = await window.crypto.subtle.generateKey(
				{ name: 'AES-GCM', length: 128 }, // 128 位 AES-GCM 密钥
				true, // 允许提取密钥（用于导出存储）
				['encrypt', 'decrypt'] // 密钥用途
			);
			// RSA-OAEP 加密限制：加密数据长度 ≤ (密钥长度/8) - 42
			// 2048位密钥可加密 ≤ 245字节，4096位可加密 ≤ 501字节（足够加密AES密钥）
			const publicKey = (await this.importPublicKey(this.publicKey)) as CryptoKey;
			const keyUint8Array = (await this.exportKey(key)) as Uint8Array<ArrayBuffer>;
			const encryptedKey = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, keyUint8Array);
			const encryptedKeyBase64 = this.arrayBufferToBase64(new Uint8Array(encryptedKey));

			// 将明文转换为 Uint8Array
			const encoder = new TextEncoder();
			const data = encoder.encode(plaintextStr);

			// 加密（GCM 模式会自动生成认证标签并附加在密文后）
			const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv, tagLength }, key, data);
			// 转换为Uint8Array便于处理
			const encryptedArray = new Uint8Array(ciphertext);
			// tag长度（字节）= tagLength（位）/ 8
			const tagByteLength = tagLength / 8;
			// 密文长度 = 总长度 - tag长度
			const ciphertextByteLength = encryptedArray.length - tagByteLength;

			// 分离密文和tag
			const ciphertextArray = encryptedArray.subarray(0, ciphertextByteLength);
			const tagArray = encryptedArray.subarray(ciphertextByteLength);

			// 返回 IV 和密文（均转为 Base64 方便传输存储）
			return {
				iv: this.arrayBufferToBase64(iv),
				encryptedAesKey: encryptedKeyBase64,
				encryptedData: this.arrayBufferToBase64(ciphertextArray),
				keyUint8Array,
				key,
				tag: this.arrayBufferToBase64(tagArray)
			};
		} catch (error: unknown) {
			console.error('加密失败：', error);
			// throw new Error('加密失败：' + (error as Error).message);
		}
		return undefined;
	}

	/**
	 * 解密数据
	 * @param {string} ciphertext 密文（Base64）
	 * @param {string} iv IV（Base64）
	 * @param {Uint8Array} key 解密密钥（Base64）
	 * @returns {Promise<string>} 解密后的明文
	 */
	async decrypt(
		ciphertext: string,
		iv: string,
		tag: string,
		key: Uint8Array<ArrayBuffer>
	): Promise<string | undefined> {
		try {
			// 将 Base64 转换为 Uint8Array
			const ciphertextBuffer = this.base64ToArrayBuffer(ciphertext);
			const ivBuffer = this.base64ToArrayBuffer(iv);
			const tagBuffer = this.base64ToArrayBuffer(tag);
			const keyCrypto = await this.importKey(key);

			// 合并密文和tag（解密需要完整的加密结果）
			const encryptedBuffer = new Uint8Array([...ciphertextBuffer, ...tagBuffer]);

			// 解密（自动验证认证标签）
			const decrypted = await window.crypto.subtle.decrypt(
				{ name: 'AES-GCM', iv: ivBuffer },
				keyCrypto,
				encryptedBuffer
			);

			// 将解密结果转换为字符串
			const decoder = new TextDecoder();
			return decoder.decode(decrypted);
		} catch (error: unknown) {
			console.error('解密失败：', error);
			// throw new Error('解密失败：' + (error as Error).message); // 可能是密钥错误、IV 错误或数据被篡改
		}
		return undefined;
	}

	/**
	 * Uint8Array 转 Base64
	 * @param {Uint8Array} array 二进制数组
	 * @returns {string} Base64 字符串
	 */
	protected arrayBufferToBase64(array: Uint8Array): string {
		return btoa(String.fromCharCode(...array));
	}

	/**
	 * Base64 转 Uint8Array
	 * @param {string} base64 Base64 字符串
	 * @returns {Uint8Array} 二进制数组
	 */
	protected base64ToArrayBuffer(base64: string): Uint8Array<ArrayBuffer> {
		const binary = atob(base64);
		const array = new Uint8Array(new ArrayBuffer(binary.length)) as Uint8Array<ArrayBuffer>;
		for (let i = 0; i < binary.length; i++) {
			array[i] = binary.charCodeAt(i);
		}
		return array;
	}
}
