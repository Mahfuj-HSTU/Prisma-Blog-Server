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

const getAllPostFromDb = () => {
	const result = prisma.post.findMany()
	return result
}

export const PostService = {
	ceratePostIntoDb,
	getAllPostFromDb
}
