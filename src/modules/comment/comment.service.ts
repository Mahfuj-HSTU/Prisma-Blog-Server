import { prisma } from '../../lib/prisma'

const createCommentIntoDb = async (payload: {
	content: string
	authorId: string
	postId: string
	parentId?: string
}) => {
	await prisma.post.findUniqueOrThrow({
		where: {
			id: payload.postId
		}
	})

	if (payload.parentId) {
		await prisma.comment.findUniqueOrThrow({
			where: {
				id: payload.parentId
			}
		})
	}
	const result = await prisma.comment.create({
		data: payload
	})
	return result
}

export const CommentService = {
	createCommentIntoDb
}
