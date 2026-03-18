# Hướng dẫn Frontend – Gọi API thanh toán VNPAY

Tài liệu mô tả chi tiết cách frontend tích hợp luồng thanh toán từ lúc user bấm nút **Pay** đến khi quay về trang sau khi thanh toán xong.

---

## 1. Tổng quan luồng

```
User bấm Pay → Gọi API tạo payment URL → Redirect sang VNPAY
                                                    ↓
User thanh toán trên VNPAY → VNPAY redirect về server → Server redirect về client
                                                    ↓
Client đọc query ?paymentStatus=success|failed → Hiển thị toast / cập nhật UI
```

---

## 2. Khi nào hiển thị nút Pay

Chỉ hiển thị nút **Pay** khi:

- `bookingRequest.status === 'APPROVED'`
- Chưa thanh toán (chưa có `Booking` tương ứng)

```tsx
const canPay = request?.status === 'APPROVED' && !isPaid;

{canPay && (
  <button onClick={() => handlePay()}>Pay</button>
)}
```

---

## 3. API tạo Payment URL

### Endpoint

```
POST {BASE_URL}/v1/api/booking-requests/{bookingRequestId}/payment-url
```

### Headers (bắt buộc)

| Header         | Mô tả                                      |
|----------------|--------------------------------------------|
| `Content-Type` | `application/json`                         |
| `x-client-id`  | User ID (UUID) – lấy từ auth store         |
| `authorization`| Access token – lấy từ auth store           |

### Request body

```json
{
  "locale": "vn"
}
```

- `locale`: `"vn"` hoặc `"en"` – ngôn ngữ trang thanh toán VNPAY.

### Response thành công (200)

```json
{
  "message": "Create VNPAY payment URL successfully",
  "reason": "Success",
  "metadata": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...",
    "txnRef": "br_65be0de6-225d-4d37-8c9a-21860e931a87_1710000000000",
    "amount": 30000,
    "bookingRequestId": "65be0de6-225d-4d37-8c9a-21860e931a87",
    "roomName": "Meeting Room 101"
  }
}
```

### Response lỗi

| Status | Ý nghĩa                                      |
|--------|----------------------------------------------|
| 400    | Request chưa APPROVED hoặc dữ liệu không hợp lệ |
| 401    | Chưa đăng nhập / token hết hạn              |
| 403    | Không phải chủ sở hữu booking request        |
| 404    | Không tìm thấy booking request               |
| 409    | Đã thanh toán rồi (đã có Booking)            |

---

## 4. Xử lý khi user bấm Pay

### Bước 1: Gọi API

```ts
const response = await axiosInstance.post<{
  metadata: CreateBookingRequestPaymentUrlResult;
}>(
  `/booking-requests/${bookingRequestId}/payment-url`,
  { locale: 'vn' }
);

const { paymentUrl } = response.data.metadata;
```

### Bước 2: Redirect sang VNPAY

```ts
if (paymentUrl) {
  window.location.href = paymentUrl;
}
```

**Lưu ý:** Dùng `window.location.href` để chuyển hẳn sang trang VNPAY (full page redirect), không dùng `window.open` vì có thể bị chặn popup.

### Bước 3: Xử lý lỗi

```ts
try {
  const response = await createPaymentUrl.mutateAsync({
    bookingRequestId: selectedRequest.id,
    locale: 'vn',
  });
  if (!response.paymentUrl) {
    toast.error('Could not create payment URL.');
    return;
  }
  window.location.href = response.paymentUrl;
} catch (error) {
  const message = error?.response?.data?.message || 'Could not initialize payment.';
  toast.error(message);
}
```

---

## 5. URL sau khi thanh toán (Return)

VNPAY redirect user về server, server xử lý rồi redirect tiếp về client:

```
{CLIENT_URL}/user/bookings?paymentStatus=success&bookingRequestId=xxx
{CLIENT_URL}/user/bookings?paymentStatus=failed&bookingRequestId=xxx
```

### Xử lý trên trang Bookings

Đọc query params khi component mount:

