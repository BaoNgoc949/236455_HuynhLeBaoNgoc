
import { useCallback, useEffect, useState } from "react";
import "./App.css";

const emptyForm = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "Việt Nam",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadFoods = useCallback(async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("search", keyword.trim());

      const response = await fetch(`/api/foods?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Không thể tải danh sách món ăn.");
      }

      setFoods(Array.isArray(data) ? data : data.data || data.foods || []);
    } catch (err) {
      setError(err.message || "Không thể kết nối đến backend.");
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editFood(food) {
    setEditingId(food._id);
    setForm({
      foodId: food.foodId || "",
      name: food.name || "",
      category: food.category || "",
      cuisine: food.cuisine || "",
      ingredients: Array.isArray(food.ingredients)
        ? food.ingredients.join(", ")
        : "",
      price: food.price ?? "",
      quantity: food.quantity ?? "",
      description: food.description || "",
      imageUrl: food.imageUrl || "",
    });

    setMessage("");
    document.getElementById("food-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      foodId: form.foodId.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      ingredients: form.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      const response = await fetch(
        editingId ? `/api/foods/${editingId}` : "/api/foods",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Không thể lưu món ăn.");
      }

      setMessage(editingId ? "Đã cập nhật món ăn!" : "Đã thêm món ăn!");
      resetForm();
      await loadFoods(search);
    } catch (err) {
      setError(err.message || "Có lỗi khi lưu món ăn.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFood(food) {
    const confirmed = window.confirm(
      `Cậu có chắc muốn xóa món "${food.name}" không?`
    );
    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/foods/${food._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Không thể xóa món ăn.");
      }

      setMessage(`Đã xóa món "${food.name}".`);
      await loadFoods(search);
    } catch (err) {
      setError(err.message || "Có lỗi khi xóa món ăn.");
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadFoods(search);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-icon">🍜</div>
        <div>
          <p className="eyebrow">FOOD MANAGEMENT SYSTEM</p>
          <h1>Quản lý món ăn</h1>
          <p className="subtitle">
            Quản lý thực đơn, giá bán và số lượng món ăn của bạn.
          </p>
        </div>
      </header>

      <section className="stats">
        <article className="stat-card">
          <span className="stat-icon">🍽️</span>
          <div>
            <p>Tổng số món</p>
            <strong>{foods.length}</strong>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p>Tổng số lượng</p>
            <strong>
              {foods.reduce((sum, food) => sum + (Number(food.quantity) || 0), 0)}
            </strong>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p>Giá trung bình</p>
            <strong className="average-price">
              {foods.length
                ? formatPrice(
                    foods.reduce(
                      (sum, food) => sum + (Number(food.price) || 0),
                      0
                    ) / foods.length
                  )
                : "0 ₫"}
            </strong>
          </div>
        </article>
      </section>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Danh sách món ăn</h2>
            <p>Tìm kiếm và quản lý các món trong thực đơn.</p>
          </div>
          <button
            className="button button-primary"
            onClick={() => {
              resetForm();
              setMessage("");
              document.getElementById("food-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            + Thêm món ăn
          </button>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            aria-label="Tìm kiếm món ăn"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, danh mục hoặc ẩm thực..."
          />
          <button className="button button-dark" type="submit">
            Tìm kiếm
          </button>
          <button
            className="button button-light"
            type="button"
            onClick={() => {
              setSearch("");
              loadFoods("");
            }}
          >
            Làm mới
          </button>
        </form>

        {loading ? (
          <div className="state-message">Đang tải danh sách món ăn...</div>
        ) : foods.length === 0 ? (
          <div className="state-message">
            Chưa có món ăn phù hợp. Cậu hãy thử từ khóa khác nhé!
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Món ăn</th>
                  <th>Mã món</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <div className="food-name">
                        <div className="food-avatar">🍲</div>
                        <div>
                          <strong>{food.name}</strong>
                          <span>{food.cuisine}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="food-code">{food.foodId}</span>
                    </td>
                    <td>
                      <span className="category-tag">{food.category}</span>
                    </td>
                    <td className="price">{formatPrice(food.price)}</td>
                    <td>{food.quantity}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="button button-edit"
                          onClick={() => editFood(food)}
                        >
                          Sửa
                        </button>
                        <button
                          className="button button-delete"
                          onClick={() => deleteFood(food)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="table-footer">
          Đang hiển thị {foods.length} món ăn
        </p>
      </section>

      <section className="panel form-panel" id="food-form">
        <div className="panel-heading">
          <div>
            <h2>{editingId ? "Cập nhật món ăn" : "Thêm món ăn mới"}</h2>
            <p>Nhập thông tin món ăn bên dưới.</p>
          </div>
          {editingId && (
            <button className="button button-light" onClick={resetForm}>
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Mã món ăn *
              <input
                name="foodId"
                value={form.foodId}
                onChange={handleChange}
                placeholder="Ví dụ: FOOD004"
                required
              />
            </label>
            <label>
              Tên món ăn *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên món ăn"
                required
              />
            </label>
            <label>
              Danh mục *
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Ví dụ: Món nước"
                required
              />
            </label>
            <label>
              Ẩm thực *
              <input
                name="cuisine"
                value={form.cuisine}
                onChange={handleChange}
                placeholder="Ví dụ: Việt Nam"
                required
              />
            </label>
            <label>
              Giá bán (VNĐ) *
              <input
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Số lượng *
              <input
                type="number"
                name="quantity"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </label>
            <label className="full-width">
              Nguyên liệu
              <input
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
                placeholder="Phân cách bằng dấu phẩy, ví dụ: Bánh phở, Thịt bò"
              />
            </label>
            <label className="full-width">
              Đường dẫn hình ảnh
              <input
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/food.jpg"
              />
            </label>
            <label className="full-width">
              Mô tả
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả món ăn..."
              />
            </label>
          </div>
          <div className="form-actions">
            <button className="button button-light" type="button" onClick={resetForm}>
              Xóa nội dung
            </button>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving
                ? "Đang lưu..."
                : editingId
                  ? "Lưu thay đổi"
                  : "Thêm món ăn"}
            </button>
          </div>
        </form>
      </section>

      <footer>Food Management System · React + Express + MongoDB</footer>
    </main>
  );
}

export default App;
