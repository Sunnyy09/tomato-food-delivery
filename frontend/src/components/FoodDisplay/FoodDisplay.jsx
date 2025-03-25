import React, { useEffect, useState } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { toast } from "react-toastify";
import { apiURL } from "../../../constants/backendUrl";
import axios from "axios";

const FoodDisplay = ({ category }) => {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/food/food-lists`);
        if (response.data.success) {
          setFoodList(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
          toast.error("Unexpected API response");
        }
      } catch (error) {
        console.error(
          "Error fetching food lists:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch food lists. Check console for details.");
      }
    };

    fetchFoodList();
  }, []);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {foodList
          .filter((item) => category === "All" || item.category === category)
          .map((item) => (
            <FoodItem
              key={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
              id={item._id}
            />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
