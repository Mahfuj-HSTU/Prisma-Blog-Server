type IOptions = {
	page?: number | string
	limit?: number | string
	sortBy?: string
	sortOrder?: string
}
export const paginationSortingHelper = (options: IOptions) => {
	const page = Number(options.page) || 1
	const limit = Number(options.limit) || 5
	const skip = (page - 1) * limit
	const sortBy = options.sortBy || 'createdAt'
	const sortOrder = options.sortOrder || 'desc'
	return { skip, limit, sortBy, sortOrder }
}
