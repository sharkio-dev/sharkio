import { z } from "zod";

export const portValidator = z
  .number()
  .nonnegative("Port number cannot be negative");
