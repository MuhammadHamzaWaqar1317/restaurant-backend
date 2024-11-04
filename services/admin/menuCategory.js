const { io } = require("../../socket");
const { MenuCategory } = require("../../models/menuCategory");
const { Menu } = require("../../models/menu");

exports.getMenuCategory = async (req, res) => {
  try {
    const result = await MenuCategory.find({});

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.addMenuCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const result = await MenuCategory.create({
      category,
    });
    io.emit("menu_category_added", result);

    res
      .status(200)
      .send({ message: "Menu Category added Successfully", result });
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Category already exists" });
  }
};

exports.updateMenuCategory = async (req, res) => {
  try {
    const { category, _id } = req.body;

    const result = await MenuCategory.updateOne(
      { _id },
      {
        category,
      }
    );
    io.emit("menu_category_updated", { category, _id });

    res
      .status(200)
      .send({ message: "Menu Category updated Successfully", result });
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Category already exists" });
  }
};

exports.deleteMenuCategory = async (req, res) => {
  try {
    const { _id } = req.query;

    const result = await MenuCategory.deleteOne({ _id });
    const deleteCategoryMenuItems = await Menu.deleteMany({ categoryId: _id });
    io.emit("menu_category_deleted", { _id });

    res.status(200).send({ message: "Menu Category deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
