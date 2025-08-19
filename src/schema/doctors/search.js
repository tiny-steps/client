import { z } from "zod";
import { GenderEnum, StatusEnum } from "./enums.js";

// Schema for getting doctor by ID
export const GetDoctorByIdSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
});

// Schema for pagination parameters
export const PaginationSchema = z.object({
  page: z.number().int().min(0, "Page must be non-negative").default(0),
  size: z
    .number()
    .int()
    .min(1, "Size must be at least 1")
    .max(100, "Size must not exceed 100")
    .default(20),
  sort: z.string().optional().default("name,asc"),
});

// Schema for getting all doctors with search and filter capabilities
export const GetAllDoctorsSchema = z
  .object({
    name: z.string().min(1, "Name must not be empty").optional(),
    speciality: z.string().min(1, "Speciality must not be empty").optional(),
    isVerified: z.boolean().optional(),
    minRating: z.number().min(0).max(5).optional(),
    gender: GenderEnum.optional(),
    status: StatusEnum.optional(),
    minExperience: z.number().int().min(0).optional(),
    maxExperience: z.number().int().min(0).optional(),
    page: z.number().int().min(0, "Page must be non-negative").default(0),
    size: z
      .number()
      .int()
      .min(1, "Size must be at least 1")
      .max(100, "Size must not exceed 100")
      .default(20),
    sort: z.string().optional().default("name,asc"),
  })
  .refine(
    (data) => {
      if (
        data.minExperience !== undefined &&
        data.maxExperience !== undefined
      ) {
        return data.minExperience <= data.maxExperience;
      }
      return true;
    },
    {
      message: "Min experience must be less than or equal to max experience",
      path: ["minExperience"],
    }
  );

// Schema for doctor search parameters
export const SearchDoctorsSchema = z
  .object({
    name: z.string().min(1, "Name must not be empty").optional(),
    speciality: z.string().min(1, "Speciality must not be empty").optional(),
    isVerified: z.boolean().optional(),
    minRating: z.number().min(0).max(5).optional(),
    gender: GenderEnum.optional(),
    status: StatusEnum.optional(),
    minExperience: z.number().int().min(0).optional(),
    maxExperience: z.number().int().min(0).optional(),
    page: z.number().int().min(0, "Page must be non-negative").default(0),
    size: z
      .number()
      .int()
      .min(1, "Size must be at least 1")
      .max(100, "Size must not exceed 100")
      .default(20),
    sort: z.string().optional().default("name,asc"),
  })
  .refine(
    (data) => {
      if (
        data.minExperience !== undefined &&
        data.maxExperience !== undefined
      ) {
        return data.minExperience <= data.maxExperience;
      }
      return true;
    },
    {
      message:
        "Minimum experience must be less than or equal to maximum experience",
      path: ["minExperience"],
    }
  );

// Schema for getting doctors by status
export const GetDoctorsByStatusSchema = z.object({
  status: StatusEnum,
  page: z.number().int().min(0, "Page must be non-negative").default(0),
  size: z
    .number()
    .int()
    .min(1, "Size must be at least 1")
    .max(100, "Size must not exceed 100")
    .default(20),
});

// Schema for getting doctors by verification status
export const GetDoctorsByVerificationSchema = z.object({
  isVerified: z.boolean(),
  page: z.number().int().min(0, "Page must be non-negative").default(0),
  size: z
    .number()
    .int()
    .min(1, "Size must be at least 1")
    .max(100, "Size must not exceed 100")
    .default(20),
});

// Schema for getting doctors by gender
export const GetDoctorsByGenderSchema = z.object({
  gender: GenderEnum,
  page: z.number().int().min(0, "Page must be non-negative").default(0),
  size: z
    .number()
    .int()
    .min(1, "Size must be at least 1")
    .max(100, "Size must not exceed 100")
    .default(20),
});

// Schema for getting doctors by minimum rating
export const GetDoctorsByMinRatingSchema = z.object({
  minRating: z.number().min(0).max(5),
  page: z.number().int().min(0, "Page must be non-negative").default(0),
  size: z
    .number()
    .int()
    .min(1, "Size must be at least 1")
    .max(100, "Size must not exceed 100")
    .default(20),
});
