import * as yup from "yup";

const email = yup.string().email("Enter a valid email").required("Email is required");
const password = yup
  .string()
  .min(4, "Password must be at least 4 characters")
  .required("Password is required");

export const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email,
  password,
});

export const loginSchema = yup.object({
  email,
  password,
});

export const feedbackSchema = yup.object({
  rating: yup
    .number()
    .typeError("Rating must be a number")
    .integer("Rating must be an integer")
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5")
    .required("Rating is required"),
  comment: yup
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .required("Comment is required"),
});

export const adminLoginSchema = yup.object({
  username: yup.string().trim().required("Username is required"),
  password,
});

export const adminFeedbackFilterSchema = yup.object({
  emotion: yup.string().trim().optional(), 
  minRating: yup
    .number()
    .transform((v, o) => (o === "" || Number.isNaN(v) ? undefined : v))
    .integer("Must be an integer")
    .min(1, "Min is 1")
    .max(5, "Max is 5")
    .optional(),
});