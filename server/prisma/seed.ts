import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";

import bcrypt from "bcrypt";
import { BookingStatus, Role, RoomStatus, RoomType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function findEnvPath() {
  const candidates: string[] = [];

  // Common cases
  candidates.push(path.resolve(process.cwd(), ".env"));
  candidates.push(path.resolve(process.cwd(), "../.env"));

  // Try to locate relative to the executed script path
  const argScript = process.argv.find(
    (a) => a.endsWith(`${path.sep}seed.ts`) || a.endsWith(`${path.sep}seed.js`),
  );
  const scriptPath = argScript || process.argv[1];
  if (scriptPath) {
    const scriptDir = path.dirname(scriptPath);
    candidates.unshift(path.resolve(scriptDir, ".env"));
    candidates.unshift(path.resolve(scriptDir, "../.env"));
  }

  return candidates.find((p) => fs.existsSync(p));
}

const envPath = findEnvPath();
dotenv.config(envPath ? { path: envPath } : undefined);

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
const SEED_ADMIN_NAME = process.env.SEED_ADMIN_NAME || "System Admin";

const SEED_MANAGER_EMAIL =
  process.env.SEED_MANAGER_EMAIL || "manager@example.com";
const SEED_MANAGER_NAME = process.env.SEED_MANAGER_NAME || "Default Manager";
const SEED_TEST_USER_EMAIL =
  process.env.SEED_TEST_USER_EMAIL || "payment.tester@example.com";
const SEED_TEST_USER_PASSWORD =
  process.env.SEED_TEST_USER_PASSWORD || "User@123";
const SEED_TEST_USER_NAME = process.env.SEED_TEST_USER_NAME || "Payment Tester";

type CreatedIds = {
  managerId: string;
  buildingId: string;
  testUserId: string;
  testBookingRequestId: string;
  roomIdsByCode: Record<string, string>;
  serviceCategoryIdsByName: Record<string, string>;
  amenityIdsByName: Record<string, string>;
};

async function ensureAdminUser() {
  const existing = await prisma.user.findUnique({
    where: { email: SEED_ADMIN_EMAIL },
    select: { id: true },
  });
  if (existing) return;

  const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      name: SEED_ADMIN_NAME,
      email: SEED_ADMIN_EMAIL,
      role: Role.ADMIN,
      password: passwordHash,
    },
  });
}

async function ensureManager() {
  const existing = await prisma.manager.findUnique({
    where: { email: SEED_MANAGER_EMAIL },
    select: { id: true },
  });
  if (existing) return existing.id;

  const manager = await prisma.manager.create({
    data: {
      name: SEED_MANAGER_NAME,
      email: SEED_MANAGER_EMAIL,
      role: Role.MANAGER,
    },
    select: { id: true },
  });

  return manager.id;
}

async function ensureTestUser() {
  const existing = await prisma.user.findUnique({
    where: { email: SEED_TEST_USER_EMAIL },
    select: { id: true },
  });
  if (existing) return existing.id;

  const passwordHash = await bcrypt.hash(SEED_TEST_USER_PASSWORD, 10);
  const user = await prisma.user.create({
    data: {
      name: SEED_TEST_USER_NAME,
      email: SEED_TEST_USER_EMAIL,
      role: Role.USER,
      password: passwordHash,
    },
    select: { id: true },
  });

  return user.id;
}

