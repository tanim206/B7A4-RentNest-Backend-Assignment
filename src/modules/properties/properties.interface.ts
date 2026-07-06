export interface ICreatePropertyInput {
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  availabilityStatus?: "AVAILABLE" | "BOOKED" | "RENTED";
  amenities?: string[];
}

export interface IUpdatePropertyInput extends ICreatePropertyInput {
  categoryId?: string;
}

export interface IPropertiesQuery extends ICreatePropertyInput {
  //landlordId?: string;
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
