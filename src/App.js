import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Alert,
  Tab,
  Tabs,
} from "react-bootstrap";
import { PlusCircle, Sun, Moon } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const [transactions, setTransactions] = useState(storedTransactions);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [theme, setTheme] = useState("light");
  const [show, setShow] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [name, setName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [creditButton, setCreditButton] = useState(false);
  const [debitButton, setDebitButton] = useState(false);

  const [creditAmount, setCreditAmount] = useState(
    storedTransactions.filter(tx => tx.type === "credit").reduce((acc, tx) => acc + tx.amount, 0)
  );
  const [debitAmount, setDebitAmount] = useState(
    storedTransactions.filter(tx => tx.type === "debit").reduce((acc, tx) => acc + Math.abs(tx.amount), 0)
  );
  const [amount, setAmount] = useState(creditAmount - debitAmount);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  // Online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Chart data
  useEffect(() => {
    setData({
      labels: ["Credit", "Debit"],
      datasets: [
        {
          data: [creditAmount || 0, debitAmount || 0],
          backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    });
  }, [creditAmount, debitAmount]);

  // Dark mode
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
  }, [theme]);
  const toggleDarkMode = () => setTheme(theme === "dark" ? "light" : "dark");

  // Loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseReset = () => setShowReset(false);
  const handleShowReset = () => setShowReset(true);
  const handleReset = () => {
    localStorage.clear();
    setTransactions([]);
    setAmount(0);
    setCreditAmount(0);
    setDebitAmount(0);
    handleCloseReset();
  };

  const handleAmountChange = (e) => {
    e.preventDefault();
    handleClose();
    if (!creditButton && !debitButton) return alert("Please select Credit or Debit");

    const parsedAmount = parseInt(newAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return alert("Enter a valid amount");

    const type = creditButton ? "credit" : "debit";
    const icon = creditButton ? "💵" : "🛒";

    const newTransaction = {
      id: transactions.length + 1,
      name: `${transactions.length + 1} - ${name}`,
      amount: parsedAmount,
      type,
      icon,
    };

    localStorage.setItem("transactions", JSON.stringify([newTransaction, ...transactions]));
    setTransactions([newTransaction, ...transactions]);

    if (creditButton) {
      setCreditAmount(prev => prev + parsedAmount);
      setAmount(prev => prev + parsedAmount);
    } else {
      setDebitAmount(prev => prev + parsedAmount);
      setAmount(prev => prev - parsedAmount);
    }

    setNewAmount("");
    setName("");
    setCreditButton(false);
    setDebitButton(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme === "dark" ? "#121212" : "#f8f9fa",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="p-3" style={{ backgroundColor: theme === "dark" ? "#121212" : "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        {/* Header */}
        <div
          className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div>
            <h4>👛 Finance App</h4>
            <p className="mb-0">Manage your finances effectively</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Button size="sm" variant="light" onClick={handleShowReset}>
              Reset App
            </Button>
            <Button size="sm" variant="secondary" onClick={toggleDarkMode}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultActiveKey="dashboard" id="main-tabs" className="mb-3" fill>
          <Tab eventKey="dashboard" title="Dashboard">
            <Card className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>${amount}</h2>
                <Badge bg={isOnline ? "success" : "secondary"}>
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>

              <Row className="mb-3">
                <Col xs={12} md={6} className="mb-2">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>Income</Card.Title>
                      <Card.Text>${creditAmount}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>Expenses</Card.Title>
                      <Card.Text>${debitAmount}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h5>Income Distribution Chart</h5>
              {amount !== 0 ? (
                <div style={{ maxWidth: "400px", margin: "auto", height: "250px" }}>
                  <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              ) : (
                <Alert variant="info">No data available for chart</Alert>
              )}
            </Card>
          </Tab>

          <Tab eventKey="transactions" title="Transactions">
            <Card className="p-3">
              <ListGroup style={{ maxHeight: "50vh", overflowY: "auto" }}>
                {transactions.length > 0 ? (
                  transactions.map(tx => (
                    <ListGroup.Item key={tx.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>{tx.icon}</span>
                        {tx.name}
                      </div>
                      <div style={{ color: tx.type === "debit" ? "red" : "green" }}>
                        {tx.type === "debit" ? `- $${Math.abs(tx.amount)}` : `+ $${tx.amount}`}
                      </div>
                      <Badge bg="light" text="dark">{tx.type}</Badge>
                    </ListGroup.Item>
                  ))
                ) : (
                  <Alert variant="info">No transactions available</Alert>
                )}
              </ListGroup>
              <Button variant="primary" className="mt-3 w-100" onClick={handleShow}>
                <PlusCircle /> Add Transaction
              </Button>
            </Card>
          </Tab>
        </Tabs>

        {/* Add Transaction Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Type (used for)</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Coffee, Salary"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Credited or Debited</Form.Label>
                <br />
                <Button
                  variant={creditButton ? "success" : "outline-success"}
                  className="me-2"
                  onClick={() => {
                    setCreditButton(true);
                    setDebitButton(false);
                  }}
                >
                  Credited
                </Button>
                <Button
                  variant={debitButton ? "danger" : "outline-danger"}
                  onClick={() => {
                    setDebitButton(true);
                    setCreditButton(false);
                  }}
                >
                  Debited
                </Button>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="+ 100 for income, - 50 for expense"
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

        {/* Reset Modal */}
        <Modal show={showReset} onHide={handleCloseReset}>
          <Modal.Header closeButton>
            <Modal.Title>Reset App</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to clear all data?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReset}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
}

export default App;
