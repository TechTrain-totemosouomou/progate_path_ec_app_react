import express from "express";
import {getProductsByIds, searchProducts} from "@/models/product";
import {UnauthorizedError} from "@/lib/errors";
import {DEFAULT_FILTER, DEFAULT_PAGE} from "@/constants";

export const router = express.Router();

router.get("/search", async (req, res) => {
  const currentUser = req.currentUser;
  if (!currentUser) {
    throw new UnauthorizedError();
  }

  const filter = req.query["filter"]
    ? String(req.query["filter"])
    : DEFAULT_FILTER;
  const page = req.query["page"] ? Number(req.query["page"]) : DEFAULT_PAGE;

  const data = await searchProducts(filter, page, currentUser.id);

  res.json(data);
});

router.get("/", async (req, res) => {
  const currentUser = req.currentUser;
  if (!currentUser) {
    throw new UnauthorizedError();
  }

  const query = req.query["productIds"];
  if (!query) {
    res.json([]);
    return;
  }

  const productIds = String(query)
    .split(",")
    .map(id => Number(id));
  const products = await getProductsByIds(currentUser.id, productIds);

  res.json(products);
});
