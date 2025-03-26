import { Router } from "express";
import {
  addFood,
  getFoodLists,
  removeFood,
} from "../controllers/foodController.js";
import { upload } from "../middlewares/multer.middleware.js";

const foodRouter = Router();

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/food-lists", getFoodLists);
foodRouter.post("/remove", removeFood);

export default foodRouter;
