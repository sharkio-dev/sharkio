import { z } from "zod";

export const portValidator = z.coerce
  .number()
  .nonnegative("Port number cannot be negative");
