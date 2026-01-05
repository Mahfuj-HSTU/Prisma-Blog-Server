import { prisma } from '../../lib/prisma'

const createCommentIntoDb = async (payload: {
	content: string
	authorId: string
	postId: string
	parentId?: string
}) => {
	console.log({ payload })
	const result = await prisma.comment.create({
		data: payload
	})
	console.log({ result })
	return result
}

export const CommentService = {
	createCommentIntoDb
}
