import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const patientId = Number(id);
    const body = await request.json();

    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return Response.json(
        { message: "Invalid payment amount" },
        { status: 400 },
      );
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        payments: true,
      },
    });

    if (!patient) {
      return Response.json({ message: "Patient not found" }, { status: 404 });
    }

    const paid = patient.payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0,
    );

    const remaining = Number(patient.totalPrice) - paid;

    if (amount > remaining) {
      return Response.json(
        {
          message: `Payment cannot be greater than remaining amount (${remaining})`,
        },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        patientId,
      },
    });

    return Response.json({ data: payment }, { status: 201 });
  } catch (error) {
    console.error("POST payment error:", error);

    return Response.json(
      {
        message: "Failed to add payment",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
