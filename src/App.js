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
import { useState,useEffect } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  window.addEventListener("online", () => setIsOnline(true));
  window.addEventListener("offline", () => setIsOnline(false));

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [creditAmount ,setCreditAmount] = useState(0);
  const [debitAmount ,setDebitAmount] = useState(0);

  
  const[ amount, setAmount ] = useState(0);
  const[newAmount, setNewAmount] = useState();

  const [creditButton ,setCreditButton] = useState(false);
  const [debitButton ,setDebitButton] = useState(false);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [transactions, setTransactions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(()=>{
    const data = {
      labels: ["Credit", "Debit"],
      datasets: [
        {
          data: [creditAmount || 0, debitAmount || 0], // Example values
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)", // Credit
            "rgba(255, 99, 132, 0.7)"  // Debit
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)"
          ],
          borderWidth: 1
        }
      ]
    };
    setData(data);
  },[creditAmount,debitAmount]);

  const handleAmountChange = (e) => {
    
    e.preventDefault();
    handleClose();
    if(creditButton && newAmount>0){
      setCreditAmount(creditAmount + parseInt(newAmount));
      setAmount(amount + parseInt(newAmount));
    }
    else if(debitButton){
      setDebitAmount(debitAmount + Math.abs(parseInt(newAmount)));
      setAmount(amount - parseInt(newAmount));
    }
    else{
      alert("Please enter a valid amount");
    }
    const newTransaction = {
      id: transactions.length + 1,
      name: (transactions.length + 1)+" - "+name,
      amount: parseInt(newAmount),
      type: creditButton ? "credit" : "debit",
      icon: creditButton ? "💵" : "🛒",
    };
    setTransactions([newTransaction, ...transactions]);
    setNewAmount(0);
    setCreditButton(false);
    setDebitButton(false);
    setName("");
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
            <h5>Income Distribution Chart</h5>
            {amount>0 || amount <0 ? (
            <div
              style={{
                height: "300px",
                backgroundColor: "#e9ecef",
                borderRadius: "5px",
                marginBottom: "10px",
                display: "flex",
                padding: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <div style={{ height: "250px", marginBottom: "20px" }}>
                {data.datasets?.length > 0 && <Pie data={data} />}
              </div>
               
            </div>):
            (
              <Alert variant="info">No data available for chart</Alert>
             )}

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
                  <div style={{ color: tx.type === "debit" ? "red" : "green" }}>
                    {tx.type === "debit" ?
                       `- $${Math.abs(tx.amount)}`
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
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
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
