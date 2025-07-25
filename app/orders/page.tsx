"use client"
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const STATUS_LABELS = [
  { key: "pending", label: "Chờ vận chuyển" },
  { key: "shipping", label: "Đã vận chuyển" },
  { key: "delivered", label: "Đã nhận hàng" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/order").then(res => {
      // Giả lập status cho demo FE, backend nên trả về status thực tế
      const fakeStatus = ["pending", "shipping", "delivered"];
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(
        data.map((o, i) => ({
          ...o,
          status: fakeStatus[i % 3], // Xoay vòng trạng thái cho demo
        }))
      );
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter(o => o.status === tab);

  return (
    <main className="main-content">
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Đơn hàng của tôi</h2>
        <div className="d-flex gap-3 mb-4">
          {STATUS_LABELS.map(s => (
            <button
              key={s.key}
              className={`btn ${tab === s.key ? "btn-success" : "btn-outline-success"} fw-bold`}
              onClick={() => setTab(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div>Đang tải đơn hàng...</div>
        ) : filtered.length === 0 ? (
          <div className="alert alert-info">Không có đơn hàng nào ở mục này.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.createdAt ? order.createdAt.slice(0, 10) : "-"}</td>
                    <td>{order.price?.toLocaleString("vi-VN")}₫</td>
                    <td>{STATUS_LABELS.find(s => s.key === order.status)?.label}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
