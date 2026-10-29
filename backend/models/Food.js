
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
      required: [true, "Mã món ăn là bắt buộc"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Tên món ăn là bắt buộc"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Loại món ăn là bắt buộc"],
      trim: true,
    },
    cuisine: {
      type: String,
      required: [true, "Vùng miền hoặc nền ẩm thực là bắt buộc"],
      trim: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Giá không được âm"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Số lượng không được âm"],
      validate: {
        validator: Number.isInteger,
        message: "Số lượng phải là số nguyên",
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema);
