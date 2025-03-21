export interface AccountStats {
  deviceTotalNo: number;
  deviceNo: number;
  onlineDeviceNo: number;
  offlineDeviceNo: number;
  unUsedDeviceNo: number;
  accountId: number;
  success: boolean;
}

export interface SubAccount {
  accountId: number;
  userName: string;
  type: number;
  parentId: number;
  accountStatsBean: AccountStats;
  isLeaf: number;
  success: boolean;
}

export interface WWTAccount {
  accountId: number;
  accountName: string;
  userName: string;
  type: number;
  email?: string;
  parentId: number;
  rootId: number;
  createTime: number;
  contactUser: string;
  contactTel: string;
  address: string;
  isReceiveOfflineMessage: number;
  isReceiveWaring: number;
  accountStatsBean: AccountStats;
  isLeaf: number;
  subAccountBeanList?: SubAccount[];
}

export type WWTClient = Omit<WWTAccount, "subAccountBeanList"> & {
  subAccountBeanList: WWTClient[];
};
