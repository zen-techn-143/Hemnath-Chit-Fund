// import React, { useState } from "react";
// import { Container, Col, Row, Nav, Tab } from "react-bootstrap";
// import CategoryTwo from "../categorytwo/CategoryTwo";
// import ExpenseTwo from "../expensetwo/ExpenseTwo";
// import ExpenseReport from "../expensetwo/ExpenseReport";

// const ExpensePage = () => {
//   const [activeTab, setActiveTab] = useState("category");

//   return (
//     <div>
//       <Container fluid>
//         <Row>
//           <Col lg="12">
//             <div className="page-nav py-3">
//               <span className="nav-list">Expense Management</span>
//             </div>
//           </Col>
//           <Col lg="12">
//             <Tab.Container
//               activeKey={activeTab}
//               onSelect={(k) => setActiveTab(k)}
//             >
//               <Row>
//               <Col lg="12">
//   <Nav variant="tabs" className="flex-row">
//     <Nav.Item>
//       <Nav.Link
//         eventKey="category"
//         style={{ color: "black" }}
//         onMouseEnter={(e) => (e.target.style.backgroundColor = "#041a3b")}
//         onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
//       >
//         Category
//       </Nav.Link>
//     </Nav.Item>

//     <Nav.Item>
//       <Nav.Link
//         eventKey="expense"
//         style={{ color: "black" }}
//         onMouseEnter={(e) => (e.target.style.backgroundColor = "#041a3b")}
//         onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
//       >
//         Expense
//       </Nav.Link>
//     </Nav.Item>

//     <Nav.Item>
//       <Nav.Link
//         eventKey="report"
//         style={{ color: "black" }}
//         onMouseEnter={(e) => (e.target.style.backgroundColor = "#041a3b")}
//         onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
//       >
//         Expense Report
//       </Nav.Link>
//     </Nav.Item>
//   </Nav>
// </Col>

//                 <Col lg="12">
//                   <Tab.Content>
//                     <Tab.Pane eventKey="category">
//                       <CategoryTwo />
//                     </Tab.Pane>
//                     <Tab.Pane eventKey="expense">
//                       <ExpenseTwo />
//                     </Tab.Pane>
//                     <Tab.Pane eventKey="report">
//                       <ExpenseReport />
//                     </Tab.Pane>
//                   </Tab.Content>
//                 </Col>
//               </Row>
//             </Tab.Container>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default ExpensePage;


import React, { useState } from "react";
import { Container, Col, Row, Nav, Tab } from "react-bootstrap";
import CategoryTwo from "../categorytwo/CategoryTwo";
import ExpenseTwo from "../expensetwo/ExpenseTwo";
import ExpenseReport from "../expensetwo/ExpenseReport";
import "./ExpensePage.css"; // add this line
import { useLanguage } from "../../components/LanguageContext";

const ExpensePage = () => {
  const [activeTab, setActiveTab] = useState("category");
   const { t } = useLanguage(); 

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="12">
            <div className="page-nav py-3">
             <span class="nav-list">{t("Expense Management")}</span>
            </div>
          </Col>

          <Col lg="12">
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Row>
                <Col lg="12">
                  <Nav variant="tabs" className="flex-row custom-nav-tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="category">{t("Category")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="expense">{t("Expense")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="report">{t("Expense Report")}</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>

                <Col lg="12">
                  <Tab.Content>
                    <Tab.Pane eventKey="category">
                      <CategoryTwo />
                    </Tab.Pane>
                    <Tab.Pane eventKey="expense">
                      <ExpenseTwo />
                    </Tab.Pane>
                    <Tab.Pane eventKey="report">
                      <ExpenseReport />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ExpensePage;

