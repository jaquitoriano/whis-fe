import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (process.env.WHIS_API_URL ?? "https://whis-user-mgmt-api.vercel.app").replace(/\/$/, "");
const API_TIMEOUT_MS = Number(process.env.WHIS_API_TIMEOUT_MS ?? "10000");

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const url = new URL(request.url);
  const upstreamUrl = `${API_BASE_URL}/api/${path.join("/")}${url.search}`;

  const headers = new Headers();
  headers.set("accept", "application/json");
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  if (request.headers.get("content-type")) {
    headers.set("content-type", request.headers.get("content-type")!);
  }

  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  const body = await response.text();
  const nextResponse = new NextResponse(body || null, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });

  const setCookie = response.headers.getSetCookie?.();
  if (setCookie?.length) {
    for (const cookieHeader of setCookie) nextResponse.headers.append("set-cookie", cookieHeader);
  }

  return nextResponse;
}

export function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}
