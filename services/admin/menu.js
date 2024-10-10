const { Menu } = require("../../models/menu");
const { io } = require("../../socket");

exports.getMenu = async (req, res) => {
  try {
    const result = await Menu.find({});

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, category, description, price } = req.body;
    const result = await Menu.create({ name, category, description, price });
    io.emit("menu_item_added", result);

    res.status(200).send({ message: "Item added Successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, category, description, price, _id } = req.body;
    const result = await Menu.updateOne(
      { _id },
      { name, category, description, price }
    );
    io.emit("menu_item_updated", req.body);

    res.status(200).send({ message: "Item added Successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { _id } = req.query;
    console.log("id delete ", _id);

    const result = await Menu.deleteOne({ _id });
    io.emit("menu_item_deleted", _id);

    res.status(200).send({ message: "Item deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
