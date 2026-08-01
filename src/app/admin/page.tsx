"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { 
  PackageSearch, 
  Tag, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle, 
  LayoutDashboard,
  Store,
  MessageSquare,
  Star
} from "lucide-react";

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

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  stockCount: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  productName: string;
  userEmail: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");

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
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", slug: "", description: "", price: "", comparePrice: "", category: "Hoodies",
    imageUrls: "", stockCount: "100"
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // State for Reviews
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }
    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (activeTab === "orders" || activeTab === "dashboard") {
      if (orders.length === 0) fetchOrders();
    }
    if (activeTab === "settings" && usersList.length === 0) fetchUsers();
    if (activeTab === "coupons" && couponsList.length === 0) fetchCoupons();
    if (activeTab === "products" && productsList.length === 0) fetchProducts();
    if (activeTab === "reviews" && reviewsList.length === 0) fetchReviews();
  }, [activeTab]);

  // --- LOGIC FUNCTIONS (Orders, Users, Coupons, Products, Reviews) ---
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

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) setProductsList(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) setReviewsList(data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviewsList(reviewsList.filter(r => r.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const currentUrls = newProduct.imageUrls ? newProduct.imageUrls + ", " : "";
        setNewProduct({ ...newProduct, imageUrls: currentUrls + data.url });
      } else {
        alert(data.error || "Failed to upload");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const imagesArray = newProduct.imageUrls.split(",").map((url) => url.trim()).filter(Boolean);
      const body = {
        ...newProduct,
        id: editingProductId,
        images: imagesArray.length > 0 ? imagesArray : ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800"],
      };

      const method = editingProductId ? "PATCH" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        alert(editingProductId ? "Product Updated Successfully!" : "Product Added Successfully!");
        if (editingProductId) {
          setProductsList(productsList.map(p => p.id === editingProductId ? data.product : p));
        } else {
          setProductsList([...productsList, data.product]);
        }
        setNewProduct({ name: "", slug: "", description: "", price: "", comparePrice: "", category: "Hoodies", imageUrls: "", stockCount: "100" });
        setEditingProductId(null);
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

  // Calculate stats for Dashboard Tab
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "orders", label: "Orders", icon: <PackageSearch size={18} /> },
    { id: "products", label: "Products", icon: <PlusCircle size={18} /> },
    { id: "reviews", label: "Reviews", icon: <MessageSquare size={18} /> },
    { id: "coupons", label: "Coupons", icon: <Tag size={18} /> },
    { id: "settings", label: "User Roles", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex pt-20">
      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-20 bottom-0 border-r border-white/5 bg-[#0A0A0A] hidden md:flex flex-col">
        <div className="p-6 pb-2">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTab === link.id 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <Link href="/shop" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest text-white/50 hover:bg-white/5 hover:text-white transition-all">
            <Store size={18} />
            View Store
          </Link>
        </div>
      </aside>

      {/* MOBILE TABS */}
      <div className="md:hidden fixed top-20 left-0 right-0 z-40 bg-[#0A0A0A] border-b border-white/5 flex overflow-x-auto hide-scrollbar">
        {sidebarLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
              activeTab === link.id ? "text-white border-b-2 border-white" : "text-white/40"
            }`}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-heading text-3xl md:text-5xl tracking-wider capitalize">
              {activeTab === "settings" ? "User Roles" : activeTab}
            </h1>
            <p className="text-white/40 text-xs tracking-widest uppercase mt-2">Manage your UNTERGRUND store</p>
          </div>

          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Orders", value: totalOrders, color: "text-white" },
                  { title: "Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, color: "text-emerald-400" },
                  { title: "Pending", value: pendingOrders, color: "text-amber-400" },
                  { title: "Delivered", value: deliveredOrders, color: "text-blue-400" }
                ].map((stat, i) => (
                  <div key={i} className="bg-neutral-900/40 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
                    <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xs uppercase tracking-widest text-white/70 mb-4 font-semibold">Quick Actions</h3>
                <div className="flex gap-4">
                  <button onClick={() => setActiveTab("products")} className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors">Add Product</button>
                  <button onClick={() => setActiveTab("orders")} className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors">View Orders</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Recent Orders</h2>
                <button onClick={fetchOrders} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  Refresh
                </button>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-white/50">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-sm text-white/50">No orders found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase text-[9px] tracking-[0.2em]">
                        <th className="py-4 px-4 font-semibold">Order #</th>
                        <th className="py-4 px-4 font-semibold">Customer</th>
                        <th className="py-4 px-4 font-semibold">Total</th>
                        <th className="py-4 px-4 font-semibold">Payment</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-white">#{ord.orderNumber}</td>
                          <td className="py-4 px-4">{ord.customerName}</td>
                          <td className="py-4 px-4 font-semibold text-emerald-400">Rs. {ord.totalAmount.toLocaleString()}</td>
                          <td className="py-4 px-4 uppercase text-[9px] tracking-wider">{ord.paymentMethod}</td>
                          <td className="py-4 px-4">
                            <select
                              value={ord.orderStatus}
                              disabled={updatingId === ord.id}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-white/40 cursor-pointer"
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

          {/* TAB: PRODUCTS */}
          {activeTab === "products" && (
            <>
            <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-8">
                {editingProductId ? "Edit Product" : "Add to Catalog"}
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-5 text-sm">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Product Name</label>
                    <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Slug URL</label>
                    <input required type="text" value={newProduct.slug} onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" placeholder="e.g. black-tee" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Description</label>
                  <textarea required rows={4} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors resize-none" />
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Price</label>
                    <input required type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Compare Price</label>
                    <input type="number" step="0.01" value={newProduct.comparePrice} onChange={(e) => setNewProduct({...newProduct, comparePrice: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Category</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors">
                      <option>Hoodies</option>
                      <option>Oversized Tees</option>
                      <option>Cargo Pants</option>
                      <option>Jackets</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Image URLs or Upload</label>
                  <div className="flex flex-col gap-3">
                    <input type="text" value={newProduct.imageUrls} onChange={(e) => setNewProduct({...newProduct, imageUrls: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" placeholder="https://image1.jpg, https://image2.jpg" />
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] uppercase text-white/40 font-bold">OR</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploadingImage}
                        className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                      />
                      {uploadingImage && <span className="text-[10px] text-emerald-400 animate-pulse">Uploading...</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button disabled={savingProduct || uploadingImage} type="submit" className="flex-1 py-4 bg-white text-black font-bold uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-colors">
                    {savingProduct ? "Saving..." : (editingProductId ? "Update Product" : "Publish Product")}
                  </button>
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProductId(null);
                        setNewProduct({ name: "", slug: "", description: "", price: "", comparePrice: "", category: "Hoodies", imageUrls: "", stockCount: "100" });
                      }}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Current Products</h2>
                <button onClick={fetchProducts} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  Refresh
                </button>
              </div>

              {loadingProducts ? (
                <div className="py-12 text-center text-xs text-white/50">Loading products...</div>
              ) : productsList.length === 0 ? (
                <div className="py-12 text-center text-sm text-white/50">No products found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase text-[9px] tracking-[0.2em]">
                        <th className="py-4 px-4 font-semibold">Name</th>
                        <th className="py-4 px-4 font-semibold">Category</th>
                        <th className="py-4 px-4 font-semibold">Price</th>
                        <th className="py-4 px-4 font-semibold">Stock</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                        <th className="py-4 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {productsList.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-white">{prod.name}</td>
                          <td className="py-4 px-4">{prod.category}</td>
                          <td className="py-4 px-4 text-emerald-400 font-semibold">Rs. {prod.price.toLocaleString()}</td>
                          <td className="py-4 px-4">{prod.stockCount}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-wider font-bold ${prod.inStock ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400'}`}>
                              {prod.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => {
                                setEditingProductId(prod.id);
                                setNewProduct({
                                  name: prod.name,
                                  slug: (prod as any).slug || "",
                                  description: (prod as any).description || "",
                                  price: prod.price.toString(),
                                  comparePrice: (prod as any).comparePrice?.toString() || "",
                                  category: prod.category,
                                  imageUrls: (prod as any).images?.join(", ") || "",
                                  stockCount: prod.stockCount.toString()
                                });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white transition-colors"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            </>
          )}

          {/* TAB: COUPONS */}
          {activeTab === "coupons" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl h-fit">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">Create Coupon</h2>
                <form onSubmit={handleAddCoupon} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Promo Code</label>
                    <input required type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl uppercase tracking-widest focus:border-white/40 outline-none transition-colors" placeholder="e.g. SUMMER20" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Discount Type</label>
                      <select value={newCoupon.type} onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors text-xs">
                        <option value="percent">Percentage (%)</option>
                        <option value="amount">Fixed Amount (Rs.)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Value</label>
                      <input required type="number" value={newCoupon.value} onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Min Order Amount (Rs.)</label>
                    <input type="number" value={newCoupon.minAmount} onChange={(e) => setNewCoupon({...newCoupon, minAmount: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl focus:border-white/40 outline-none transition-colors" />
                  </div>
                  <button type="submit" className="w-full py-4 mt-2 bg-white text-black font-bold uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-colors">
                    Generate Code
                  </button>
                </form>
              </div>

              <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">Active Campaigns</h2>
                {loadingCoupons ? (
                  <p className="text-xs text-white/50">Loading...</p>
                ) : couponsList.length === 0 ? (
                  <p className="text-xs text-white/50">No active coupons.</p>
                ) : (
                  <div className="space-y-3">
                    {couponsList.map((c) => (
                      <div key={c.id} className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                        <div>
                          <p className="font-bold text-sm tracking-widest text-white">{c.code}</p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                            {c.discountPercent ? `${c.discountPercent}% OFF` : `Rs. ${c.discountAmount} OFF`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold rounded-lg ${c.isActive ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Customer Reviews</h2>
                <button onClick={fetchReviews} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  Refresh
                </button>
              </div>

              {loadingReviews ? (
                <div className="py-12 text-center text-xs text-white/50">Loading reviews...</div>
              ) : reviewsList.length === 0 ? (
                <div className="py-12 text-center text-sm text-white/50">No reviews found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase text-[9px] tracking-[0.2em] whitespace-nowrap">
                        <th className="py-4 px-4 font-semibold">Date</th>
                        <th className="py-4 px-4 font-semibold">Product</th>
                        <th className="py-4 px-4 font-semibold">User</th>
                        <th className="py-4 px-4 font-semibold">Rating</th>
                        <th className="py-4 px-4 font-semibold w-1/3">Comment</th>
                        <th className="py-4 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reviewsList.map((rev) => (
                        <tr key={rev.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-white/60 whitespace-nowrap">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 font-medium text-white whitespace-nowrap">{rev.productName}</td>
                          <td className="py-4 px-4 text-white/60 whitespace-nowrap">{rev.userEmail}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} className={i >= rev.rating ? "text-white/20" : ""} />
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white/80 min-w-[200px]">{rev.comment || "-"}</td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="text-[10px] uppercase tracking-widest font-bold text-red-400/70 hover:text-red-400 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-neutral-900/40 border border-white/5 p-6 md:p-8 rounded-2xl max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">Staff Access</h2>
              {loadingUsers ? (
                <p className="text-xs text-white/50">Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase text-[9px] tracking-[0.2em]">
                        <th className="py-4 px-4 font-semibold">Name</th>
                        <th className="py-4 px-4 font-semibold">Email</th>
                        <th className="py-4 px-4 font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-white font-medium">{u.name}</td>
                          <td className="py-4 px-4 text-white/60">{u.email}</td>
                          <td className="py-4 px-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={u.id === user.id}
                              className={`bg-black border rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest focus:outline-none transition-colors ${
                                u.role === 'admin' 
                                  ? 'border-amber-400/30 text-amber-400' 
                                  : 'border-white/10 text-white/70'
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
      </main>
    </div>
  );
}
