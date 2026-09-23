import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        treatments: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json({ data: patients }, { status: 200 });
  } catch (error) {
    console.error("GET patients error:", error);

    return Response.json(
      { message: "Failed to fetch patients" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const patient = await prisma.patient.create({
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
        payments: true,
      },
    });

    return Response.json({ data: patient }, { status: 201 });
  } catch (error) {
    console.error("POST patient error:", error);

    return Response.json(
      {
        message: "Failed to create patient",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
