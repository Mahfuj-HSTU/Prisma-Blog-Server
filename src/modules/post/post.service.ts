import type { Post } from '../../../generated/prisma/client'
import type { PostWhereInput } from '../../../generated/prisma/models'
import { prisma } from '../../lib/prisma'
import { CommentStatus, PostStatus } from '../../../generated/prisma/enums'

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

const getAllPostFromDb = async (payload: {
	search?: string
	tags: string[]
	isFeatured: boolean
	status?: PostStatus
	authorId?: string
	page?: number | string
	skip: number
	limit: number
	sortBy: string
	sortOrder: string
}) => {
	const {
		search,
		tags,
		isFeatured,
		status,
		authorId,
		page,
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
	const result = await prisma.post.findMany({
		take: limit,
		skip,
		where: {
			AND: andConditions
		},
		orderBy: {
			[sortBy]: sortOrder
		},
		include: {
			_count: {
				select: {
					comments: true
				}
			}
		}
	})
	const total = await prisma.post.count({
		where: {
			AND: andConditions
		}
	})
	return {
		data: result,
		pagination: {
			total,
			page,
			limit,
			totalPage: Math.ceil(total / limit)
		}
	}
}

const getPostByIdFromDb = async (id: string) => {
	const result = await prisma.$transaction(async (txt) => {
		await txt.post.update({
			where: {
				id
			},
			data: {
				views: {
					increment: 1
				}
			}
		})
		const postData = await txt.post.findUnique({
			where: {
				id
			},
			include: {
				comments: {
					where: {
						parentId: null,
						status: CommentStatus.PUBLISHED
					},
					orderBy: {
						createdAt: 'desc'
					},
					include: {
						replies: {
							where: {
								status: CommentStatus.PUBLISHED
							},
							orderBy: {
								createdAt: 'desc'
							},
							include: {
								replies: {
									where: {
										status: CommentStatus.PUBLISHED
									},
									orderBy: {
										createdAt: 'asc'
									}
								}
							}
						}
					}
				},
				_count: {
					select: { comments: true }
				}
			}
		})
		return postData
	})
	return result
}

const getPostByUserIdFromDb = async (userId: string) => {
	const userInfo = await prisma.user.findUniqueOrThrow({
		where: {
			id: userId,
			status: 'ACTIVE'
		},
		select: {
			id: true
		}
	})

	if (!userInfo) {
		return 'User not found'
	}

	const result = await prisma.post.findMany({
		where: {
			authorId: userId
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			_count: {
				select: {
					comments: true
				}
			}
		}
	})
	// const total = await prisma.post.count({
	// 	where: {
	// 		authorId: userId
	// 	}
	// })
	// return {
	// 	data: result,
	// 	pagination: {
	// 		total,
	// 		page: 1,
	// 		limit: 10,
	// 		totalPage: Math.ceil(total / 10)
	// 	}
	// }

	const total = await prisma.post.aggregate({
		where: {
			authorId: userId
		},
		_count: {
			authorId: true
		}
	})

	return { data: result, total: total._count.authorId }
}

// * user can update only his post and featured can't update, admin can update any post
const updatePostIntoDb = async (
	postId: string,
	data: Partial<Post>,
	authorId: string,
	isAdmin: boolean
) => {
	const postData = await prisma.post.findUniqueOrThrow({
		where: {
			id: postId
		},
		select: {
			id: true,
			authorId: true
		}
	})

	if (postData.authorId !== authorId && !isAdmin) {
		throw new Error('You are not authorized to update this post')
	}
	if (!isAdmin) {
		delete data?.isFeatured
	}

	const result = await prisma.post.update({
		where: {
			id: postData.id
		},
		data
	})

	return result
}

// * user can delete only his post, admin can delete any post
const deletePostFromDb = async (
	postId: string,
	authorId: string,
	isAdmin: boolean
) => {
	const postData = await prisma.post.findUniqueOrThrow({
		where: {
			id: postId
		},
		select: {
			id: true,
			authorId: true
		}
	})

	if (postData.authorId !== authorId && !isAdmin) {
		throw new Error('You are not authorized to delete this post')
	}

	const result = await prisma.post.delete({
		where: {
			id: postData.id
		}
	})

	return result
}

const getStats = async () => {
	return await prisma.$transaction(async (txt) => {
		const totalPost = await txt.post.count()
		const PublishedPost = await txt.post.count({
			where: {
				status: PostStatus.PUBLISHED
			}
		})
		const draftPost = await txt.post.count({
			where: {
				status: PostStatus.DRAFT
			}
		})
		const archivedPost = await txt.post.count({
			where: {
				status: PostStatus.ARCHIVED
			}
		})
		const totalUser = await txt.user.count()
		const totalComment = await txt.comment.count()
		return {
			totalPost,
			totalUser,
			totalComment,
			PublishedPost,
			draftPost,
			archivedPost
		}
	})
}

export const PostService = {
	ceratePostIntoDb,
	getAllPostFromDb,
	getPostByIdFromDb,
	getPostByUserIdFromDb,
	updatePostIntoDb,
	deletePostFromDb,
	getStats
}
