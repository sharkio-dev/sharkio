import env from "dotenv";
import jwt from "jsonwebtoken";

env.config();

export const supabaseClient = {
  auth: {
    signInWithPassword: async (email: string, password: string) => {
      return {
        data: {
          session: {
            access_token: "asdasd"
          }
        }
      }
    },
    signOut: async () => {
    },
    getUser: async (access_token: string) => {
      const { email } = jwt.decode(access_token);
      

      return {
        data: {
          user: {
            id: "123"
          }
        }
      }
    }
  }
}
