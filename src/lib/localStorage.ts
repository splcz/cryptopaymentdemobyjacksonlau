import type { LocalStoragekeys } from './localStorageKeys';
const windowLocalStorage = window.localStorage;

export const getKey = (key: LocalStoragekeys) => `MY_APP:${key}`;

export function set(key: LocalStoragekeys, value: string) {
	windowLocalStorage.setItem(getKey(key), value);
}

export function get(key: LocalStoragekeys) {
	return windowLocalStorage.getItem(getKey(key));
}

export function remove(key: LocalStoragekeys) {
	windowLocalStorage.removeItem(getKey(key));
}

export function clear() {
	windowLocalStorage.clear();
}
