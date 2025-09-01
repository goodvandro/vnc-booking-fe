"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MediaInput, {
  type UploadedMedia,
} from "@/components/common/media-input";
import type { GuestHouse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { getGuestHouseByIdData, getGuestHousesData, updateGuestHouseData } from "@/lib/strapi-data";
// import { createGuestHouse, getGuestHouse, updateGuestHouse } from "../actions";

interface GuestHouseFormProps {
  initialData?: GuestHouse;
}

export default function GuestHouseForm({ initialData }: GuestHouseFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [guestHouse, setGuestHouse] = useState<GuestHouse | null>(null);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing || !initialData) return;
    setGuestHouse(initialData);
    const nextMedia: UploadedMedia[] = Array.isArray(initialData.images)
      ? initialData.images.map((image) => {
          return {
            id: image.id,
            url: image.url,
            name: image.name,
            width: image.width,
            height: image.height,
            mime: image.mime,
          };
        })
      : [];
    setMedia(nextMedia);
  }, [isEditing, initialData]);

  // Hydrate existing media and description for editing
  useEffect(() => {
    const documentId = (initialData as any)?.documentId;
    if (!isEditing || !documentId) return;

    let cancelled = false;
    (async () => {
      try {
        const guestHouse = await getGuestHouseByIdData(documentId);

        if (!guestHouse) return;
        if (cancelled) return;

        const fromServer = Array.isArray(guestHouse.images)
          ? guestHouse.images.map((img: any) => {
              // Check if img is already a string URL or an object
              if (typeof img === "string") {
                return { url: img };
              }
              // Handle case where img is a full media object
              return {
                id: img.id,
                url: img.url,
                name: img.name,
                width: img.width,
                height: img.height,
                mime: img.mime,
              };
            })
          : [];

        if (fromServer.length > 0) {
          setMedia(fromServer);
        }
      } catch {
        // ignore; keep any existing media
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEditing, initialData]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = e.currentTarget;
    const payload = {
      guestHouseId: (initialData as GuestHouse)?.guestHouseId,
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      location: (form.elements.namedItem("location") as HTMLInputElement)
        ?.value,
      rating: Number(
        (form.elements.namedItem("rating") as HTMLInputElement)?.value
      ),
      price: Number(
        (form.elements.namedItem("price") as HTMLInputElement)?.value
      ),
      description:
        (form.elements.namedItem("description") as HTMLTextAreaElement)
          ?.value || "",
      images: media
        .filter((m) => typeof m.id === "number")
        .map((m) => m.id) as number[],
    };

    console.log("payload", payload);

    try {
      const documentId = (initialData as any)?.documentId;

      // (await documentId)
      //   ? updateGuestHouseData(documentId, payload)
      //   : createGuestHouseData(payload);

      setMessage("Saved successfully.");
      setTimeout(() => {
        router.push("/admin/guest-houses");
      }, 600);
    } catch (err: any) {
      setMessage(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Guest House" : "Add New Guest House"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Edit your guest house listing."
            : "Add a new guest house listing."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={guestHouse?.title}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={guestHouse?.location}
              required
            />
          </div>

          <MediaInput
            label="Guest House Images"
            description="Upload images. These are saved in Strapi and linked by media IDs."
            initialMedia={media}
            onChange={setMedia}
            maxFiles={16}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price per Night</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={guestHouse?.price}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue={guestHouse?.rating}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={"Write the guest house details..."}
              defaultValue={guestHouse?.description as any}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Guest House"
              : "Create Guest House"}
          </Button>
          {message && (
            <p
              className={`text-sm ${
                /successfully/i.test(message)
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
