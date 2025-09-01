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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Car } from "@/lib/types";
import { useRouter } from "next/navigation";
import { getCarByIdData } from "@/lib/strapi-data";
// import { getCar } from "../actions";

interface CarFormProps {
  initialData?: Car;
}

export default function CarForm({ initialData }: CarFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [transmission, setTransmission] = useState<string>("Manual");

  useEffect(() => {
    if (!isEditing || !initialData) return;
    setCar(initialData);
    setTransmission(initialData.transmission || "Manual");
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

  useEffect(() => {
    const documentId = (initialData as any)?.documentId;
    if (!isEditing || !documentId) return;

    let cancelled = false;
    (async () => {
      try {
        const car = await getCarByIdData(documentId);

        if (!car) return;
        if (cancelled) return;

        const fromServer = Array.isArray(car.images)
          ? car.images.map((img: any) => {
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
      carId: (car as Car)?.carId,
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      seats: Number(
        (form.elements.namedItem("seats") as HTMLInputElement)?.value
      ),
      transmission,
      price: Number(
        (form.elements.namedItem("price") as HTMLInputElement)?.value
      ),
      // Send Markdown string directly
      description:
        (form.elements.namedItem("description") as HTMLTextAreaElement)
          ?.value || "",
      images: media
        .filter((m) => typeof m.id === "number")
        .map((m) => m.id) as number[],
    };

    try {
      const documentId = (initialData as any)?.documentId;
      const response = await getCarByIdData(documentId);
      console.log("response", response);
      const res = await fetch(
        documentId ? `/api/admin/cars/${documentId}` : `/api/admin/cars`,
        {
          method: documentId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Save failed");
      setMessage("Saved successfully.");
      setTimeout(() => {
        router.push("/admin/cars");
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
        <CardTitle>{isEditing ? "Edit Car" : "Add New Car"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Edit your car rental listing."
            : "Add a new car rental listing."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={car?.title} required />
          </div>

          <MediaInput
            label="Car Images"
            description="Upload images. These are saved in Strapi and linked by media IDs."
            initialMedia={media}
            onChange={setMedia}
            maxFiles={12}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="seats">Seats</Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                step="1"
                min="1"
                defaultValue={car?.seats}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger id="transmission" aria-label="Transmission">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="transmission" value={transmission} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price per Day</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={car?.price}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={"Write the car details..."}
              defaultValue={car?.description as any}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Car" : "Create Car"}
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
