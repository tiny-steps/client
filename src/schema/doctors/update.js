import { z } from "zod";
import { GenderEnum, StatusEnum } from "./enums.js";

// Schema for updating a doctor (all fields optional except those that shouldn't change)
export const UpdateDoctorSchema = z.object({
  name: z
    .string()
    .min(1, "Doctor name is required")
    .max(200, "Doctor name must not exceed 200 characters")
    .optional(),
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
  remarks: z.string().optional(),
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
    .max(80, "Experience years must not exceed 80")
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

// Schema for partial updates (PATCH requests)
export const PartialUpdateDoctorSchema = z
  .object({
    name: z
      .string()
      .min(1, "Doctor name is required")
      .max(200, "Doctor name must not exceed 200 characters")
      .optional(),
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
    remarks: z.string().optional(),
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
      .max(80, "Experience years must not exceed 80")
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
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Form-specific schema for updating doctors (frontend use)
export const UpdateDoctorFormSchema = z.object({
  name: z
    .string()
    .min(1, "Doctor name is required")
    .max(200, "Doctor name must not exceed 200 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required",
  }),
  remarks: z.string().optional(),
  about: z.string().optional(),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(), // Base64 image data for upload
  experienceYears: z
    .number({ required_error: "Experience years is required" })
    .int()
    .min(0, "Experience years must be non-negative")
    .max(80, "Experience years must not exceed 80"),
  speciality: z.string().optional(),
  branchId: z.string().min(1, "Branch selection is required"),
  // Password is optional for updates - only validate if not empty
  password: z
    .string()
    .refine(
      (val) => !val || val.length >= 8,
      "Password must be at least 8 characters"
    )
    .refine(
      (val) => !val || val.length <= 100,
      "Password must not exceed 100 characters"
    )
    .optional(),
});

// Schema for activating/deactivating doctor
export const ActivateDeactivateDoctorSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
});

// Schema for verifying doctor
export const VerifyDoctorSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
});
