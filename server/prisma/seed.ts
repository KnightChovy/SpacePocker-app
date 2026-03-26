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
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "12345";
const SEED_ADMIN_NAME = process.env.SEED_ADMIN_NAME || "System Admin";

const SEED_MANAGER_EMAIL =
  process.env.SEED_MANAGER_EMAIL || "manager@example.com";
const SEED_MANAGER_PASSWORD = process.env.SEED_MANAGER_PASSWORD || "12345";
const SEED_MANAGER_NAME = process.env.SEED_MANAGER_NAME || "Default Manager";
const SEED_TEST_USER_EMAIL =
  process.env.SEED_TEST_USER_EMAIL || "payment.tester@example.com";
const SEED_TEST_USER_PASSWORD = process.env.SEED_TEST_USER_PASSWORD || "12345";
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
  const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

  const existing = await prisma.user.findUnique({
    where: { email: SEED_ADMIN_EMAIL },
    select: { id: true },
  });
  if (existing) {
    await prisma.user.update({
      where: { email: SEED_ADMIN_EMAIL },
      data: {
        name: SEED_ADMIN_NAME,
        role: Role.ADMIN,
        password: passwordHash,
      },
    });
    return;
  }

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

async function ensureManagerAuthUser() {
  const passwordHash = await bcrypt.hash(SEED_MANAGER_PASSWORD, 10);

  const existing = await prisma.user.findUnique({
    where: { email: SEED_MANAGER_EMAIL },
    select: { id: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { email: SEED_MANAGER_EMAIL },
      data: {
        name: SEED_MANAGER_NAME,
        role: Role.MANAGER,
        password: passwordHash,
      },
    });
    return;
  }

  await prisma.user.create({
    data: {
      name: SEED_MANAGER_NAME,
      email: SEED_MANAGER_EMAIL,
      role: Role.MANAGER,
      password: passwordHash,
    },
  });
}

