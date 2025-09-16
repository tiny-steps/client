import { z } from "zod";
import { GenderEnum } from "./enums.js";

// Schema for creating a new doctor
export const CreateDoctorSchema = z.object({
  name: z
    .string()
    .min(1, "Doctor name is required")
    .max(200, "Doctor name must not exceed 200 characters"),
  email: z.string().min(1, "Email is required").email("Email should be valid"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(20, "Phone must not exceed 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),
  slug: z
    .string()
    .max(200, "Slug must not exceed 200 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  gender: z
    .string()
    .regex(/^(MALE|FEMALE|OTHER)$/, "Gender must be MALE, FEMALE, or OTHER")
    .optional(),
  summary: z.string().optional(),
  about: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Image URL must be a valid URL"
    ),
  experienceYears: z
    .number()
    .int()
    .min(0, "Experience years must be non-negative")
    .max(100, "Experience years must not exceed 100")
    .optional(),
  isVerified: z.boolean().optional(),
  ratingAverage: z
    .number()
    .min(0.0, "Rating average must be at least 0.0")
    .max(5.0, "Rating average must not exceed 5.0")
    .optional(),
  reviewCount: z
    .number()
    .int()
    .min(0, "Review count must be non-negative")
    .optional(),
  status: z
    .string()
    .regex(
      /^(ACTIVE|INACTIVE|SUSPENDED)$/,
      "Status must be ACTIVE, INACTIVE, or SUSPENDED"
    )
    .optional(),
});

// Form-specific schema for creating doctors (frontend use)
export const CreateDoctorFormSchema = z.object({
  name: z
    .string()
    .min(1, "Doctor name is required")
    .max(200, "Doctor name must not exceed 200 characters"),
  email: z.string().min(1, "Email is required").email("Email should be valid"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(20, "Phone must not exceed 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required",
  }),
  summary: z.string().optional(),
  about: z.string().optional(),
  imageUrl: z.string().optional(),
  experienceYears: z
    .number({ required_error: "Experience years is required" })
    .int()
    .min(0, "Experience years must be non-negative")
    .max(100, "Experience years must not exceed 100"),
  speciality: z.string().min(1, "Speciality is required"),
  branchId: z.string().min(1, "Branch selection is required"),
});

// Schema for creating batch doctors
export const CreateBatchDoctorsSchema = z
  .array(
    z.object({
      userId: z.string().uuid("Invalid user ID format"),
      name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must not exceed 100 characters"),
      slug: z
        .string()
        .min(1, "Slug is required")
        .max(150, "Slug must not exceed 150 characters"),
      gender: GenderEnum,
      experienceYears: z
        .number()
        .int()
        .min(0, "Experience years must be non-negative")
        .optional(),
      imageUrl: z.string().url("Invalid image URL").optional(),
      isVerified: z.boolean().default(false),
      ratingAverage: z.number().min(0).max(5).default(0),
      reviewCount: z.number().int().min(0).default(0),
    })
  )
  .min(1, "At least one doctor must be provided")
  .max(50, "Cannot create more than 50 doctors at once");
