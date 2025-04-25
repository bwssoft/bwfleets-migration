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
  const data = parseFormData(formData, true) as {
    id: string;
    password: string;
  };

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(data.password);

  await ctx.internalAdapter.updatePassword(data.id, hash); //(you can also use your orm directly)

  await prisma.user.update({
    data: {
      firstAccess: false,
    },
    where: {
      id: data.id,
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
        firstAccess: false,
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