```tsx
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const paymentStatus = searchParams.get('paymentStatus');
  if (!paymentStatus) return;

  if (paymentStatus === 'success') {
    toast.success('Payment successful. Your booking has been confirmed.');
  } else {
    toast.error('Payment failed or cancelled. Please try again.');
  }

  // Xóa query để tránh hiển thị toast lặp lại khi refresh
  const nextParams = new URLSearchParams(searchParams);
  nextParams.delete('paymentStatus');
  nextParams.delete('bookingRequestId');
  setSearchParams(nextParams, { replace: true });
}, [searchParams, setSearchParams]);
```

---

## 6. Cập nhật danh sách sau khi thanh toán

Sau khi thanh toán thành công, backend tạo `Booking`. Frontend cần biết request nào đã thanh toán để:

- Ẩn nút Pay
- Hiển thị trạng thái "Confirmed"

### Cách 1: Gọi API `GET /myBookings`

So sánh `userId + roomId + startTime + endTime` giữa `BookingRequest` và `Booking`:

```ts
const paidRequestSignatureSet = useMemo(() => {
  const set = new Set<string>();
  for (const booking of myBookings ?? []) {
    set.add(
      `${booking.userId}|${booking.roomId}|${new Date(booking.startTime).toISOString()}|${new Date(booking.endTime).toISOString()}`
    );
  }
  return set;
}, [myBookings]);

const isPaid = paidRequestSignatureSet.has(
  `${request.userId}|${request.roomId}|${new Date(request.startTime).toISOString()}|${new Date(request.endTime).toISOString()}`
);
```

### Cách 2: Invalidate query sau khi redirect về

Khi có `paymentStatus=success`, gọi `queryClient.invalidateQueries(['bookings', 'user', 'my'])` để refetch danh sách booking.

---

## 7. TypeScript types

```ts
// types/booking-request-api.ts

export interface CreateBookingRequestPaymentUrlResult {
  paymentUrl: string;
  txnRef: string;
  amount: number;
  bookingRequestId: string;
  roomName: string;
}
```

---

## 8. Ví dụ hook React Query

```ts
// hooks/user/booking-requests/use-create-booking-request-payment-url.ts

import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { CreateBookingRequestPaymentUrlResult } from '@/types/booking-request-api';

export const useCreateBookingRequestPaymentUrl = () => {
  return useMutation({
    mutationFn: async (input: {
      bookingRequestId: string;
      locale?: 'vn' | 'en';
    }) => {
      const response = await axiosInstance.post<{
        metadata: CreateBookingRequestPaymentUrlResult;
      }>(`/booking-requests/${input.bookingRequestId}/payment-url`, {
        locale: input.locale ?? 'vn',
      });
      return response.data.metadata;
    },
  });
};
```

---

## 9. Ví dụ component xử lý Pay

```tsx
const handlePay = async () => {
  if (!selectedRequest?.id) return;
  if (createPaymentUrl.isPending) return;

  try {
    const locale: 'vn' | 'en' =
      navigator.language.toLowerCase().startsWith('vi') ? 'vn' : 'en';

    const response = await createPaymentUrl.mutateAsync({
      bookingRequestId: selectedRequest.id,
      locale,
    });

    if (!response.paymentUrl) {
      toast.error('Could not create payment URL.');
      return;
    }

    window.location.href = response.paymentUrl;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || 'Could not initialize payment.';
    toast.error(message);
  }
};
```

---

## 10. Checklist tích hợp

- [ ] Axios instance đã gửi `x-client-id` và `authorization` trong mọi request
- [ ] Nút Pay chỉ hiện khi `status === 'APPROVED'` và chưa thanh toán
- [ ] Gọi `POST /booking-requests/:id/payment-url` với `locale` phù hợp
- [ ] Redirect bằng `window.location.href = paymentUrl`
- [ ] Trang Bookings đọc `?paymentStatus` và hiển thị toast
- [ ] Xóa query params sau khi đã xử lý (tránh toast lặp)
- [ ] Refetch hoặc so sánh với `myBookings` để cập nhật trạng thái "Confirmed"

---

## 11. Biến môi trường

Đảm bảo `VITE_API_BASE_URL` trỏ đúng server (ví dụ: `http://localhost:3000`).

Server cần `CLIENT_URL` để redirect về đúng domain sau khi thanh toán (ví dụ: `http://localhost:5173`).
