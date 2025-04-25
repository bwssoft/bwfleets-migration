import { findManyWithSessions } from "@/@shared/actions/user.actions";
import { UsersTable } from "./users.table";

export async function UsersTableLoader() {
  const users = await findManyWithSessions();

  return <UsersTable data={users} />;
}
