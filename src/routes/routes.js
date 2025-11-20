// src/routesConfig.js
/////////////////////// creations///////////////////////////////////
import CompanyCreation from "../pages/company/CompanyCreation";
import UserCreation from "../pages/users/UserCreation";


///////////////////// Pdf preview /////////////////////////////


/////////////////////////////// list ///////////////////////////////
import DashBoard from "../pages/DashBoard";
import User from "../pages/users/User";
import Company from "../pages/company/Company";
import Customer from "../pages/customer/Customer";
import CustomerDetails from "../pages/customer/CustomerDetails";
import Products from "../pages/products/Products";
import ProductsCreation from "../pages/products/ProductsCreation";
import CustomerBankDetails from "../pages/customer/CustomerBankDetails";

const routes = [
  { path: "/console/dashboard", element: <DashBoard /> },
  { path: "/console/user", element: <User /> },
  { path: "/console/user/create", element: <UserCreation /> },
  { path: "/console/company", element: <Company /> },
  { path: "/console/company/create", element: <CompanyCreation /> },
  
  
  { path: "/console/master/customer", element: <Customer /> },
  { path: "/console/master/customerdetails", element: <CustomerDetails /> },
  // { path: "/console/master/bankpledger", element: <BankPledger /> },
  // {
  //   path: "/console/master/bankpledger/viewdetails",
  //   element: <BankPledgerViewDetails />,
  // },
  // {
  //   path: "/console/master/bankpledger/create",
  //   element: <BankPledgerCreation />,
  // },
 
  { path: "/console/master/products", element: <Products /> },
  { path: "/console/master/products/create", element: <ProductsCreation /> },
  
  {
    path: "/console/customer/customerbankdetails",
    element: <CustomerBankDetails />,
  },
];

export default routes;
