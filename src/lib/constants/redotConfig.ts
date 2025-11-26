/**
 * Redot 默认配置常量
 * 从环境变量文件中读取配置
 * 开发环境: .env.development
 * 生产环境: .env.production
 */

export const IS_DEV = import.meta.env.MODE=='development';

// 从环境变量读取配置，如果未设置则使用默认值（开发环境的值）
export const DEFAULT_PUBLIC_KEY =
	import.meta.env.VITE_REDOT_PUBLIC_KEY ||
	'-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuctrVK3eP8hpoJf7FMetlcR77FYcj9HtrkySyGDRt5HHwdwgM8jK0kfE4ag/zI8goe8M0iJ2o7n3VCfTzn8OyfU0bu6KzDti1WOJV9fv4XtSmhm9W4WKjIc8uDQViR7E8trzcrbKFVbKVGng1+z0KobQBDtWhjUeXKktUq1lpiejTS+XjXej26ANPfwbqbY+/6kBB3sWbt9BLDI/WhPYXnFV9oJWod9I/dYUgUUA/b/+bI1wlobNntBDxiNmX0kbqpGZbzO6l9wWFXZiFCD25QtBOZlMbn9noH4KW3DnKGc2nKNz/f2FEM9DJKn3P7NGFVy6O/Q5NzcbFs+DI6nTywIDAQAB-----END PUBLIC KEY-----';

export const DEFAULT_APP_KEY = import.meta.env.VITE_REDOT_APP_KEY || '4EC27F09-4E3F-4FCE-90A3-4EF1BB767824';

export const DEFAULT_SECRET_KEY = import.meta.env.VITE_REDOT_SECRET_KEY || '6a213370-049e-4898-90c2-402b88caa04c';

export const DEFAULT_PRIVATE_KEY = import.meta.env.VITE_REDOT_PRIVATE_KEY;

export const DEFAULT_PREORDER_ID = import.meta.env.VITE_REDOT_PREORDER_ID;
export const DEFAULT_JWT_TOKEN = import.meta.env.VITE_REDOT_JWT_TOKEN;