const validateProduct = (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    // Sanitize inputs
    req.body.name = name?.trim();
    req.body.description = description?.trim();
    req.body.category = category?.toLowerCase().trim();

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (typeof price !== "number" || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    if (inStock !== undefined && typeof inStock !== "boolean") {
      return res.status(400).json({ error: "inStock must be a boolean" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateProduct;
