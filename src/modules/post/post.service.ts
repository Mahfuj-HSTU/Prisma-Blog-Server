import type { Post } from '../../../generated/prisma/client'
import type { PostWhereInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { PostStatus } from '../../../generated/prisma/enums'

const ceratePostIntoDb = async (
	data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>,
	userId: string
) => {
	const result = await prisma.post.create({
		data: {
			...data,
			authorId: userId
		}
	})
	return result
}

const getAllPostFromDb = (payload: {
	search?: string
	tags: string[]
	isFeatured: boolean
	status?: PostStatus
	authorId?: string
	page?: number
	limit?: number
	sortBy?: string
	sortOrder?: string
}) => {
	const {
		search,
		tags,
		isFeatured,
		status,
		authorId,
		page,
		limit,
		sortBy,
		sortOrder
	} = payload
	const andConditions: PostWhereInput[] = []
	const skip = ((page ? Number(page) : 1) - 1) * (limit ? Number(limit) : 5)
	const take = limit ? Number(limit) : 5
	if (search) {
		andConditions.push({
			OR: [
				{
					title: {
						contains: search as string,
						mode: 'insensitive'
					}
				},
				{
					content: {
						contains: search as string,
						mode: 'insensitive'
					}
				},
				{
					tags: {
						has: search as string
					}
				}
			]
		})
	}
	if (tags.length > 0) {
		andConditions.push({
			tags: {
				hasEvery: tags
			}
		})
	}
	if (typeof isFeatured === 'boolean') {
		andConditions.push({
			isFeatured
		})
	}
	if (status) {
		andConditions.push({
			status
		})
	}
	if (authorId) {
		andConditions.push({
			authorId
		})
	}
	const result = prisma.post.findMany({
		take: take,
		skip: skip,
		where: {
			AND: andConditions
		},
		orderBy:
			sortBy && sortOrder
				? {
						[sortBy]: sortOrder
				  }
				: {
						createdAt: 'desc'
				  }
	})
	return result
}

export const PostService = {
	ceratePostIntoDb,
	getAllPostFromDb
}
