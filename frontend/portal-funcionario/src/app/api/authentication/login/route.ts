import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8080/authentication/login";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const backendResponse = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("Content-Type") ?? "application/json",
    },
    body,
  });

  const responseBody = await backendResponse.text();
  const status = backendResponse.status;

  const nextResponse = new NextResponse(responseBody, {
    status,
    headers: { "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json" },
  });

  // Re-issue every Set-Cookie the backend sent, but with path=/
  backendResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      const fixed = value.replace(/;\s*path=[^;]*/i, "; Path=/");
      // If the backend didn't include a Path attribute at all, append one
      const withPath = /path=/i.test(value) ? fixed : `${value}; Path=/`;
      nextResponse.headers.append("Set-Cookie", withPath);
    }
  });

  return nextResponse;
}
