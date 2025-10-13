import { z } from "zod";
import { GenderEnum, StatusEnum } from "./enums.js";

// Response schemas for API responses
export const DoctorResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  slug: z.string(),
  gender: GenderEnum,
  remarks: z.string().nullable(),
  about: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  experienceYears: z.number().int(),
  isVerified: z.boolean(),
  ratingAverage: z.number(),
  reviewCount: z.number().int(),
  status: StatusEnum,
  speciality: z.string().optional(),
  createdAt: z
    .string()
    .refine(
      (val) => val === "" || z.string().datetime().safeParse(val).success,
      "Invalid datetime format"
    ),
  updatedAt: z
    .string()
    .refine(
      (val) => val === "" || z.string().datetime().safeParse(val).success,
      "Invalid datetime format"
    ),
  // Add missing fields from the API response
  awards: z.array(z.any()).optional(),
  memberships: z.array(z.any()).optional(),
  organizations: z.array(z.any()).optional(),
  photos: z.array(z.any()).optional(),
  practices: z.array(z.any()).optional(),
  qualifications: z.array(z.any()).optional(),
  recommendations: z.array(z.any()).optional(),
  registrations: z.array(z.any()).optional(),
  sessionPricings: z.array(z.any()).optional(),
  specializations: z.array(z.any()).optional(),
});

export const PaginatedDoctorsResponseSchema = z.object({
  content: z.array(DoctorResponseSchema),
  number: z.number().int(), // API uses "number" not "page"
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  first: z.boolean(),
  last: z.boolean(),
  numberOfElements: z.number().int(),
  empty: z.boolean().optional(),
  pageable: z.any().optional(), // Include optional fields from API
  sort: z.any().optional(),
});

// API Response wrapper schema
export const ApiResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: PaginatedDoctorsResponseSchema,
  errors: z.any().nullable(),
});

export const ProfileCompletenessResponseSchema = z.object({
  doctorId: z.string().uuid(),
  completenessPercentage: z.number().min(0).max(100),
  missingFields: z.array(z.string()),
  completedSections: z.array(z.string()),
});
