import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
  const { name, description } = payload;

  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) {
    throw new Error("Category already exists");
  }

  const created = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return created;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export const categoryService = {
  createCategory,
  getAllCategories,
};
