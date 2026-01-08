import { Elysia, t } from "elysia";
import { supabase } from "../lib/supabase";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password } = body;
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        set.status = 400;
        return { error: error.message };
      }
      return { message: "Đăng ký thành công", user: data.user };
    },
    {
      body: t.Object({
        email: t.String({ format: "email", default: "huukhoa@example.com" }),
        password: t.String({ minLength: 6, default: "123456" }),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Đăng ký tài khoản mới",
        description:
          "Sử dụng email và mật khẩu để tạo tài khoản thông qua Supabase",
      },
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      // Logic login...
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Đăng nhập",
      },
    }
  );
