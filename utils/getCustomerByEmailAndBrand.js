const axios = require("axios");

async function addNewOcdCustomer(address, name, email, mobile, brandName) {
  try {
    const r = await axios.post("https://api.phirlo.in/graphql", {
      query: `mutation addOcdBrandCustomer($address:String!,$name:String!,$email:String,$mobile:String,$brandName:String!) {
                addOcdBrandCustomer(address:$address,name:$name,email:$email,mobile:$mobile,brandName:$brandName){
                    brandCustomer{
                        name
                      }
                  }
              }
              
              `,
      variables: {
        address: address,
        name: name,
        email: email,
        mobile: mobile,
        brandName: brandName,
      },
    });

    const errors = r.data.errors;
    console.log("Customer errors", errors);
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

module.exports = addNewOcdCustomer;
