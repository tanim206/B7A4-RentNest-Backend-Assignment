import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";

interface ILoginPayload {
  email: string;
  password: string;
}

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

  const userWithoutPassword = await prisma.user.findUnique({
    where: { id: user.id },
    omit: {
      password: true,
    },
  });

  return userWithoutPassword;
};

export const authService = {
  loginUser,
};
