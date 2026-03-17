import crypto from "crypto";
import { BadRequestError } from "../core/error.response";

type CreatePaymentUrlInput = {
  bookingRequestId: string;
  amount: number;
  ipAddr: string;
  orderInfo?: string;
  locale?: "vn" | "en";
};

type VnpayQueryParams = Record<string, string>;

const formatDateTime = (date: Date) => {
  const pad = (v: number) => String(v).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
};

export default class VnpayService {
  private getConfig() {
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const hashSecret = process.env.VNPAY_HASH_SECRET;
    const paymentUrl =
      process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = process.env.VNPAY_RETURN_URL;

    if (!tmnCode || !hashSecret || !returnUrl) {
      throw new BadRequestError(
        "VNPAY configuration is missing. Please set VNPAY_TMN_CODE, VNPAY_HASH_SECRET and VNPAY_RETURN_URL",
      );
    }

    return {
      tmnCode,
      hashSecret,
      paymentUrl,
      returnUrl,
    };
  }

  private buildQueryString(params: VnpayQueryParams) {
    return Object.keys(params)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`)
      .join("&");
  }

  private sign(data: string, secret: string) {
    return crypto.createHmac("sha512", secret).update(data, "utf8").digest("hex");
  }

  createPaymentUrl(input: CreatePaymentUrlInput) {
    const { tmnCode, hashSecret, paymentUrl, returnUrl } = this.getConfig();
    const txnRef = `br_${input.bookingRequestId}_${Date.now()}`;
    const amount = Math.round(input.amount * 100);
    const createDate = formatDateTime(new Date());

    const payload: VnpayQueryParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: String(amount),
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: input.orderInfo || `Booking request ${input.bookingRequestId}`,
      vnp_OrderType: "other",
      vnp_Locale: input.locale || "vn",
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: input.ipAddr || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    const signData = this.buildQueryString(payload);
    const secureHash = this.sign(signData, hashSecret);
    const query = `${signData}&vnp_SecureHash=${secureHash}`;

    return {
      paymentUrl: `${paymentUrl}?${query}`,
      txnRef,
    };
  }

  verifyQuery(rawQuery: Record<string, string>) {
    const { hashSecret } = this.getConfig();
    const query = { ...rawQuery };
    const secureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    if (!secureHash) {
      return false;
    }

    const signData = this.buildQueryString(query);
    const expectedHash = this.sign(signData, hashSecret);
    return secureHash === expectedHash;
  }

  extractBookingRequestId(txnRef: string) {
    const parts = txnRef.split("_");
    if (parts.length < 3 || parts[0] !== "br") {
      throw new BadRequestError("Invalid vnp_TxnRef format");
    }
    return parts[1];
  }
}
