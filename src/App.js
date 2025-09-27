import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Alert
} from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import { useState } from "react";
//  import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  window.addEventListener("online", () => setIsOnline(true));
  window.addEventListener("offline", () => setIsOnline(false));

  const [show, setShow] = useState(false);


  
  const[ amount, setAmount ] = useState(0);
  const[newAmount, setNewAmount] = useState();

  const [creditButton ,setCreditButton] = useState(false);
  const [debitButton ,setDebitButton] = useState(false);

  const [creditAmount ,setCreditAmount] = useState(0);
  const [debitAmount ,setDebitAmount] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleAmountChange = (e) => {
    e.preventDefault();
    handleClose();
    
  }


  // const transactions = [
  //   { id: 1, name: "Coffee", amount: -3, icon: "☕" },
  //   { id: 2, name: "Rent", amount: -500, icon: "🏠" },
  //   { id: 3, name: "Salary", amount: 1800, icon: "💵" },
  //   { id: 4, name: "Groceries", amount: -50, icon: "🥖" },
  //   { id: 1, name: "Coffee", amount: -3, icon: "☕" },
  //   { id: 2, name: "Rent", amount: -500, icon: "🏠" },
  //   { id: 3, name: "Salary", amount: 1800, icon: "💵" },
  //   { id: 4, name: "Groceries", amount: -50, icon: "🥖" },
  // ];

  const [transactions, setTransactions] = useState([]);
  return (
    <>
      <Container
        style={{
          minWidth: "400px",
          marginTop: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          padding: "10",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "20px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h4>
            <span role="img" aria-label="wallet">
              👛
            </span>{" "}
            Finance App
          </h4>
        </div>

        <Card style={{ border: "none", borderRadius: "0" }}>
          <Card.Body>
            {/* Balance */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>${amount}</h2>
              <Badge bg={isOnline ? "success" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            {/* Dashboard */}
            <h5>Dashboard</h5>
            <Row className="mb-3">
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Income</Card.Title>
                    <Card.Text>${creditAmount}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Expenses</Card.Title>
                    <Card.Text>${debitAmount}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Trends */}
            <h5>Trends</h5>
            <div
              style={{
                height: "50px",
                backgroundColor: "#e9ecef",
                borderRadius: "5px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#007bff" }}>📈 Trend Chart</span>
            </div>

            {/* Transactions */}
            <h5>Transactions</h5>
            <ListGroup
              variant=""
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              { transactions.length>0 ? transactions.map((tx) => (
                <ListGroup.Item
                  key={tx.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>
                      {tx.icon}
                    </span>
                    {tx.name}
                  </div>
                  <div style={{ color: tx.amount < 0 ? "red" : "green" }}>
                    {tx.amount < 0
                      ? `- $${Math.abs(tx.amount)}`
                      : `+ $${tx.amount}`}
                  </div>
                </ListGroup.Item>
              )):<Alert variant="info">No transactions available</Alert>}
            </ListGroup>

            <Button
              variant="primary"
              className="mt-3 w-100"
              onClick={handleShow}
            >
              <PlusCircle /> Add Transaction
            </Button>
            <>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Type(used for)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Coffee, Salary"
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Credited or Debited</Form.Label><br></br>
                      <Button variant={creditButton?"success":"outline-success"} className="me-2" onClick={()=>{
                        setCreditButton(true);
                        setDebitButton(false);
                      }} >Credited</Button>
                      <Button variant={debitButton?"danger":"outline-danger"} onClick={()=>{
                        setDebitButton(true);
                        setCreditButton(false);
                      }}>Debited</Button>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        value={newAmount}
                        onChange={(e)=>setNewAmount(e.target.value)}
                        placeholder="+ 100 for income, - 50 for expense"
                        autoFocus
                      />
                    </Form.Group>
                    
                    
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleAmountChange}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default App;
