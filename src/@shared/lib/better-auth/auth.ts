import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma/prisma-client";
import { nextCookies } from "better-auth/next-js";

import * as permissions from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  user: {
    additionalFields: {
      firstAccess: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },
  plugins: [
    admin({
      defaultRole: "comercial",
      adminRoles: ["admin"],
      ac: permissions.ac,
      roles: {
        admin: permissions.admin,
        support: permissions.support,
        comercial: permissions.comercial,
      },
    }),
    nextCookies(),
  ],
});
