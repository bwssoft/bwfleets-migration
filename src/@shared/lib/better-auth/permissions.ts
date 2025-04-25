import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  comercial: [],
  support: [],
} as const;

const ac = createAccessControl(statement);

const comercial = ac.newRole({
  comercial: [],
});

const support = ac.newRole({
  support: [],
});

const admin = ac.newRole({
  ...adminAc.statements,
});

export { ac, comercial, support, admin };
