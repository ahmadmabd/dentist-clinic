import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      paymentId: string;
    }>;
  },
) {
  try {
    const { id, paymentId } = await params;

    const patientId = Number(id);
    const paymentIdNumber = Number(paymentId);

    if (isNaN(patientId) || isNaN(paymentIdNumber)) {
      return Response.json(
        { message: "Invalid patient or payment ID" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentIdNumber,
        patientId: patientId,
      },
    });

    if (!payment) {
      return Response.json(
        { message: "Payment not found for this patient" },
        { status: 404 },
      );
    }

    await prisma.payment.delete({
      where: {
        id: paymentIdNumber,
      },
    });

    return Response.json(
      {
        message: "Payment deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting payment:", error);

    return Response.json(
      {
        message: "Failed to delete payment",
      },
      { status: 500 },
    );
  }
}
