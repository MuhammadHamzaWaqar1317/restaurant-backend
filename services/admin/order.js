const { Order } = require("../../models/order");
const { User } = require("../../models/user");
const { Menu } = require("../../models/menu");
const { io } = require("../../socket");

exports.addOrder = async (req, res) => {
  try {
    let { order, type, branchId = "" } = req.body;
    console.log(req.body);

    const menuItemsId = order?.map(({ itemId }) => itemId);
    const menu = await Menu.find({ _id: { $in: menuItemsId } }, { img: 0 });
    const customer = await User.findOne({ _id: res.locals._id });
    console.log(menu);

    menu?.forEach((menuItems) => {
      const index = order?.findIndex(
        ({ itemId }) => menuItems._id.toString() == itemId
      );
      console.log(index);

      order[index] = {
        ...order[index],
        price: parseInt(menuItems.price) * order[index].qty,
      };
    });

    const totalBill = order?.reduce(
      (acc, { price }) => acc + parseInt(price),
      0
    );
    console.log(totalBill, typeof totalBill);

    const result = await Order.create({
      type,
      branchId,
      customerId: res.locals._id,
      order,
      status: "Pending",
      totalBill,
    });
    console.log(result);

    io.emit("order_added", {
      ...result.toObject(),
      customerName: customer.name,
    });

    res.status(200).send({ message: "Order Created Successfully" });

    console.log(order);
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res) => {
  try {
    let fetchData = [
      {
        $addFields: {
          customerId: { $toObjectId: "$customerId" },
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails" },
      },
      {
        $addFields: {
          customerName: "$customerDetails.name",
          customerAddress: "$customerDetails.address",
        },
      },
      { $unset: "customerDetails" },
    ];
    if (res.locals.role == "user") {
      const userFetch = {
        $match: {
          customerId: res.locals._id,
        },
      };
      fetchData = [{ ...userFetch }, ...fetchData];
    }
    const result = await Order.aggregate([...fetchData]);
    console.log(result);

    // result.forEach((item) => {
    //   item.toObject();
    // });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, orderId, customerId } = req.body;

    const result = await Order.updateOne({ _id: orderId }, { status });

    io.emit("order_status_update", {
      status,
      orderId,
      customerId,
    });
    res.status(200).send({ message: "Status Updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
