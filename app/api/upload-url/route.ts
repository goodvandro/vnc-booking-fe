// app/api/upload-url/route.ts
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

function getStrapiUrl() {
  const base = STRAPI_URL || "http://localhost:1337";
  return base.replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    if (!STRAPI_ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Missing STRAPI_ADMIN_TOKEN" },
        { status: 500 }
      );
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validar se é uma URL válida
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fazer download da imagem
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from URL" },
        { status: 400 }
      );
    }

    // Verificar se é uma imagem
    const contentType = imageResponse.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      return NextResponse.json(
        { error: "URL does not point to an image" },
        { status: 400 }
      );
    }

    // Obter o nome do arquivo da URL ou gerar um nome padrão
    const urlParts = url.split("/");
    const fileName =
      urlParts[urlParts.length - 1].split("?")[0] || `image-${Date.now()}.jpg`;

    // Converter para blob
    const imageBlob = await imageResponse.blob();

    // Criar FormData para enviar ao Strapi
    const form = new FormData();
    form.append("files", imageBlob, fileName);

    // Enviar para o Strapi
    const res = await fetch(`${getStrapiUrl()}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
      },
      body: form,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Strapi upload failed: ${res.status} ${res.statusText}`,
          details: data,
        },
        { status: res.status }
      );
    }

    // Normalizar resposta
    const arr = Array.isArray(data) ? data : [data];
    const files = arr.map((f: any) => ({
      id: f.id,
      url:
        typeof f.url === "string"
          ? f.url.startsWith("http")
            ? f.url
            : `${getStrapiUrl()}${f.url}`
          : "",
      name: f.name,
      size: f.size,
      width: f.width,
      height: f.height,
      mime: f.mime,
      hash: f.hash,
      ext: f.ext,
    }));

    return NextResponse.json({ files });
  } catch (err: any) {
    console.error("Upload URL error:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
