const axios = require("axios");

async function addNewOcdConsignment(
  email,
  consignmentName,
  brandName,
  orderId
) {
  try {
    const r = await axios.post("https://api.phirlo.in/graphql", {
      query: `mutation addOcdBrandConsignments($brandCustomer:String!,$consignmentName:String!,$brandName:String!,$orderId:String!,$quantity:Int!,$status:String!) {
                addOcdBrandConsignments(brandCustomer:$brandCustomer,consignmentName:$consignmentName,brandName:$brandName,orderId:$orderId,quantity:$quantity,consignmentStatus:$status){
                    brandConsignments{
                      consignmentId
                    }
                  }
              }
              
              `,
      variables: {
        brandCustomer: email,
        consignmentName,
        brandName,
        orderId: orderId,
        quantity: 15,
        status: "Requested",
      },
    });

    const errors = r.data.errors;
    console.log("Consignment errors", errors);
    if (errors) {
      return false;
    } else {
      console.log(r.data.data);
      return r.data.data;
    }
  } catch (e) {
    console.log(e);
    if (e.response && e.response.data) {
      console.log(e.response.data);
      return false;
    }
  }
}

module.exports = addNewOcdConsignment;
