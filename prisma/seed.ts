import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting seed...");

  // Delete treatments first
  await prisma.treatment.deleteMany();

  // Then delete patients
  await prisma.patient.deleteMany();

  // Create patients with their treatments
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        firstName: "Ahmad",
        lastName: "Abdallah",
        phone: "03123456",
        totalPrice: 500,
        address: "Tripoli",

        treatments: {
          create: [
            {
              name: "Cleaning",
              before: "Plaque and tartar buildup",
              after: "Teeth cleaned and polished",
            },
          ],
        },

        payments: {
          create: [
            {
              amount: 100,
            },
            {
              amount: 150,
            },
            {
              amount: 50,
            },
          ],
        },
      },

      include: {
        treatments: true,
        payments: true,
      },
    }),

    prisma.patient.create({
      data: {
        firstName: "Ali",
        lastName: "Hassan",
        phone: "71123456",
        totalPrice: 400,
        address: "Akkar",

        treatments: {
          create: [
            {
              name: "Filling",
              before: "Cavity on the upper molar",
              after: "Cavity removed and tooth filled",
            },
          ],
        },
        payments: {
          create: [
            {
              amount: 100,
            },
            {
              amount: 150,
            },
            {
              amount: 50,
            },
          ],
        },
      },

      include: {
        treatments: true,
        payments: true,
      },
    }),
  ]);
  console.log(`✅ Created ${patients.length} patients`);

  const treatmentCount = patients.reduce(
    (total, patient) => total + patient.treatments.length,
    0,
  );

  console.log(`🦷 Created ${treatmentCount} treatments`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
