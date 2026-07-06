import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUser } from "./user.interface";
import config from "../../config";

const registerUser = async (payload: IUser) => {
  const { name, email, password, profileImage } = payload;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  if (userExists) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profileImage: profileImage,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: createdUser.id, email: createdUser.email },
    omit: {
      password: true,
    },
  });

  return user;
};


export const userService = {
  registerUser,
 
};
