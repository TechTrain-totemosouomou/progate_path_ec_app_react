import express from "express";
import {body, validationResult} from "express-validator";
import {createOrder, getOrders, getOrder} from "@/models/order";
import {databaseManager} from "@/db";
import {NotFoundError, UnauthorizedError, ValidationError} from "@/lib/errors";

export const router = express.Router();

router.post(
  "/",
  body()
    .isArray()
    .withMessage("body must be an array")
    .bail()
    .isArray({min: 1})
    .withMessage("body must have at least one item"),
  body("*.productId")
    .exists()
    .withMessage("productId is required")
    .bail()
    .isInt()
    .withMessage("productId must be a number")
    .bail()
    .custom(async id => {
      const product = await databaseManager.getInstance().product.findUnique({
        where: {id: Number(id)},
      });
      if (!product) {
        throw new Error("specified product does not exist");
      }
    }),
  body("*.quantity")
    .exists()
    .withMessage("quantity is required")
    .bail()
    .isInt()
    .withMessage("quantity must be a number")
    .bail()
    .isInt({min: 1})
    .withMessage("quantity must be greater than 1"),
  async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) {
      throw new UnauthorizedError();
    }

    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(result.array().map(error => error.msg));
    }

    const orderId = await createOrder(currentUser.id, req.body);
    res.status(200).json({orderId});
  },
);

router.get("/", async (req, res) => {
  const currentUser = req.currentUser;
  if (!currentUser) {
    throw new UnauthorizedError();
  }

  const orders = await getOrders(currentUser.id);
  res.json(orders);
});

router.get("/:id", async (req, res) => {
  const currentUser = req.currentUser;
  if (!currentUser) {
    throw new UnauthorizedError();
  }

  const order = await getOrder(Number(req.params.id));

  if (!order || order.userId !== currentUser.id) {
    throw new NotFoundError();
  }

  res.json(order);
});