async function ensureAmenities(): Promise<Record<string, string>> {
  const names = [
    "WiFi",
    "Projector",
    "Whiteboard",
    "Air Conditioner",
    "Parking",
    "Coffee/Tea",
  ];

  await prisma.amenity.createMany({
    data: names.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const amenities = await prisma.amenity.findMany({
    where: { name: { in: names } },
    select: { id: true, name: true },
  });

  return Object.fromEntries(amenities.map((a) => [a.name, a.id]));
}

async function ensureBuilding(managerId: string) {
  const buildingName = "Main Building";
  const campus = "HQ";
  const address = "1 Example Street";

  const existing = await prisma.building.findFirst({
    where: {
      buildingName,
      campus,
      address,
      managerId,
    },
    select: { id: true },
  });

  if (existing) return existing.id;

  const building = await prisma.building.create({
    data: {
      buildingName,
      campus,
      address,
      managerId,
    },
    select: { id: true },
  });

  return building.id;
}

async function ensureRooms(managerId: string, buildingId: string) {
  const rooms = [
    {
      roomCode: "MEET-101",
      name: "Meeting Room 101",
      description: "Default seeded meeting room",
      pricePerHour: 15,
      securityDeposit: 50,
      capacity: 10,
      roomType: RoomType.MEETING,
      status: RoomStatus.AVAILABLE,
      images: [],
    },
    {
      roomCode: "CLAS-201",
      name: "Classroom 201",
      description: "Default seeded classroom",
      pricePerHour: 20,
      securityDeposit: 80,
      capacity: 25,
      roomType: RoomType.CLASSROOM,
      status: RoomStatus.AVAILABLE,
      images: [],
    },
  ];

  for (const room of rooms) {
    const existing = await prisma.room.findUnique({
      where: { roomCode: room.roomCode },
      select: { id: true },
    });

    if (!existing) {
      await prisma.room.create({
        data: {
          ...room,
          managerId,
          buildingId,
        },
      });
    }
  }

  const createdRooms = await prisma.room.findMany({
    where: { roomCode: { in: rooms.map((r) => r.roomCode) } },
    select: { id: true, roomCode: true },
  });

  return Object.fromEntries(createdRooms.map((r) => [r.roomCode, r.id]));
}

async function ensureServiceCategories(managerId: string) {
  const categories = [
    { name: "Catering", description: "Food & beverages" },
    { name: "Equipment", description: "Extra equipment rental" },
  ];

  await prisma.serviceCategory.createMany({
    data: categories.map((c) => ({ ...c, managerId })),
    skipDuplicates: true,
  });

  const found = await prisma.serviceCategory.findMany({
    where: { name: { in: categories.map((c) => c.name) } },
    select: { id: true, name: true },
  });

  return Object.fromEntries(found.map((c) => [c.name, c.id]));
}

async function ensureServices(
  serviceCategoryIdsByName: Record<string, string>,
) {
  const services = [
    {
      id: "2f1dfd59-6e65-4a1d-bf6f-c0f111c41361",
      name: "Coffee Break",
      description: "Coffee/tea for your session",
      price: 5,
      categoryName: "Catering",
    },
    {
      id: "57f4ce46-1d44-4c71-8b53-7dcc5b1681bb",
      name: "Projector Rental",
      description: "Add a projector to your booking",
      price: 10,
      categoryName: "Equipment",
    },
  ] as const;

  for (const s of services) {
    const existing = await prisma.service.findUnique({
      where: { id: s.id },
      select: { id: true },
    });
    if (existing) continue;

    const categoryId = serviceCategoryIdsByName[s.categoryName];
    if (!categoryId) {
      throw new Error(`Missing service category: ${s.categoryName}`);
    }

    await prisma.service.create({
      data: {
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        categoryId,
      },
    });
  }
}

async function ensureRoomAmenities(
  roomIdsByCode: Record<string, string>,
  amenityIdsByName: Record<string, string>,
) {
  const mappings: Array<{ roomCode: string; amenityName: string }> = [
    { roomCode: "MEET-101", amenityName: "WiFi" },
    { roomCode: "MEET-101", amenityName: "Projector" },
    { roomCode: "MEET-101", amenityName: "Whiteboard" },
    { roomCode: "CLAS-201", amenityName: "WiFi" },
    { roomCode: "CLAS-201", amenityName: "Whiteboard" },
    { roomCode: "CLAS-201", amenityName: "Air Conditioner" },
  ];

  const data = mappings
    .map((m) => {
      const roomId = roomIdsByCode[m.roomCode];
      const amenityId = amenityIdsByName[m.amenityName];
      if (!roomId || !amenityId) return null;
      return { roomId, amenityId };
    })
    .filter((x): x is { roomId: string; amenityId: string } => Boolean(x));

  if (data.length === 0) return;

  await prisma.roomAmenity.createMany({
    data,
    skipDuplicates: true,
  });
}

async function ensureRoomServiceCategories(
  roomIdsByCode: Record<string, string>,
  serviceCategoryIdsByName: Record<string, string>,
) {
  const mappings: Array<{ roomCode: string; categoryName: string }> = [
    { roomCode: "MEET-101", categoryName: "Catering" },
    { roomCode: "MEET-101", categoryName: "Equipment" },
    { roomCode: "CLAS-201", categoryName: "Equipment" },
  ];

  const data = mappings
    .map((m) => {
      const roomId = roomIdsByCode[m.roomCode];
      const categoryId = serviceCategoryIdsByName[m.categoryName];
      if (!roomId || !categoryId) return null;
      return { roomId, categoryId };
    })
    .filter((x): x is { roomId: string; categoryId: string } => Boolean(x));

  if (data.length === 0) return;

  await prisma.roomServiceCategory.createMany({
    data,
    skipDuplicates: true,
  });
}

async function ensureTestBookingRequest(
  managerId: string,
  testUserId: string,
  roomIdsByCode: Record<string, string>,
) {
  const roomId = roomIdsByCode["MEET-101"] || Object.values(roomIdsByCode)[0];
  if (!roomId) {
    throw new Error("Cannot create test booking request: room not found");
  }

  const now = new Date();
  const startTime = new Date(now);
  startTime.setDate(startTime.getDate() + 1);
  startTime.setHours(9, 0, 0, 0);

  const endTime = new Date(startTime);
  endTime.setHours(11, 0, 0, 0);

  const purpose = "Seeded request for payment flow test";

  const existing = await prisma.bookingRequest.findFirst({
    where: {
      userId: testUserId,
      roomId,
      startTime,
      endTime,
      purpose,
      status: BookingStatus.APPROVED,
    },
    select: { id: true },
  });

  if (existing) return existing.id;

  const created = await prisma.bookingRequest.create({
    data: {
      userId: testUserId,
      roomId,
      startTime,
      endTime,
      purpose,
      status: BookingStatus.APPROVED,
      approvedBy: managerId,
    },
    select: { id: true },
  });

  return created.id;
}

async function main(): Promise<CreatedIds> {
  await ensureAdminUser();
  const managerId = await ensureManager();
  const testUserId = await ensureTestUser();

  const amenityIdsByName = await ensureAmenities();
  const buildingId = await ensureBuilding(managerId);
  const roomIdsByCode = await ensureRooms(managerId, buildingId);

  const serviceCategoryIdsByName = await ensureServiceCategories(managerId);
  await ensureServices(serviceCategoryIdsByName);

  await ensureRoomAmenities(roomIdsByCode, amenityIdsByName);
  await ensureRoomServiceCategories(roomIdsByCode, serviceCategoryIdsByName);
  const testBookingRequestId = await ensureTestBookingRequest(
    managerId,
    testUserId,
    roomIdsByCode,
  );

  return {
    managerId,
    buildingId,
    testUserId,
    testBookingRequestId,
    roomIdsByCode,
    serviceCategoryIdsByName,
    amenityIdsByName,
  };
}

main()
  .then((ids) => {
    console.log("Seed completed.");
    console.log({
      managerId: ids.managerId,
      buildingId: ids.buildingId,
      testUserId: ids.testUserId,
      testBookingRequestId: ids.testBookingRequestId,
      testUserEmail: SEED_TEST_USER_EMAIL,
      testUserPassword: SEED_TEST_USER_PASSWORD,
      rooms: ids.roomIdsByCode,
      serviceCategories: ids.serviceCategoryIdsByName,
    });
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
