"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Coupon {
  id: number;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  isActive: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("orders");

  // State for Orders
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // State for Users
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // State for Coupons
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percent", value: "", minAmount: "0" });

  // State for Products
  const [newProduct, setNewProduct] = useState({
    name: "", slug: "", description: "", price: "", comparePrice: "", category: "Hoodies",
    imageUrls: "", stockCount: "100"
  });
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }
    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user, isLoading, router]);

  // Tab change handlers
  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) fetchOrders();
    if (activeTab === "settings" && usersList.length === 0) fetchUsers();
    if (activeTab === "coupons" && couponsList.length === 0) fetchCoupons();
  }, [activeTab]);

  // --- ORDERS LOGIC ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // --- USERS LOGIC ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsersList(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- COUPONS LOGIC ---
  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) setCouponsList(data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        code: newCoupon.code,
        discountPercent: newCoupon.type === "percent" ? newCoupon.value : null,
        discountAmount: newCoupon.type === "amount" ? newCoupon.value : null,
        minOrderAmount: newCoupon.minAmount,
        isActive: true,
      };
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setCouponsList([...couponsList, data.coupon]);
        setNewCoupon({ code: "", type: "percent", value: "", minAmount: "0" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- PRODUCTS LOGIC ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const imagesArray = newProduct.imageUrls.split(",").map((url) => url.trim()).filter(Boolean);
      
      const body = {
        ...newProduct,
        images: imagesArray.length > 0 ? imagesArray : ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800"], // fallback image
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product Added Successfully!");
        setNewProduct({
          name: "", slug: "", description: "", price: "", comparePrice: "", category: "Hoodies",
          imageUrls: "", stockCount: "100"
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProduct(false);
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-void text-white">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto text-white">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ADMIN PORTAL
            </span>
            <h1 className="font-heading text-3xl md:text-4xl tracking-wider text-white">
              STORE MANAGEMENT
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 border-b border-white/10 hide-scrollbar">
        {["orders", "products", "coupons", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
              activeTab === tab ? "bg-white text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Customer Orders ({orders.length})
            </h2>
            <button onClick={fetchOrders} className="text-[10px] uppercase underline text-white/50">Refresh</button>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-white/50">Loading store orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/50">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold">#{ord.orderNumber}</td>
                      <td className="py-4 px-4">{ord.customerName}</td>
                      <td className="py-4 px-4 font-semibold">Rs. {ord.totalAmount.toLocaleString()}</td>
                      <td className="py-4 px-4 uppercase text-[10px]">{ord.paymentMethod}</td>
                      <td className="py-4 px-4">
                        <select
                          value={ord.orderStatus}
                          disabled={updatingId === ord.id}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="bg-black/60 border border-white/20 rounded px-2 py-1 text-[10px] uppercase"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === "products" && (
        <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl max-w-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">
            Add New Product
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Slug (URL friendly)</label>
                <input required type="text" value={newProduct.slug} onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none" placeholder="e.g. black-oversized-tee" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Description</label>
              <textarea required rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Price</label>
                <input required type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Compare Price</label>
                <input type="number" step="0.01" value={newProduct.comparePrice} onChange={(e) => setNewProduct({...newProduct, comparePrice: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Category</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none">
                  <option>Hoodies</option>
                  <option>Oversized Tees</option>
                  <option>Cargo Pants</option>
                  <option>Jackets</option>
                  <option>Accessories</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Image URLs (Comma separated)</label>
              <input required type="text" value={newProduct.imageUrls} onChange={(e) => setNewProduct({...newProduct, imageUrls: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded focus:border-white/40 outline-none" placeholder="https://image1.jpg, https://image2.jpg" />
              <p className="text-[10px] text-amber-400 mt-1">To save server space, use external image links (Imgur, Cloudinary, Unsplash).</p>
            </div>

            <button disabled={savingProduct} type="submit" className="w-full py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded mt-4 hover:bg-neutral-200">
              {savingProduct ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: COUPONS */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">Create Coupon</h2>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Coupon Code</label>
                <input required type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded uppercase" placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Discount Type</label>
                  <select value={newCoupon.type} onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded">
                    <option value="percent">Percentage (%)</option>
                    <option value="amount">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Discount Value</label>
                  <input required type="number" value={newCoupon.value} onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1">Minimum Order Amount (Rs.)</label>
                <input type="number" value={newCoupon.minAmount} onChange={(e) => setNewCoupon({...newCoupon, minAmount: e.target.value})} className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded" />
              </div>
              <button type="submit" className="w-full py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-neutral-200">
                Create Coupon
              </button>
            </form>
          </div>

          <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">Active Coupons</h2>
            {loadingCoupons ? (
              <p className="text-xs text-white/50">Loading...</p>
            ) : couponsList.length === 0 ? (
              <p className="text-xs text-white/50">No coupons created.</p>
            ) : (
              <ul className="space-y-3">
                {couponsList.map((c) => (
                  <li key={c.id} className="flex justify-between items-center p-3 bg-black/40 border border-white/10 rounded">
                    <div>
                      <p className="font-bold text-sm tracking-wider">{c.code}</p>
                      <p className="text-[10px] text-white/50 uppercase">
                        {c.discountPercent ? `${c.discountPercent}% OFF` : `Rs. ${c.discountAmount} OFF`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-[9px] uppercase font-bold rounded ${c.isActive ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/20 text-red-400'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS (USERS) */}
      {activeTab === "settings" && (
        <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">User Role Management</h2>
          {loadingUsers ? (
            <p className="text-xs text-white/50">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === user.id} // Cannot change own role
                          className={`bg-black/60 border rounded px-2 py-1 text-[10px] uppercase font-bold ${
                            u.role === 'admin' ? 'border-amber-400/50 text-amber-400' : 'border-white/20 text-white'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
