class LocalStorageAdapter {
	set(
		key: string,
		value: any
	): void {
		localStorage.setItem(key, JSON.stringify(value))
	}

	get<T = string>(
		key: string
	): T | null {
		try {
			const localStorageItem = localStorage.getItem(key)
			return localStorageItem ? (JSON.parse(localStorageItem) as T) : null
		} catch {
			return null
		}
	}

	remove(key: string): void {
		return localStorage.removeItem(key)
	}
}

export default new LocalStorageAdapter()
