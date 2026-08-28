import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminProjectSchema, deleteProject, getProjectForAdmin, updateProject } from "@/lib/admin-projects";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectForAdmin(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const result = adminProjectSchema.parse(body);
    const project = await updateProject(id, result);

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid project payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteProject(id);

  return NextResponse.json({ success: true }, { status: 200 });
}
