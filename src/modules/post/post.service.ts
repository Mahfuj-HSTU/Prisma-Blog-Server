import type { Post } from '../../../generated/prisma/client'
import { prisma } from '../../lib/prisma'

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

const getAllPostFromDb = (payload: { search?: string }) => {
	const result = prisma.post.findMany({
		where: {
			OR: [
				{
					title: {
						contains: payload.search as string,
						mode: 'insensitive'
					}
				},
				{
					content: {
						contains: payload.search as string,
						mode: 'insensitive'
					}
				},
				{
					tags: {
						has: payload.search as string
					}
				}
			]
		}
	})
	return result
}

export const PostService = {
	ceratePostIntoDb,
	getAllPostFromDb
}
