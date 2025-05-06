import { MigrationStatus, User } from "@prisma/client";

export interface WWTAccountStats {
  deviceTotalNo: number;
  deviceNo: number;
  onlineDeviceNo: number;
  offlineDeviceNo: number;
  unUsedDeviceNo: number;
  accountId: number;
  success: boolean;
}

export type MigrationStatusEnum =
  | "to-do" // status de inicio
  | "pending" // status de andamento
  | "waiting" // status de andamento
  | "done" // status de finalização
  | "failed-by-client" // status de finalização
  | "failed-by-contact"; // status de finalização

export interface SubAccount {
  accountId: number;
  userName: string;
  type: number;
  parentId: number;
  accountStatsBean: WWTAccountStats;
  isLeaf: number;
  success: boolean;
}

export interface WWTAccount {
  id: string;
  accountId: number;
  accountName: string;
  userName: string;
  type: number;
  email?: string | null;
  parentId: number;
  rootId: number;
  createTime: number;
  contactUser: string;
  contactTel: string;
  address: string;
  isReceiveOfflineMessage: number;
  isReceiveWaring: number;
  accountStatsBean: WWTAccountStats;
  isLeaf: number;
  migrationStatus: MigrationStatus | null;
  assignedId?: string | null;
  assigned?: Partial<User> | null;
  // subAccountBeanList?: SubAccount[];
}

export type WWTClient = Omit<WWTAccount, "subAccountBeanList"> & {
  // subAccountBeanList: WWTClient[];
};
