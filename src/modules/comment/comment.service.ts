import type { CommentStatus } from '../../../generated/prisma/enums'
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

const getCommentByIdFromDb = async (id: string) => {
	return await prisma.comment.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			replies: true,
			post: {
				select: {
					id: true,
					title: true
				}
			}
		}
	})
}

const getCommentsByAuthorIdFromDb = async (authorId: string) => {
	return await prisma.comment.findMany({
		where: {
			authorId
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			replies: true,
			post: {
				select: {
					id: true,
					title: true
				}
			}
		}
	})
}

const deleteCommentFromDb = async (commentId: string, userId: string) => {
	const commentData = await prisma.comment.findUnique({
		where: {
			id: commentId,
			authorId: userId
		}
	})
	if (!commentData) {
		return 'Comment not found'
	}
	if (commentData.authorId !== userId) {
		return 'Unauthorized'
	}
	const result = await prisma.comment.delete({
		where: {
			id: commentId
		}
	})
	return result
}

const updateCommentIntoDb = async (
	commentId: string,
	payload: {
		content?: string
		status?: CommentStatus
	},
	authorId: string
) => {
	const commentData = await prisma.comment.findUnique({
		where: {
			id: commentId,
			authorId
		}
	})
	if (!commentData) {
		return 'Comment not found'
	}
	const result = await prisma.comment.update({
		where: {
			id: commentId,
			authorId
		},
		data: payload
	})
	return result
}

export const CommentService = {
	createCommentIntoDb,
	getCommentByIdFromDb,
	getCommentsByAuthorIdFromDb,
	deleteCommentFromDb,
	updateCommentIntoDb
}
