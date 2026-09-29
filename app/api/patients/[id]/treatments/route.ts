import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const patientId = Number(id);

    if (isNaN(patientId)) {
      return Response.json({ message: "Invalid patient ID" }, { status: 400 });
    }

    const treatments = await prisma.treatment.findMany({
      where: {
        patientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ data: treatments }, { status: 200 });
  } catch (error) {
    console.error("GET treatments error:", error);

    return Response.json(
      { message: "Failed to fetch treatments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const patientId = Number(id);

    if (isNaN(patientId)) {
      return Response.json({ message: "Invalid patient ID" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return Response.json({ message: "Patient not found" }, { status: 404 });
    }

    const body = await request.json();

    const treatment = await prisma.treatment.create({
      data: {
        name: body.name,
        before: body.before,
        after: body.after,
        patientId,
      },
    });

    return Response.json(
      {
        data: treatment,
        message: "Treatment added successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST treatment error:", error);

    return Response.json(
      {
        message: "Failed to add treatment",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
