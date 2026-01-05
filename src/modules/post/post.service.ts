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
	skip: number
	limit: number
	sortBy?: string
	sortOrder?: string
}) => {
	const {
		search,
		tags,
		isFeatured,
		status,
		authorId,
		skip,
		limit,
		sortBy,
		sortOrder
	} = payload
	const andConditions: PostWhereInput[] = []
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
		take: limit,
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
