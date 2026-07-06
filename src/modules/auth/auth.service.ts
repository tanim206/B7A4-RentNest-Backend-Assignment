import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginPayload, IRegisterUser } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../lib/jsonWebToken";
import { SignOptions } from "jsonwebtoken";

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, profileImage, activeStatus, role } = payload;

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
      name: name,
      email: email,
      password: hashedPassword,
      profileImage: profileImage,
      activeStatus: activeStatus,
      role: role,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: createdUser.id },
    omit: {
      password: true,
    },
  });

  return user;
};

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  if (user.activeStatus === "BANNED") {
    throw new Error("Your account has been banned. Please contact support.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  // const refreshToken = jwtUtils.createToken(
  //   jwtPayload,
  //   config.jwt_refresh_secret,
  //   config.jwt_refresh_expires_in as SignOptions,
  // );
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    activeStatus: user.activeStatus,
  };

  return {
    accessToken,
    userData,
  };
};


const getMyProfile = async (userId: string) => {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  return userProfile;
};

export const authService = {
  registerUser,
  loginUser,
  getMyProfile,
 
};
