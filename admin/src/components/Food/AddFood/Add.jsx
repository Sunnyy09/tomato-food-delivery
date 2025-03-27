import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { apiURL } from "../../../../constants/apiURL.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than zero")
      .required("Enter the Price"),
    category: Yup.string().required("Select the category"),
    image: Yup.mixed().required("An Image is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = async (formDataValues) => {
    const formData = new FormData();
    formData.append("name", formDataValues.name);
    formData.append("description", formDataValues.description);
    formData.append("price", Number(formDataValues.price));
    formData.append("category", formDataValues.category);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(`${apiURL}/api/food/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setImage(null);
        toast.success("Food added successfully");
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload. Try again.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt=""
            />
          </label>
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
              setValue("image", e.target.files[0]);
            }}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
          {errors.image && (
            <span className="error">{errors.image.message}</span>
          )}
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            name="name"
            type="text"
            placeholder="Type here"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            name="description"
            type="text"
            rows={6}
            placeholder="Write content here"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span className="error">{errors.description.message}</span>
          )}
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              {...register("category", {
                required: true,
              })}
            >
              {[
                "Salad",
                "Rolls",
                "Deserts",
                "Sandwich",
                "Cake",
                "Pure Veg",
                "Pasta",
                "Noodles",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error">{errors.category.message}</span>
            )}
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="Number"
              name="price"
              placeholder="$25"
              {...register("price", { required: true })}
            />
            {errors.price && (
              <span className="error">{errors.price.message}</span>
            )}
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
