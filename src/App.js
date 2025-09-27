import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import {useState} from 'react';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));



  const transactions = [
    { id: 1, name: "Coffee", amount: -3, icon: "☕" },
    { id: 2, name: "Rent", amount: -500, icon: "🏠" },
    { id: 3, name: "Salary", amount: 1800, icon: "💵" },
    { id: 4, name: "Groceries", amount: -50, icon: "🥖" },
    { id: 1, name: "Coffee", amount: -3, icon: "☕" },
    { id: 2, name: "Rent", amount: -500, icon: "🏠" },
    { id: 3, name: "Salary", amount: 1800, icon: "💵" },
    { id: 4, name: "Groceries", amount: -50, icon: "🥖" },
  ];

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
            <h2>$1,200</h2>
            <Badge bg={isOnline ? 'success':'secondary'}>{isOnline ? 'Online':'Offline'}</Badge>
          </div>

          {/* Dashboard */}
          <h5>Dashboard</h5>
          <Row className="mb-3">
            <Col>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Income</Card.Title>
                  <Card.Text>$1,800</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Expenses</Card.Title>
                  <Card.Text>$600</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>


          {/* Trends */}
          <h5>Trends</h5>
          <div style={{ height: "50px", backgroundColor: "#e9ecef", borderRadius: "5px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#007bff" }}>📈 Trend Chart</span>
          </div>

          {/* Transactions */}
          <h5>Transactions</h5>
          <ListGroup variant="" style={{ maxHeight: "200px", overflowY: "auto"}}>
            {transactions.map(tx => (
              <ListGroup.Item key={tx.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>{tx.icon}</span>
                  {tx.name}
                </div>
                <div style={{ color: tx.amount < 0 ? "red" : "green" }}>
                  {tx.amount < 0 ? `- $${Math.abs(tx.amount)}` : `+ $${tx.amount}`}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          
          <Button variant="primary" className="mt-3 w-100"><PlusCircle /> Add Transaction</Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default App;
