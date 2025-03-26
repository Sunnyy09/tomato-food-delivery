import { Food } from "../models/foodModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getFoodLists = async (req, res) => {
  try {
    const foodList = await Food.find({});
    if (!foodList) {
      return res
        .status(400)
        .json({ message: "Food list is empty, Try again by adding new FOOD!" });
    }
    res.status(200).json({
      success: true,
      data: foodList,
      message: "FOOD list fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "ERROR in fetched FOOD list" });
  }
};

const addFood = async (req, res) => {
  console.log("🟢 Request Body:", req.body);
  console.log("🟢 Uploaded File:", req.file);

  const { name, description, price, category } = req.body;
  if (
    [name, description, price, category].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const existedFood = await Food.findOne({ name });
  if (existedFood) {
    return res.status(409).json({ message: "Food is already existed!" });
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    return res.status(400).json({ message: "Image file path is required!" });
  }

  const uploadedImage = await uploadOnCloudinary(imageLocalPath);
  if (!uploadedImage) {
    return res
      .status(500)
      .json({ message: "Error during upload image on Cloundinary" });
  }

  const newFood = await Food.create({
    name,
    description,
    price,
    category,
    image: uploadedImage.url,
  });

  return res
    .status(201)
    .json({ newFood, message: "new FOOD is added successfully!" });
};

const removeFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const foodToDelete = await Food.findById(foodId);
    if (!foodToDelete) {
      return res
        .status(400)
        .json({ message: "FOOD is not existed to remove from the list" });
    }

    await foodModel.findByIdAndDelete(foodId);
    res
      .status(200)
      .json({ success: true, message: "FOOD removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "ERROR in removing the FOOD from DB" });
  }
};

export { getFoodLists, addFood, removeFood };
