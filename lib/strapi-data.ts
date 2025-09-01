import { strapiAPI } from "./strapi-api";
import type {
  GuestHouse,
  Car,
  Booking,
  BookingStatus,
  CarOutputDTO,
  DocumentImage,
  GuestHouseOutputDTO,
  GuestHouseBooking,
  CarRentalBooking,
} from "./types";

// Flatten a Strapi v4 entity to a plain object with id, documentId, and attributes
function flattenEntity<T extends Record<string, any>>(
  item: any
): T & { id: string; documentId: number } {
  // Prefer human UID if present (e.g., carId, guestHouseId, bookingId), else fallback to numeric id
  const attrs = item || {};
  const uid = attrs.carId || attrs.guestHouseId || attrs.bookingId;
  return {
    id: String(uid || item.id),
    ...attrs,
  } as any;
}

// Convert Strapi media field to array of full URLs
function getImageUrls(media: DocumentImage[]): DocumentImage[] {
  const base = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  ).replace(/\/$/, "");

  return media?.map((img) => ({
    ...img,
    url: `${base}${img.url}` || "/placeholder.svg?height=300&width=400",
  }));
}

// --------------------
// Guest Houses
// --------------------
export async function getGuestHousesData(): Promise<GuestHouseOutputDTO[]> {
  try {
    const res = await strapiAPI.getGuestHouses();
    const list = (res?.data || []).map((item: any) => {
      const flat = flattenEntity<GuestHouseOutputDTO>(item);
      return {
        ...flat,
        images: getImageUrls(flat.images),
      } as any;
    });
    return list;
  } catch (e) {
    console.error("Failed to fetch guest houses:", e);
    return [];
  }
}

export async function getGuestHouseByIdData(
  id: string
): Promise<GuestHouse | undefined> {
  try {
    const res = await strapiAPI.getGuestHouse(id);
    if (!res?.data) return undefined;
    const flat = flattenEntity<GuestHouse>(res.data);
    return {
      ...flat,
      images: getImageUrls((flat as any).images),
    } as any;
  } catch (e) {
    console.error("Failed to fetch guest house:", e);
    return undefined;
  }
}

export async function createGuestHouseData(
  newGh: Omit<GuestHouse, "id">
): Promise<GuestHouse> {
  const payload: any = {
    guestHouseId: (newGh as any).guestHouseId || `gh-${Date.now()}`,
    title: newGh.title,
    location: (newGh as any).location,
    rating: (newGh as any).rating,
    price: newGh.price as any,
    description: newGh.description,
    // If you're saving media by IDs, send images: [id, id]
  };
  const res = await strapiAPI.createGuestHouse(payload);
  const flat = flattenEntity<GuestHouse>(res?.data);
  return {
    ...flat,
    // images: newGh.images || getImageUrls(flat.images)
  };
}

export async function updateGuestHouseData(
  id: string,
  updatedGh: Partial<GuestHouse>
): Promise<GuestHouse | null> {
  // const payload: any = {
  //   title: updatedGh.title,
  //   location: (updatedGh as any)?.location,
  //   rating: (updatedGh as any)?.rating,
  //   price: updatedGh.price,
  //   description: updatedGh.description,
  // };
  // if (
  //   (updatedGh as any)?.images &&
  //   Array.isArray((updatedGh as any).imagesIds)
  // ) {
  //   payload.images = (updatedGh as any).imagesIds;
  // }
  try {
    const res = await strapiAPI.updateGuestHouse(id, updatedGh);
    // const flat = flattenEntity<GuestHouse>(res?.data);
    return res.data;
  } catch (e) {
    console.error("Failed to update guest house:", e);
    return null;
  }
}

export async function deleteGuestHouseData(id: string): Promise<boolean> {
  try {
    await strapiAPI.deleteGuestHouse(id);
    return true;
  } catch (e) {
    console.error("Failed to delete guest house:", e);
    return false;
  }
}

// --------------------
// Cars
// --------------------
export async function getCarsData(): Promise<CarOutputDTO[]> {
  try {
    const res = await strapiAPI.getCars();

    const list = (res?.data || []).map((item: any) => {
      const flat = flattenEntity<CarOutputDTO>(item);
      // Ensure both id (UID or numeric) and documentId (numeric) exist for linking/editing
      const result: any = {
        ...flat,
        images: getImageUrls(flat.images),
      };
      // Keep carId if present
      if ((flat as any).carId) result.carId = (flat as any).carId;
      return result;
    });
    return list;
  } catch (e) {
    console.error("Failed to fetch cars:", e);
    return [];
  }
}

export async function getCarByIdData(id: string): Promise<Car | undefined> {
  try {
    const res = await strapiAPI.getCar(id);
    if (!res?.data) return undefined;
    const flat = flattenEntity<Car>(res.data);
    return {
      ...flat,
      images: getImageUrls((flat as any).images),
    } as any;
  } catch (e) {
    console.error("Failed to fetch car:", e);
    return undefined;
  }
}

