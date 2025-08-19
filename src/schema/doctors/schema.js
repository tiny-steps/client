// Export enums
export * from "./enums.js";

// Export create schemas
export * from "./create.js";

// Export update schemas
export * from "./update.js";

// Export search/query schemas
export * from "./search.js";

// Export response schemas
export * from "./responses.js";

// Export delete schemas
export * from "./delete.js";

// Utility functions for validation
import { CreateDoctorSchema, CreateDoctorFormSchema } from "./create.js";
import { UpdateDoctorSchema, PartialUpdateDoctorSchema, UpdateDoctorFormSchema } from "./update.js";
import { SearchDoctorsSchema, PaginationSchema } from "./search.js";

export const validateCreateDoctor = (data) => CreateDoctorSchema.parse(data);
export const validateUpdateDoctor = (data) => UpdateDoctorSchema.parse(data);
export const validatePartialUpdateDoctor = (data) => PartialUpdateDoctorSchema.parse(data);
export const validateSearchDoctors = (data) => SearchDoctorsSchema.parse(data);
export const validatePagination = (data) => PaginationSchema.parse(data);

// Safe validation functions that return result objects
export const safeValidateCreateDoctor = (data) => CreateDoctorSchema.safeParse(data);
export const safeValidateUpdateDoctor = (data) => UpdateDoctorSchema.safeParse(data);
export const safeValidatePartialUpdateDoctor = (data) => PartialUpdateDoctorSchema.safeParse(data);
export const safeValidateSearchDoctors = (data) => SearchDoctorsSchema.safeParse(data);
export const safeValidatePagination = (data) => PaginationSchema.safeParse(data);

// Form validation functions
export const safeValidateCreateDoctorForm = (data) => CreateDoctorFormSchema.safeParse(data);
export const safeValidateUpdateDoctorForm = (data) => UpdateDoctorFormSchema.safeParse(data);
