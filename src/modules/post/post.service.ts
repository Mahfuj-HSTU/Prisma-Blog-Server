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

export const PostService = {
	ceratePostIntoDb,
	getAllPostFromDb,
	getPostByIdFromDb
}
