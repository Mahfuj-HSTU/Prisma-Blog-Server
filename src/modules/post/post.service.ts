import type { Post } from '../../../generated/prisma/client'
import type { PostWhereInput } from '../../../generated/prisma/models'
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

const getAllPostFromDb = (payload: { search?: string; tags: string[] }) => {
	const { search, tags } = payload
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
