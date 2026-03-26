import { PaymentMethod, Prisma, TransactionStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  CreateTransactionInput,
  ITransactionRepository,
  RevenueReportInput,
  TransactionFilterInput,
} from "../interface/transaction.repository.interface";

export class TransactionRepository implements ITransactionRepository {
  async create(data: CreateTransactionInput) {
    return prisma.transaction.create({ data });
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        booking: {
          include: {
            room: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async findByBookingId(bookingId: string) {
    return prisma.transaction.findUnique({ where: { bookingId } });
  }

  async findMany(filter: TransactionFilterInput) {
    const {
      userId,
      paymentMethod,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = filter;

    const where: Prisma.TransactionWhereInput = {
      ...(userId && { userId }),
      ...(paymentMethod && { paymentMethod }),
      ...(status && { status }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          booking: {
            include: {
              room: {
                select: {
                  id: true,
                  name: true,
                  building: { select: { id: true, buildingName: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { data, total };
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    extra?: { paidAt?: Date; note?: string },
  ) {
    return prisma.transaction.update({
      where: { id },
      data: { status, ...extra },
    });
  }

  async getRevenueSummary(input: RevenueReportInput) {
    const { startDate, endDate, groupBy, managerId } = input;

    // Filter only SUCCESS transactions
    const baseWhere: Prisma.TransactionWhereInput = {
      status: "SUCCESS",
      paidAt: { gte: startDate, lte: endDate },
    };

    if (groupBy === "paymentMethod") {
      const rows = await prisma.transaction.groupBy({
        by: ["paymentMethod"],
        where: baseWhere,
        _sum: { amount: true },
        _count: { id: true },
      });
      return rows.map((r) => ({
        paymentMethod: r.paymentMethod,
        totalAmount: r._sum.amount ?? 0,
        count: r._count.id,
      }));
    }

    if (groupBy === "room" || groupBy === "building") {
      const transactions = await prisma.transaction.findMany({
        where: baseWhere,
        select: {
          amount: true,
          booking: {
            select: {
              room: {
                select: {
                  id: true,
                  name: true,
                  managerId: true,
                  building: {
                    select: { id: true, buildingName: true, managerId: true },
                  },
                },
              },
            },
          },
        },
      });

      const map = new Map<
        string,
        { label: string; totalAmount: number; count: number }
      >();
      for (const t of transactions) {
        const room = t.booking?.room;
        if (!room) continue;
        if (managerId && room.managerId !== managerId) continue;

        const key = groupBy === "room" ? room.id : room.building.id;
        const label =
          groupBy === "room" ? room.name : room.building.buildingName;

        const existing = map.get(key) ?? { label, totalAmount: 0, count: 0 };
        map.set(key, {
          label,
          totalAmount: existing.totalAmount + t.amount,
          count: existing.count + 1,
        });
      }
      return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
    }

    // day or month grouping via raw SQL
    const format = groupBy === "day" ? "YYYY-MM-DD" : "YYYY-MM";
    const managerFilter = managerId
      ? Prisma.sql`AND b."roomId" IN (SELECT id FROM "Room" WHERE "managerId" = ${managerId})`
      : Prisma.sql``;

    const rows = await prisma.$queryRaw<
      Array<{ period: string; total_amount: number; count: bigint }>
    >`
      SELECT
        TO_CHAR(t."paidAt", ${format}) AS period,
        SUM(t.amount)::float AS total_amount,
        COUNT(t.id) AS count
      FROM "Transaction" t
      LEFT JOIN "Booking" b ON b.id = t."bookingId"
      WHERE t.status = 'SUCCESS'
        AND t."paidAt" >= ${startDate}
        AND t."paidAt" <= ${endDate}
        ${managerFilter}
      GROUP BY period
      ORDER BY period ASC
    `;

    return rows.map((r) => ({
      period: r.period,
      totalAmount: r.total_amount,
      count: Number(r.count),
    }));
  }

  async getTotalRevenue(startDate: Date, endDate: Date, managerId?: string) {
    if (managerId) {
      const transactions = await prisma.transaction.findMany({
        where: {
          status: "SUCCESS",
          paidAt: { gte: startDate, lte: endDate },
        },
        select: {
          amount: true,
          booking: {
            select: { room: { select: { managerId: true } } },
          },
        },
      });
      return transactions
        .filter((t) => t.booking?.room?.managerId === managerId)
        .reduce((sum, t) => sum + t.amount, 0);
    }

    const result = await prisma.transaction.aggregate({
      where: {
        status: "SUCCESS",
        paidAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  }

  async getPaymentMethodBreakdown(
    startDate: Date,
    endDate: Date,
    managerId?: string,
  ) {
    const rows = await prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: {
        status: "SUCCESS",
        paidAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      _count: { id: true },
    });
    return rows.map((r) => ({
      paymentMethod: r.paymentMethod,
      totalAmount: r._sum.amount ?? 0,
      count: r._count.id,
    }));
  }
}
