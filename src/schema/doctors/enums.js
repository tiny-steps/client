import { z } from "zod";

// Enums
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const StatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]);
export const SortDirectionEnum = z.enum(["asc", "desc"]);
