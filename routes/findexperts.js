const express = require("express");
const isAuthenticated = require("../isAuthenticated");
const router = express.Router();
const Expert = require("../models/Expert");

router.get("/findexperts", async (req, res) => {
  try {
    const categorySearched = req.query.category
      ? String(req.query.category)
      : "";

    const subCategorySearched = req.query.subcategory
      ? String(req.query.subcategory)
      : "";

    const priceMin = req.query.priceMin ? Number(req.query.priceMin) : 1;

    const priceMax = req.query.priceMax ? Number(req.query.priceMax) : 500;

    const availability = req.query.availability
      ? String(req.query.availability)
      : "";

    const expertsPerPage = req.query.limit ? Number(req.query.limit) : 2;

    const page = req.query.page ? Number(req.query.page) : 1;

    const skip = expertsPerPage * (page - 1);

    const priceSort = req.query.sort ? String(req.query.sort) : -1;

    if (req.query.sort === "asc" || req.query.sort === "price-asc") {
      priceSort = 1;
    } else if (req.query.sort === "desc" || req.query.sort === "price-desc") {
      priceSort = -1;
    }

    if (Number(req.query.page) === 0) {
      res.status(400).json({ message: "Page start at 1" });
    }

    const expertsFilter = {
      "account.category": new RegExp(categorySearched, "i"),
      "account.subcategory": new RegExp(subCategorySearched, "i"),
      "account.hourlyPrice": { $gte: priceMin, $lte: priceMax },
      "account.activateOffer": true,
    };

    if (availability === "Lundi") {
      expertsFilter["account.availabilities.monday"] = true;
    }
    if (availability === "Mardi") {
      expertsFilter["account.availabilities.tuesday"] = true;
    }
    if (availability === "Mercredi") {
      expertsFilter["account.availabilities.wednesday"] = true;
    }
    if (availability === "Jeudi") {
      expertsFilter["account.availabilities.thursday"] = true;
    }
    if (availability === "Vendredi") {
      expertsFilter["account.availabilities.friday"] = true;
    }
    if (availability === "Samedi") {
      expertsFilter["account.availabilities.saturday"] = true;
    }
    if (availability === "Dimanche") {
      expertsFilter["account.availabilities.sunday"] = true;
    }

    const expertsFiltered = await Expert.find(expertsFilter)
      .limit(expertsPerPage)

      .sort({ "account.hourlyPrice": priceSort })

      .skip(skip);

    const count = await Expert.countDocuments(expertsFilter);

    res.json({
      count: count,
      limit: expertsPerPage,
      experts: expertsFiltered,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/findexpert/:id", async (req, res) => {
  try {
    const expertFinded = await Expert.findOne({ _id: req.params.id });
    res.json(expertFinded);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
