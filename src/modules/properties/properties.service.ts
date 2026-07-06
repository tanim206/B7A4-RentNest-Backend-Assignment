import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyInput,
  IPropertiesQuery,
  IUpdatePropertyInput,
} from "./properties.interface";

const createPropertiesIntoDB = async (
  landlordId: string,
  payload: ICreatePropertyInput,
) => {
  const newPropertie = await prisma.properties.create({
    data: {
      title: payload.title,
      description: payload.description,
      price: Number(payload.price),
      location: payload.location,
      availabilityStatus: payload.availabilityStatus,
      propertyType: payload.propertyType,
      amenities: payload.amenities,
      landlordId: landlordId,
    },
  });
  return newPropertie;
};

const getAllProperties = async (query: IPropertiesQuery) => {
  // ১. পেজিনেশন ও সর্টিং ভ্যালু সেটআপ (ডিফল্ট ভ্যালুসহ)
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  // ২. সার্চ কন্ডিশন তৈরি (Title অথবা Location-এর সাথে মিললে ডাটা আসবে)
  const whereConditions: any = {};

  if (query.searchTerm) {
    whereConditions.OR = [
      { title: { contains: query.searchTerm, mode: "insensitive" } },
      { location: { contains: query.searchTerm, mode: "insensitive" } },
    ];
  }

  // ৩. ডাটাবেজ থেকে মোট প্রপার্টির সংখ্যা বের করা
  const totalProperties = await prisma.properties.count({
    where: whereConditions,
  });

  const allProperties = await prisma.properties.findMany({
    where: whereConditions,
    take: limit,
    skip: skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    allProperties,
    meta: {
      page: page,
      limit: limit,
      total: totalProperties,
      totalPages: Math.ceil(totalProperties / limit),
    },
  };
};

const updatePropertyIntoDB = async (
  landlordId: string,
  propertyId: string,
  payload: IUpdatePropertyInput,
) => {
  const existingProperty = await prisma.properties.findUnique({
    where: {
      id: propertyId,
      landlordId,
    },
  });

  if (!existingProperty) {
    throw new Error(
      "Property not found or you do not have permission to update it.",
    );
  }

  if (payload.price !== undefined) {
    payload.price = Number(payload.price);
  }
  const update = await prisma.properties.update({
    where: { id: propertyId },
    data: payload,
  });
  return update;
};

const deleteProperties = async (landlordId: string, propertyId: string) => {
  const existingProperty = await prisma.properties.findUnique({
    where: {
      id: propertyId,
      landlordId,
    },
  });

  if (!existingProperty) {
    throw new Error("Property not found!.");
  }

  const deletePropertie = await prisma.properties.delete({
    where: { id: propertyId },
  });
  return deletePropertie;
};

const getPropertyById = async (propertyId: string) => {
  const property = await prisma.properties.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

export const propertiesServices = {
  createPropertiesIntoDB,
  updatePropertyIntoDB,
  deleteProperties,
  getAllProperties,
  getPropertyById,
};
