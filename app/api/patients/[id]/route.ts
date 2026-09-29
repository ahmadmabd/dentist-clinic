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

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
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

    const patientId = Number(id);

    if (isNaN(patientId)) {
      return Response.json({ message: "Invalid patient ID" }, { status: 400 });
    }

    const body = await request.json();

    const existingPatient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        treatments: true,
      },
    });

    if (!existingPatient) {
      return Response.json({ message: "Patient not found" }, { status: 404 });
    }

    const incomingTreatments = body.treatments || [];

    const existingTreatmentIds = existingPatient.treatments.map(
      (treatment) => treatment.id,
    );

    const incomingTreatmentIds = incomingTreatments
      .filter((treatment: { id?: number }) => treatment.id)
      .map((treatment: { id: number }) => Number(treatment.id));

    const treatmentsToDelete = existingTreatmentIds.filter(
      (existingId) => !incomingTreatmentIds.includes(existingId),
    );

    await prisma.$transaction(async (tx) => {
      /*
       * Update patient information
       */
      await tx.patient.update({
        where: {
          id: patientId,
        },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          totalPrice: Number(body.totalPrice),
          address: body.address,
        },
      });

      /*
       * Delete treatments that were removed
       */
      if (treatmentsToDelete.length > 0) {
        await tx.treatment.deleteMany({
          where: {
            id: {
              in: treatmentsToDelete,
            },
            patientId,
          },
        });
      }

      /*
       * Update existing treatments
       * Their createdAt stays unchanged.
       */
      for (const treatment of incomingTreatments) {
        if (treatment.id) {
          await tx.treatment.update({
            where: {
              id: Number(treatment.id),
            },
            data: {
              name: treatment.name,
              before: treatment.before,
              after: treatment.after,
            },
          });
        } else {
          /*
           * New treatment
           * createdAt is automatically set by Prisma.
           */
          await tx.treatment.create({
            data: {
              name: treatment.name,
              before: treatment.before,
              after: treatment.after,
              patientId,
            },
          });
        }
      }
    });

    /*
     * Get the updated patient with treatments and payments
     */
    const updatedPatient = await prisma.patient.findUnique({
      where: {
        id: patientId,
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

    const patientId = Number(id);

    if (isNaN(patientId)) {
      return Response.json({ message: "Invalid patient ID" }, { status: 400 });
    }

    await prisma.patient.delete({
      where: {
        id: patientId,
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
