import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
  // ডাটাবেজ থেকে সরাসরি সব ইউজার নিয়ে আসা (পাসওয়ার্ড ছাড়া)
  const allUsers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc", // নতুন ইউজারদের সিরিয়াল অনুযায়ী আগে দেখাবে
    },
    omit: {
      password: true, // সিকিউরিটির জন্য পাসওয়ার্ড বাদ দেওয়া হলো
    },
  });

  return allUsers;
};

const updateUserStatus = async (
  userId: string,
  status: "BANNED" | "UNBANNED",
) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User not found.");
  }

  const updatedStatus = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeStatus: status,
    },
    omit: {
      password: true,
    },
  });

  return updatedStatus;
};

const deleteUser = async (userId: string) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User not found.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully." };
};

export const adminService = {
  getAllUser,
  updateUserStatus,
  deleteUser,
};
