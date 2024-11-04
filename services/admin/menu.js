const { Menu } = require("../../models/menu");
const { io } = require("../../socket");

exports.getMenu = async (req, res) => {
  try {
    const result = await Menu.aggregate([
      {
        $group: {
          _id: "$categoryId",
          items: {
            $push: {
              name: "$name",
              price: "$price",
              description: "$description",
              categoryId: "$categoryId",
              img: "$img",
              _id: "$_id",
            },
          },
        },
      },
    ]);

    const categorizedMenu = result?.reduce((acc, item) => {
      acc[item._id] = item.items;
      return acc;
    }, {});

    res.status(200).send(categorizedMenu);
  } catch (error) {
    console.log(error);
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, categoryId, description, price, img } = req.body;
    const result = await Menu.create({
      name,
      categoryId,
      description,
      price,
      img,
    });
    io.emit("menu_item_added", result);

    res.status(200).send({ message: "Item added Successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, categoryId, description, price, _id, img } = req.body;
    const result = await Menu.updateOne(
      { _id },
      { name, categoryId, description, price, img }
    );
    io.emit("menu_item_updated", req.body);

    res.status(200).send({ message: "Item Updated Successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { _id, categoryId } = req.query;
    console.log("id delete ", _id);

    const result = await Menu.deleteOne({ _id });
    io.emit("menu_item_deleted", { _id, categoryId });

    res.status(200).send({ message: "Item deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
