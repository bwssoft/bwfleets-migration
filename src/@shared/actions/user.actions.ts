"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/better-auth/auth";
import { parseFormData } from "../utils/parse-form-data";
import { headers } from "next/headers";
import { prisma } from "../lib/prisma/prisma-client";

interface SignInParams {
  email: string;
  password: string;
}

export async function signIn(formData: FormData) {
  const data = parseFormData(formData) as SignInParams;

  await auth.api.signInEmail({
    body: data,
  });

  redirect("/home");
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}

export async function setFirstAccessPassword(formData: FormData) {
  const data = parseFormData(formData, true) as { password: string };

  await auth.api.resetPassword({
    body: {
      newPassword: data.password,
    },
  });

  await auth.api.updateUser({
    body: {
      firstAccess: false,
    },
  });

  redirect("/home");
}

interface CreateUserParams {
  email: string;
  name: string;
  role: "admin" | "comercial";
}

export async function createUser(formData: FormData) {
  const { email, name, role } = parseFormData(
    formData,
    true
  ) as CreateUserParams;

  const password = "123456@";

  await auth.api.createUser({
    body: {
      email,
      name,
      password,
      role,
      data: {
        firstAccess: true,
      },
    },
  });

  return { password };
}

export async function findManyWithSessions() {
  const data = await prisma.user.findMany({
    include: {
      sessions: true,
    },
  });

  return data;
}
