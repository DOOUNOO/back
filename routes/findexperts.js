const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");

router.get("/findexperts", async (req, res) => {
  try {
    const categorySearched = req.query.category;
    const subCategorySearched = req.query.subcategory;

    const expertsPerPage = req.query.limit ? Number(req.query.limit) : 8;

    const page = req.query.page ? Number(req.query.page) : 1;

    const priceMin = req.query.priceMin ? Number(req.query.priceMin) : 1;
    const priceMax = req.query.priceMax ? Number(req.query.priceMax) : 500;

    let priceSort = "";

    if (req.query.sort === "asc" || req.query.sort === "price-asc") {
      priceSort = "asc";
    } else if (req.query.sort === "desc" || req.query.sort === "price-desc") {
      priceSort = "desc";
    }

    if (Number(req.query.page) === 0) {
      res.status(400).json({ message: "Page start at 1" });
    }

    const expertsFiltered = await Expert.find({
      "account.category": new RegExp(categorySearched, "i"),
      "account.subcategory": new RegExp(subCategorySearched, "i"),
      "account.hourlyPrice": { $gte: priceMin, $lte: priceMax },
    })
      .limit(expertsPerPage)

      .skip(expertsPerPage * (page - 1))

      .sort({ hourlyPrice: priceSort })

      .select("account");

    const count = expertsFiltered.length;

    res.json({ count: count, experts: expertsFiltered });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/findexperts/:id", async (req, res) => {
  try {
    const expertFinded = await Expert.findOne({ _id: req.params.id });
    res.json(expertFinded);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
