const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bp = require("body-parser");
const addNewOcdCustomer = require("./utils/getCustomerByEmailAndBrand");
const addNewOcdConsignment = require("./utils/addNewConsignment");
const app = express();
app.use(bp.json());
const port = process.env.PORT || 5000;

app.use(cors());

async function getOrderMetaField(order_id) {
  return await axios.get(
    `https://phirlo-test-store.myshopify.com/admin/api/2022-10/orders/${order_id}/metafields.json`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": "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",
      },
    }
  );
}

// get formatted shipping address

const getFormattedAddressAndCustomerDetail = (
  address1,
  address2,
  first_name,
  last_name,
  country,
  city,
  zip,
  email,
  phone
) => {
  let address = `${address1} ${address2} ${first_name} ${last_name} ${country} ${city} ${zip}`;
  let customer_info = {
    name: `${first_name} ${last_name}`,
    email: email,
    phone: phone,
  };
  return { address, customer_info };
};

app.post("/webhook", async (req, res) => {
  const data = req.body;
  const { id } = req.body;
  const isPhirloUser = await getOrderMetaField(id);
  console.log(isPhirloUser.data.metafields);
  const metaField = isPhirloUser.data.metafields;
  if (metaField.length > 0 || metaField[0].ocd_declutter === "ocd_declutter") {
    let details = getFormattedAddressAndCustomerDetail(
      data.shipping_address.address1,
      data.shipping_address.address2,
      data.shipping_address.first_name,
      data.shipping_address.last_name,
      data.shipping_address.country,
      data.shipping_address.city,
      data.shipping_address.zip,
      data.customer.email,
      data.customer.phone
    );
    console.log(details);
    const newCustomer = await addNewOcdCustomer(
      details.address,
      details.customer_info.name,
      details.customer_info.email,
      details.customer_info.phone
        ? details.customer_info.phone.replace("+91", "")
        : "NIL",
      "Phirlo Test Store"
    );

    const newConsignment = await addNewOcdConsignment(
      details.customer_info.email
        ? details.customer_info.email
        : details.customer_info.phone.replace("+91", ""),
      `${details.customer_info.name}'s OCD Consignment #${data.id}`,
      "Phirlo Test Store",
      id
    );
    console.log(newConsignment);
  } else {
    console.log("Not a OCD Order");
  }
  res.status(200).send("OK");
});

exports.webhook = app;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
