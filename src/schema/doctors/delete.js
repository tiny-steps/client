import { z } from "zod";

// Schema for deleting a doctor
export const DeleteDoctorSchema = z.object({
 doctorId: z.string().uuid("Invalid doctor ID format"),
});

// Schema for getting profile completeness
export const GetProfileCompletenessSchema = z.object({
 doctorId: z.string().uuid("Invalid doctor ID format"),
});
