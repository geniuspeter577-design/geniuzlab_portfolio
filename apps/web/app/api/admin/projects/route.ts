import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminProjectSchema, createProject, listProjectsForAdmin } from "@/lib/admin-projects";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await listProjectsForAdmin();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = adminProjectSchema.parse(body);
    const project = await createProject(result);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid project payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
