interface WWTDeviceType {
  deviceTypeId: number;
  typeName: string;
  parameter: number;
  wireless: boolean;
  success: boolean;
}

interface AccountStats {
  deviceTotalNo: number;
  deviceNo: number;
  onlineDeviceNo: number;
  offlineDeviceNo: number;
  unUsedDeviceNo: number;
  success: boolean;
}

interface WWTOwner {
  accountId: number;
  accountName: string;
  userName: string;
  type: number;
  parentId: number;
  rootId: number;
  createTime: number;
  contactUser: string;
  contactTel: string;
  address: string;
  isReceiveOfflineMessage: number;
  isReceiveWaring: number;
  accountStatsBean: AccountStats;
  roles: number;
  accountType: number;
  success: boolean;
}

export interface WWTDevice {
  imei: string;
  name: string;
  deviceTypeBean: WWTDeviceType;
  isWireless: number;
  ownerBean: WWTOwner;
  ownerId: number;
  importTime: number;
  activateTime: number;
  endTime: number;
  platformEndtime: number;
  saleTime: number;
  useStatus: number;
  isNeedPay: number;
  importOwner: WWTOwner;
  importOwnerId: number;
  success: boolean;
}
