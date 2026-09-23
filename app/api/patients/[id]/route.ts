import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const patient = await prisma.patient.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        treatments: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!patient) {
      return Response.json({ message: "Patient not found" }, { status: 404 });
    }

    return Response.json({ data: patient }, { status: 200 });
  } catch (error) {
    console.error("GET patient error:", error);

    return Response.json(
      { message: "Failed to fetch patient" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const patientId = Number(id);

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return Response.json({ message: "Patient not found" }, { status: 404 });
    }

    // Delete old treatments
    await prisma.treatment.deleteMany({
      where: {
        patientId,
      },
    });

    // Update patient and create new treatments
    const updatedPatient = await prisma.patient.update({
      where: {
        id: patientId,
      },

      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        totalPrice: Number(body.totalPrice),
        address: body.address,

        treatments: {
          create: (body.treatments || []).map(
            (treatment: { name: string; before: string; after: string }) => ({
              name: treatment.name,
              before: treatment.before,
              after: treatment.after,
            }),
          ),
        },
      },

      include: {
        treatments: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return Response.json({ data: updatedPatient }, { status: 200 });
  } catch (error) {
    console.error("PATCH patient error:", error);

    return Response.json(
      {
        message: "Failed to update patient",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.patient.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE patient error:", error);

    return Response.json(
      { message: "Failed to delete patient" },
      { status: 500 },
    );
  }
}
