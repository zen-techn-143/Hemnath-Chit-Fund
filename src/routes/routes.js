// src/routesConfig.js
/////////////////////// creations///////////////////////////////////
import CompanyCreation from "../pages/company/CompanyCreation";
import UserCreation from "../pages/users/UserCreation";
import DashBoard from "../pages/DashBoard";
import User from "../pages/users/User";
import Company from "../pages/company/Company";
import Customer from "../pages/customer/Customer";
import CustomerCreations from "../pages/customer/CustomerCreations";
import CustomerDetails from "../pages/customer/CustomerDetails";
import ChitType from "../pages/chittype/chittype";
import ChitTypeCreation from "../pages/chittype/chittypeCreation";
import CustomerBankDetails from "../pages/customer/CustomerBankDetails";

const routes = [
  { path: "/console/dashboard", element: <DashBoard /> },
  { path: "/console/user", element: <User /> },
  { path: "/console/user/create", element: <UserCreation /> },
  { path: "/console/company", element: <Company /> },
  { path: "/console/company/create", element: <CompanyCreation /> },
  { path: "/console/master/customer/create", element: <CustomerCreations /> },
  { path: "/console/master/customer", element: <Customer /> },
  { path: "/console/master/customerdetails", element: <CustomerDetails /> },
 
  { path: "/console/master/chittype", element: <ChitType /> },
  { path: "/console/master/chittype/create", element: <ChitTypeCreation /> },
  
  {
    path: "/console/customer/customerbankdetails",
    element: <CustomerBankDetails />,
  },
];

export default routes;
