import {
  getGuestHouseByIdData
} from "@/lib/strapi-data";
import { notFound } from "next/navigation";
import GuestHouseForm from "../../form";

interface EditGuestHousePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGuestHousePage({
  params,
}: EditGuestHousePageProps) {
  const { id } = await params;
  const guestHouse = await getGuestHouseByIdData(id);

  if (!guestHouse) {
    notFound();
  }

  return <GuestHouseForm initialData={guestHouse} />;
}
