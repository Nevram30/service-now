import { PrismaClient, UserRole, ServiceCategory } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: "admin@servicenow.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@servicenow.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created ADMIN: ${admin.email}`);

  // Create PROVIDER users
  const providers = [
    {
      name: "Juan Dela Cruz",
      email: "juan.provider@servicenow.com",
      paymentQrCode: "https://example.com/qr/juan",
      paymentNotes: "GCash: 09171234567",
    },
    {
      name: "Maria Santos",
      email: "maria.provider@servicenow.com",
      paymentQrCode: "https://example.com/qr/maria",
      paymentNotes: "Maya: 09181234567",
    },
    {
      name: "Pedro Reyes",
      email: "pedro.provider@servicenow.com",
      paymentQrCode: "https://example.com/qr/pedro",
      paymentNotes: "BPI: 1234567890",
    },
  ];

  const createdProviders = [];
  for (const provider of providers) {
    const created = await prisma.user.upsert({
      where: { email: provider.email },
      update: {},
      create: {
        ...provider,
        password: hashedPassword,
        role: UserRole.PROVIDER,
        emailVerified: new Date(),
      },
    });
    createdProviders.push(created);
    console.log(`✅ Created PROVIDER: ${created.email}`);
  }

  // Create CUSTOMER users
  const customers = [
    {
      name: "Anna Garcia",
      email: "anna.customer@servicenow.com",
    },
    {
      name: "Carlos Mendoza",
      email: "carlos.customer@servicenow.com",
    },
    {
      name: "Diana Lopez",
      email: "diana.customer@servicenow.com",
    },
  ];

  const createdCustomers = [];
  for (const customer of customers) {
    const created = await prisma.user.upsert({
      where: { email: customer.email },
      update: {},
      create: {
        ...customer,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        emailVerified: new Date(),
      },
    });
    createdCustomers.push(created);
    console.log(`✅ Created CUSTOMER: ${created.email}`);
  }

  // Create sample services for providers
  const services = [
    {
      title: "Lawn Mowing Service",
      description: "Professional lawn mowing for residential properties. Includes edging and cleanup.",
      category: ServiceCategory.GRASS_CUTTING,
      basePrice: 500,
      durationMinutes: 60,
      providerId: createdProviders[0]!.id,
    },
    {
      title: "Garden Maintenance",
      description: "Complete garden care including grass cutting, trimming, and weeding.",
      category: ServiceCategory.GRASS_CUTTING,
      basePrice: 800,
      durationMinutes: 120,
      providerId: createdProviders[0]!.id,
    },
    {
      title: "Aircon Cleaning & Repair",
      description: "Full aircon service including cleaning, gas refill, and minor repairs.",
      category: ServiceCategory.AIRCON_REPAIR,
      basePrice: 1500,
      durationMinutes: 90,
      providerId: createdProviders[1]!.id,
    },
    {
      title: "Split-Type AC Installation",
      description: "Professional installation of split-type air conditioning units.",
      category: ServiceCategory.AIRCON_REPAIR,
      basePrice: 3000,
      durationMinutes: 180,
      providerId: createdProviders[1]!.id,
    },
    {
      title: "Deep House Cleaning",
      description: "Thorough cleaning of your entire home including floors, windows, and bathrooms.",
      category: ServiceCategory.CLEANING,
      basePrice: 2000,
      durationMinutes: 240,
      providerId: createdProviders[2]!.id,
    },
    {
      title: "Office Cleaning Service",
      description: "Professional cleaning service for offices and commercial spaces.",
      category: ServiceCategory.CLEANING,
      basePrice: 2500,
      durationMinutes: 180,
      providerId: createdProviders[2]!.id,
    },
    {
      title: "Men's Haircut",
      description: "Classic men's haircut with styling. Includes hair wash.",
      category: ServiceCategory.HAIRCUT,
      basePrice: 200,
      durationMinutes: 30,
      providerId: createdProviders[0]!.id,
    },
    {
      title: "Women's Haircut & Styling",
      description: "Professional haircut and blow dry styling for women.",
      category: ServiceCategory.HAIRCUT,
      basePrice: 500,
      durationMinutes: 60,
      providerId: createdProviders[1]!.id,
    },
  ];

  for (const service of services) {
    const created = await prisma.service.create({
      data: service,
    });
    console.log(`✅ Created SERVICE: ${created.title}`);
  }

  // Verify password can be matched (demonstration of bcrypt.compare)
  const plainPassword = "password123";
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Login credentials for all seeded users:");
  // console.log(`   Password: ${plainPassword}`);
  // console.log(`   Hashed:   ${hashedPassword}`);
  console.log(`   Verified: ${isMatch ? "✅ Password matches hash" : "❌ Password mismatch"}`);
  console.log("\n   ADMIN:");
  console.log("   - admin@servicenow.com");
  console.log("\n   PROVIDERS:");
  providers.forEach((p) => console.log(`   - ${p.email}`));
  console.log("\n   CUSTOMERS:");
  customers.forEach((c) => console.log(`   - ${c.email}`));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
