import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const ceratePostIntoDb = async (data: Omit<Post, 'id'|'createdAt'|'updatedAt'>) => {
  const result = await prisma.post.create({
    data
  })
  return result
}

export const PostService = {
  ceratePostIntoDb
}