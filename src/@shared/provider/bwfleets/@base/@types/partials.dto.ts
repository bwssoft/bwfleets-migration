export namespace NUtilsDtos {
	export type Nested<E> = {
		[P in keyof E]?:
			| E[P]
			| Partial<E[P]>
			| Nested<E[P]>
			| {
					[props in RMode]?:
						| Nested<E[P]>[]
						| Nested<E[P]>
						| (E[P] extends Array<infer U> ? Nested<U> | Nested<U>[] : never)
			  }
	}

	export type Value<E> = {
		[P in keyof E]?:
			| Nested<E[P]>
			| (E[P] extends Array<infer U> ? Nested<U> | Nested<U>[] : never)
	}

	export type Fields<E> = {
		[P in keyof E]?: 0 | 1
	}

	export type Query<E> = {
		[P in keyof E]?:
			| Nested<E[P]>
			| (E[P] extends Array<infer U> ? Nested<U> | Nested<U>[] : never)
			| {
					[props in RMode]?:
						| Nested<E[P]>[]
						| Nested<E[P]>
						| (E[P] extends Array<infer U> ? Nested<U> | Nested<U>[] : never)
			  }
	}
	export type CountQuery<E> = {
		[P in keyof E]?: E[P] extends Array<string | number>
			? { in: Array<string | number> }
			: E[P] extends object
				? CountQuery<E[P]>
				: E[P]
	}
	export type Lookup = {
		from: string
		localField: string
		foreignField: string
		as: string
	}

	export type ArrayQuery<E> = {
		[P in keyof E]?:
			| E[P]
			| Partial<E[P]>
			| (E[P] extends Array<infer U> ? Nested<U> | Nested<U>[] : never)
	}

	export type ArrayValue<E> = {
		[P in keyof E]?:
			| E[P]
			| Partial<E[P]>
			| (E[P] extends Array<infer U> ? Nested<U> | Nested<U>[] : never)
	}

	export type CompoundQuery<E> = {
		must?: Query<E>[]
		must_not?: Query<E>[]
		should?: Query<E>[]
	} & Query<E>

	export type RMode =
		| "in"
		| "nin"
		| "eq"
		| "ne"
		| "gt"
		| "gte"
		| "lt"
		| "lte"
		| "type"
		| "exists"
		| "size"
		| "regex"
		| "elemMatch"
		| "all"

	export type Pagination = {
		from: number
		size: number
	}

	export type Sort<E> = {
		[P in keyof E]?: "asc" | "desc"
	}

	export type Metadata = {
		total: number
		rows: number
		size: number
		from: number
	}

	export type Call<E> = {
		write: (input: { source: E[]; id?: string }) => void
		end: () => void
	}

	export type Metric<E> = {
		field: Paths<E>
		operation: MetricOperation
		alias?: string
	}

	export enum MetricOperation {
		Average = "avg",
		Sum = "sum",
		Min = "min",
		Max = "max",
		StdDevPop = "stdDevPop",
		StdDevSamp = "stdDevSamp",
	}

	export type GroupBy<E> = {
		field: Paths<E>
		type?: "date" | "number" | "string" | "boolean"
	}

	// tipagem para chaves e valores de objetos aninhados https://www.typescriptlang.org/play?ts=4.2.3&ssl=14&ssc=20&pln=1&pc=1#code/C4TwDgpgBAUg9gSwHYB4DSAaKAFAfFAXijSggA9gIkATAZyluACdkBzKAHyiQFcBbAEYQmUAPwBYAFBQZOUhSp0GzNp278hIidNkADACQBvNAF8jAInPzKNetjFRLUAFyOAdObOHsJ3VNku3BAAbsKBSCHCANxSsZKgkDhMIYRQANoRoUxYAAxYAIxYAExYAMxYACxYAKxYAGxYAOxYABxYAJwFef6y+YVQ+SUD5QNVA7UDDQPNA20DnVBFeVBuqzlpALobcQnQ2ACGwAAWtCgAKlgAItaK9LyCYUT5OfhEaZcbN7bpmcKfokEsoEzl8lHABAArCAAY2AYh6MkM6RIyCgAGsICA4AAzKBnDYAWlErhI5BsSkYLCQ7C49008J0ARkBmMvjU8GQ6CwB2OpzOaTQG25yWC7w2uFwCKZrl+TClJjSGKxuPxgUsO3A0AAMhB9qE+VdQXcNI8Bi9UmKjT9Ikx-oCwq4QWTblBwVDYQyAkiBVBUUqcXjCcTYIhUJgoDq9RA+QKhUkQmKJVAFf6VZ9XJYYpINYkAHLRyjUADykJhwDOmtShil+1clLYWYCAjrKmpjdkEUYrmrjKZ0JbVNY7ZkJmHruOwnzXagPaZsn7ykHY9HUlHQA
	export type Join<K, P> = K extends string | number
		? P extends string | number
			? `${K}${"" extends P ? "" : "."}${P}`
			: never
		: never

	type Prev = [
		never,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		...0[],
	]

	export type Paths<T, D extends number = 5> = [D] extends [never]
		? never
		: T extends object
			? {
					[K in keyof T]-?: K extends string | number
						? `${K}` | Join<K, Paths<T[K], Prev[D]>>
						: never
				}[keyof T]
			: ""
}
