import { z } from "zod";

// Enums
const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const StatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]);
const SortDirectionEnum = z.enum(["asc", "desc"]);

// Base Doctor Schema for creation
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

// Schema for updating a doctor (all fields optional except those that shouldn't change)
export const UpdateDoctorSchema = z.object({
  name: z
    .string()
    .min(1, "Doctor name is required")
    .max(200, "Doctor name must not exceed 200 characters")
    .optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email should be valid")
    .optional(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(20, "Phone must not exceed 20 characters")
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

// Schema for partial updates (PATCH requests)
export const PartialUpdateDoctorSchema = z
  .object({
    name: z
      .string()
      .min(1, "Doctor name is required")
      .max(200, "Doctor name must not exceed 200 characters")
      .optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Email should be valid")
      .optional(),
    phone: z
      .string()
      .min(1, "Phone is required")
      .max(20, "Phone must not exceed 20 characters")
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
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

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

// Schema for deleting a doctor
export const DeleteDoctorSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
});

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

// Schema for activating/deactivating doctor
export const ActivateDeactivateDoctorSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
});

// Schema for verifying doctor
export const VerifyDoctorSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
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
        .max(80, "Experience years seems too high"),
      status: StatusEnum.default("ACTIVE"),
      summary: z
        .string()
        .max(500, "Summary must not exceed 500 characters")
        .optional(),
      about: z
        .string()
        .max(2000, "About must not exceed 2000 characters")
        .optional(),
      imageUrl: z.string().url("Invalid image URL").optional(),
      isVerified: z.boolean().default(false),
      ratingAverage: z.number().min(0).max(5).default(0),
      reviewCount: z.number().int().min(0).default(0),
    })
  )
  .min(1, "At least one doctor must be provided")
  .max(50, "Cannot create more than 50 doctors at once");

// Schema for getting profile completeness
export const GetProfileCompletenessSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID format"),
});

// Response schemas for API responses
export const DoctorResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  gender: GenderEnum,
  summary: z.string().nullable(),
  about: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  experienceYears: z.number().int(),
  isVerified: z.boolean(),
  ratingAverage: z.number(),
  reviewCount: z.number().int(),
  status: StatusEnum,
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

// Export all schemas for easy importing
export const DoctorSchemas = {
  CreateDoctorSchema,
  UpdateDoctorSchema,
  PartialUpdateDoctorSchema,
  GetDoctorByIdSchema,
  GetAllDoctorsSchema,
  SearchDoctorsSchema,
  DeleteDoctorSchema,
  GetDoctorsByStatusSchema,
  GetDoctorsByVerificationSchema,
  GetDoctorsByGenderSchema,
  GetDoctorsByMinRatingSchema,
  ActivateDeactivateDoctorSchema,
  VerifyDoctorSchema,
  CreateBatchDoctorsSchema,
  GetProfileCompletenessSchema,
  DoctorResponseSchema,
  PaginatedDoctorsResponseSchema,
  ApiResponseSchema,
  ProfileCompletenessResponseSchema,
  PaginationSchema,
};

// Utility functions for validation
export const validateCreateDoctor = (data) => CreateDoctorSchema.parse(data);
export const validateUpdateDoctor = (data) => UpdateDoctorSchema.parse(data);
export const validatePartialUpdateDoctor = (data) =>
  PartialUpdateDoctorSchema.parse(data);
export const validateSearchDoctors = (data) => SearchDoctorsSchema.parse(data);
export const validatePagination = (data) => PaginationSchema.parse(data);

// Safe validation functions that return result objects
export const safeValidateCreateDoctor = (data) =>
  CreateDoctorSchema.safeParse(data);
export const safeValidateUpdateDoctor = (data) =>
  UpdateDoctorSchema.safeParse(data);
export const safeValidatePartialUpdateDoctor = (data) =>
  PartialUpdateDoctorSchema.safeParse(data);
export const safeValidateSearchDoctors = (data) =>
  SearchDoctorsSchema.safeParse(data);
export const safeValidatePagination = (data) =>
  PaginationSchema.safeParse(data);