async function ensureTestUser() {
  const passwordHash = await bcrypt.hash(SEED_TEST_USER_PASSWORD, 10);

  const existing = await prisma.user.findUnique({
    where: { email: SEED_TEST_USER_EMAIL },
    select: { id: true },
  });
  if (existing) {
    await prisma.user.update({
      where: { email: SEED_TEST_USER_EMAIL },
      data: {
        name: SEED_TEST_USER_NAME,
        role: Role.USER,
        password: passwordHash,
      },
    });
    return existing.id;
  }

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
    "High-Speed WiFi",
    "Whiteboard & Markers",
    "Air Conditioning",
    "Smart TV",
    "Standard Built-in Speakers",
    "HDMI/Type-C Cables",
    "Charging Power Outlets",
    "Water Dispenser",
    "Ergonomic Chairs",
    "Parking",
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
      name: "Meeting Room Lotus",
      description: "Modern meeting room for team discussion",
      pricePerHour: 70000,
      securityDeposit: 200000,
      capacity: 10,
      roomType: RoomType.MEETING,
      status: RoomStatus.AVAILABLE,
      images: [
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      roomCode: "CLAS-201",
      name: "Classroom Sunflower",
      description: "Standard classroom for training sessions",
      pricePerHour: 60000,
      securityDeposit: 180000,
      capacity: 25,
      roomType: RoomType.CLASSROOM,
      status: RoomStatus.AVAILABLE,
      images: [
        "https://thietkenoithatatz.com/wp-content/uploads/2021/12/thiet-ke-phong-hop-sang-trong-3.jpg0",
      ],
    },
    {
      roomCode: "MEET-102",
      name: "Meeting Room Sakura",
      description: "Bright room for client meetings",
      pricePerHour: 80000,
      securityDeposit: 220000,
      capacity: 12,
      roomType: RoomType.MEETING,
      status: RoomStatus.AVAILABLE,
      images: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      roomCode: "MEET-103",
      name: "Meeting Room Bamboo",
      description: "Compact room for standup and sprint planning",
      pricePerHour: 50000,
      securityDeposit: 150000,
      capacity: 8,
      roomType: RoomType.MEETING,
      status: RoomStatus.AVAILABLE,
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      roomCode: "CLAS-202",
      name: "Classroom Orchid",
      description: "Classroom with projector for practical workshops",
      pricePerHour: 90000,
      securityDeposit: 250000,
      capacity: 30,
      roomType: RoomType.CLASSROOM,
      status: RoomStatus.AVAILABLE,
      images: [
        "https://img6.thuthuatphanmem.vn/uploads/2022/03/16/background-phong-hop-hien-dai-dep-nhat_083825256.jpg",
      ],
    },
    {
      roomCode: "CLAS-203",
      name: "Classroom Phoenix",
      description: "Large classroom for seminars and speaking events",
      pricePerHour: 100000,
      securityDeposit: 300000,
      capacity: 40,
      roomType: RoomType.CLASSROOM,
      status: RoomStatus.AVAILABLE,
      images: [
        "https://thietkenoithatatz.com/wp-content/uploads/2021/12/thiet-ke-phong-hop-sang-trong-1.jpg",
      ],
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { roomCode: room.roomCode },
      update: {
        ...room,
        managerId,
        buildingId,
      },
      create: {
        ...room,
        managerId,
        buildingId,
      },
    });
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
      name: "Standard Coffee Break",
      description: "Coffee, tea, and cookies for your session",
      price: 50000,
      categoryName: "Catering",
    },
    {
      id: "57f4ce46-1d44-4c71-8b53-7dcc5b1681bb",
      name: "4K Projector Rental",
      description: "High-lumens 4K projector for presentations",
      price: 150000,
      categoryName: "Equipment",
    },
    {
      id: "10208610-e7d1-4e14-8c5a-12ccacdef0b3",
      name: "Fresh Fruit Platter",
      description: "Assorted seasonal fresh fruits",
      price: 70000,
      categoryName: "Catering",
    },
    {
      id: "57ace955-33d8-4f8b-b8f8-4e39f2e99115",
      name: "Wireless Microphone Set",
      description: "Set of 2 wireless microphones and receiver",
      price: 100000,
      categoryName: "Equipment",
    },
  ] as const;

  for (const s of services) {
    const categoryId = serviceCategoryIdsByName[s.categoryName];
    if (!categoryId) {
      throw new Error(`Missing service category: ${s.categoryName}`);
    }

    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        description: s.description,
        price: s.price,
        categoryId,
      },
      create: {
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
    { roomCode: "MEET-101", amenityName: "High-Speed WiFi" },
    { roomCode: "MEET-101", amenityName: "Smart TV" },
    { roomCode: "MEET-101", amenityName: "Whiteboard & Markers" },
    { roomCode: "MEET-101", amenityName: "Air Conditioning" },
    { roomCode: "MEET-101", amenityName: "Water Dispenser" },
    { roomCode: "CLAS-201", amenityName: "High-Speed WiFi" },
    { roomCode: "CLAS-201", amenityName: "Whiteboard & Markers" },
    { roomCode: "CLAS-201", amenityName: "Air Conditioning" },
    { roomCode: "CLAS-201", amenityName: "Ergonomic Chairs" },
    { roomCode: "MEET-102", amenityName: "High-Speed WiFi" },
    { roomCode: "MEET-102", amenityName: "Smart TV" },
    { roomCode: "MEET-102", amenityName: "Whiteboard & Markers" },
    { roomCode: "MEET-102", amenityName: "Standard Built-in Speakers" },
    { roomCode: "MEET-102", amenityName: "HDMI/Type-C Cables" },
    { roomCode: "MEET-103", amenityName: "High-Speed WiFi" },
    { roomCode: "MEET-103", amenityName: "Whiteboard & Markers" },
    { roomCode: "MEET-103", amenityName: "Charging Power Outlets" },
    { roomCode: "CLAS-202", amenityName: "High-Speed WiFi" },
    { roomCode: "CLAS-202", amenityName: "Smart TV" },
    { roomCode: "CLAS-202", amenityName: "Whiteboard & Markers" },
    { roomCode: "CLAS-202", amenityName: "Air Conditioning" },
    { roomCode: "CLAS-203", amenityName: "High-Speed WiFi" },
    { roomCode: "CLAS-203", amenityName: "Smart TV" },
    { roomCode: "CLAS-203", amenityName: "Whiteboard & Markers" },
    { roomCode: "CLAS-203", amenityName: "Standard Built-in Speakers" },
    { roomCode: "CLAS-203", amenityName: "Ergonomic Chairs" },
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
    { roomCode: "MEET-102", categoryName: "Catering" },
    { roomCode: "MEET-102", categoryName: "Equipment" },
    { roomCode: "MEET-103", categoryName: "Equipment" },
    { roomCode: "CLAS-202", categoryName: "Catering" },
    { roomCode: "CLAS-202", categoryName: "Equipment" },
    { roomCode: "CLAS-203", categoryName: "Catering" },
    { roomCode: "CLAS-203", categoryName: "Equipment" },
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
  await ensureManagerAuthUser();
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
      adminEmail: SEED_ADMIN_EMAIL,
      adminPassword: SEED_ADMIN_PASSWORD,
      managerEmail: SEED_MANAGER_EMAIL,
      managerPassword: SEED_MANAGER_PASSWORD,
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
