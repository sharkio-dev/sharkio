import { User } from "@supabase/supabase-js";

export type UserContext = {
  workspaceId?: string;
} & User;
