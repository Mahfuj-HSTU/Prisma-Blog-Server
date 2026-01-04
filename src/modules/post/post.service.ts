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
}) => {
	const { search, tags, isFeatured, status } = payload
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
	const result = prisma.post.findMany({
		where: {
			AND: andConditions
		}
	})
	return result
}

export const PostService = {
	ceratePostIntoDb,
	getAllPostFromDb
}
