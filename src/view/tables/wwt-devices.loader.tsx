import { IDeviceSearchParams } from "../params/device-search.params";
import { findManyDevices } from "@/@shared/actions/wwt-device.actions";
import { WWTDevicesTable } from "./wwt-devices.table";

interface WWTDevicesTableProps {
  params?: Partial<IDeviceSearchParams> & {
    page?: number | null;
  };
}

export async function WWTDevicesTableLoader({ params }: WWTDevicesTableProps) {
  const { data, count } = await findManyDevices({
    page: params?.page,
    pageSize: 10,
    where: {
      imei: params?.imei as string,
      ownerId: params?.ownerId as number,
    },
  });

  return <WWTDevicesTable data={data} pagination={{ count, pageSize: 10 }} />;
}
