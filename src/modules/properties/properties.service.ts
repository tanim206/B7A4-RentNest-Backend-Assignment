import { prisma } from "../../lib/prisma";
import { ICreatePropertyInput } from "./properties.interface";

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
      propertyType: payload.propertyType,
      amenities: payload.amenities,
      landlordId: landlordId,
    },
  });
  return newPropertie;
};

export const propertiesServices = {
  createPropertiesIntoDB,
};