export async function createCarData(newCar: Omit<Car, "id">): Promise<Car> {
  console.log("newCar", newCar);
  const payload: any = {
    carId: (newCar as any).carId || `car-${Date.now()}`,
    title: newCar.title,
    seats: (newCar as any).seats,
    transmission: (newCar as any).transmission,
    price: newCar.price as any,
    description: newCar.description,
    // If you have uploaded media IDs: images: [id, id]
  };
  const res = await strapiAPI.createCar(payload);
  const flat = flattenEntity<Car>(res?.data);
  return {
    ...flat,
    images: newCar.images || getImageUrls((flat as any).images),
    documentId: Number(res.data.id),
  } as any;
}

export async function updateCarData(
  id: string,
  updatedCar: Partial<Car>
): Promise<Car | null> {
  const payload: any = {
    title: updatedCar.title,
    seats: (updatedCar as any)?.seats,
    transmission: (updatedCar as any)?.transmission,
    price: updatedCar.price,
    description: updatedCar.description,
  };
  if (
    (updatedCar as any)?.imagesIds &&
    Array.isArray((updatedCar as any).imagesIds)
  ) {
    payload.images = (updatedCar as any).imagesIds;
  }
  try {
    const res = await strapiAPI.updateCar(id, payload);
    const flat = flattenEntity<Car>(res?.data);
    return {
      ...flat,
      images: updatedCar.images || getImageUrls((flat as any).images),
      documentId: Number(res.data.id),
    } as any;
  } catch (e) {
    console.error("Failed to update car:", e);
    return null;
  }
}

export async function deleteCarData(id: string): Promise<boolean> {
  try {
    await strapiAPI.deleteCar(id);
    return true;
  } catch (e) {
    console.error("Failed to delete car:", e);
    return false;
  }
}

// --------------------
// Guest House Bookings
// --------------------
export async function getGuestHouseBookingsData(): Promise<
  GuestHouseBooking[]
> {
  try {
    const res = await strapiAPI.getGuestHouseBookings();
    const list = (res?.data || []).map((item: any) => {
      const flat = flattenEntity<Booking>(item);
      return flat;
    });
    return list;
  } catch (e) {
    console.error("Failed to fetch guest house bookings:", e);
    return [];
  }
}

export async function getGuestHouseBookingByIdData(
  id: string
): Promise<GuestHouseBooking | undefined> {
  try {
    const res = await strapiAPI.getGuestHouseBooking(id);
    if (!res?.data) return undefined;
    const flat = flattenEntity<GuestHouseBooking>(res.data);
    return flat;
  } catch (e) {
    console.error("Failed to fetch guest house booking:", e);
    return undefined;
  }
}

export async function updateGuestHouseBookingData(
  id: string,
  updatedBooking: Partial<Booking>
): Promise<Booking | null> {
  try {
    const res = await strapiAPI.updateGuestHouseBooking(id, updatedBooking);
    const flat = flattenEntity<Booking>(res?.data);
    return flat;
  } catch (e) {
    console.error("Failed to update guest house booking:", e);
    return null;
  }
}

export async function updateGuestHouseBookingStatus(
  id: string,
  status: string
): Promise<Booking | null> {
  try {
    const res = await strapiAPI.updateGuestHouseBookingStatus(id, status);
    const flat = flattenEntity<Booking>(res?.data);
    return flat;
  } catch (e) {
    console.error("Failed to update guest house booking status:", e);
    return null;
  }
}

// --------------------
// Car Rental Bookings
// --------------------
export async function getCarRentalBookingsData(): Promise<CarRentalBooking[]> {
  try {
    const res = await strapiAPI.getCarRentalBookings();
    const list = (res?.data || []).map((item: any) => {
      const flat = flattenEntity<CarRentalBooking>(item);
      return flat;
    });
    return list;
  } catch (e) {
    console.error("Failed to fetch car rental bookings:", e);
    return [];
  }
}

export async function getCarRentalBookingByIdData(
  id: string
): Promise<CarRentalBooking | undefined> {
  try {
    const res = await strapiAPI.getCarRentalBooking(id);
    if (!res?.data) return undefined;
    const flat = flattenEntity<CarRentalBooking>(res.data);
    return flat;
  } catch (e) {
    console.error("Failed to fetch car rental booking:", e);
    return undefined;
  }
}

export async function updateCarRentalBookingData(
  id: string,
  updatedBooking: Partial<Booking>
): Promise<Booking | null> {
  try {
    const res = await strapiAPI.updateCarRentalBooking(id, updatedBooking);
    const flat = flattenEntity<Booking>(res?.data);
    return flat;
  } catch (e) {
    console.error("Failed to update car rental booking:", e);
    return null;
  }
}

export async function updateCarRentalBookingStatus(
  id: string,
  status: string
): Promise<Booking | null> {
  try {
    const res = await strapiAPI.updateCarRentalBookingStatus(id, status);
    const flat = flattenEntity<Booking>(res?.data);
    return flat;
  } catch (e) {
    console.error("Failed to update car rental booking status:", e);
    return null;
  }
}

// Basic stats
export async function getDashboardStatsData() {
  const list = await getGuestHouseBookingsData();
  const total = list.length;
  return {
    totalGuestHouses: 0,
    totalCars: 0,
    totalBookings: total,
    pendingBookings: list.filter((b) => b.bookingStatus === "pending").length,
    confirmedBookings: list.filter((b) => b.bookingStatus === "confirmed")
      .length,
  };
}
