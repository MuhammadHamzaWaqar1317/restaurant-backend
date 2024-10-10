const { Menu } = require("../../models/menu");
const { io } = require("../../socket");
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
