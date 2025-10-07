import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Card,
  Button,
  Badge,
  ListGroup,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import {
  PlusCircle,
  Sun,
  Moon,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash,
  Trophy,
  User,
  Edit2,
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import CountUp from "react-countup";
import { startOfWeek, format, addDays, parseISO } from "date-fns";
import "./App.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// --- Transaction Item ---
const TransactionItem = ({ tx, onDelete }) => {
  const isDebit = tx.type === "debit";
  return (
    <Card
      className={`mb-2 transaction-item ${isDebit ? "debit" : "credit"}`}
      style={{ cursor: "pointer" }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center flex-grow-1">
          <div
            className={`icon-circle ${
              isDebit ? "bg-danger" : "bg-success"
            } text-white d-flex align-items-center justify-content-center rounded-circle`}
          >
            {isDebit ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
          </div>
          <div className="ms-3">
            <div className="fw-bold">{tx.name}</div>
            {tx.tags && tx.tags.length > 0 && (
              <div className="text-muted small d-flex flex-wrap gap-1 mt-1">
                {tx.tags.map((tag) => (
                  <Badge key={tag} bg="secondary" className="tag-badge">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div
            className={`me-3 ${isDebit ? "text-danger fw-bold" : "text-success fw-bold"}`}
          >
            {isDebit ? `- $${Math.abs(tx.amount).toFixed(2)}` : `+ $${tx.amount.toFixed(2)}`}
          </div>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(tx.id)}>
            <Trash size={14} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

// --- Goal Item ---
const GoalItem = ({ goal, currentAmount, onDelete }) => {
  const progress = Math.min(100, (currentAmount / goal.amount) * 100);
  const remaining = Math.max(0, goal.amount - currentAmount);

  return (
    <Card className="text-center mb-3">
      <Card.Body>
        <Card.Title>{goal.name}</Card.Title>
        <Card.Text>Target: ${goal.amount.toFixed(2)}</Card.Text>
        <div className="progress mb-2" style={{ height: "10px" }}>
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="mb-2 small">
          {progress >= 100 ? "Goal Achieved!" : `Remaining: $${remaining.toFixed(2)}`}
        </p>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(goal.id)}>Delete Goal</Button>
      </Card.Body>
    </Card>
  );
};

// --- Main App ---
function FinanceApp() {
  const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem("transactions")) || []);
  const [goals, setGoals] = useState(JSON.parse(localStorage.getItem("goals")) || [{ id: 1, name: "Emergency Fund", amount: 5000 }]);
  const [theme, setTheme] = useState("light");
  const [activeView, setActiveView] = useState("dashboard");

  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [tags, setTags] = useState("");
  const [creditButton, setCreditButton] = useState(false);
  const [debitButton, setDebitButton] = useState(false);

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  const [username, setUsername] = useState(localStorage.getItem("username") || "User");

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme; 
  };
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("goals", JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem("username", username); }, [username]);

  const { creditAmount, debitAmount, amount } = useMemo(() => {
    const credit = transactions.filter(tx => tx.type === "credit").reduce((acc, tx) => acc + tx.amount, 0);
    const debit = transactions.filter(tx => tx.type === "debit").reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
    return { creditAmount: credit, debitAmount: debit, amount: credit - debit };
  }, [transactions]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!creditButton && !debitButton) return alert("Select Credit or Debit");
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return alert("Enter a valid amount");
    const type = creditButton ? "credit" : "debit";
    const parsedTags = (tags || '').split(',').map(t => t.trim()).filter(Boolean);
    setLoading(true);
    setTimeout(() => {
      setTransactions([{ id: Date.now(), name: name || (type === "credit" ? "Income" : "Expense"), amount: parsedAmount, type, tags: parsedTags, date: new Date().toISOString() }, ...transactions]);
      setLoading(false);
    }, 300);
    setName(""); setNewAmount(""); setTags(""); setCreditButton(false); setDebitButton(false); setShowAddTx(false);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(goalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return alert("Enter a valid goal amount");
    setGoals([...goals, { id: Date.now(), name: goalName || "New Goal", amount: parsedAmount }]);
    setGoalName(""); setGoalAmount(""); setShowAddGoal(false);
  };

  const handleDeleteTransaction = (id) => setTransactions(transactions.filter(tx => tx.id !== id));
  const handleDeleteGoal = (id) => setGoals(goals.filter(goal => goal.id !== id));

  const handleSaveUsername = () => {
    if (!username.trim()) return alert("Enter a valid name");
    setShowEditUser(false);
  };

  // --- Chart Data ---
  const tagChartData = useMemo(() => {
    const tagTotals = {};
    transactions.filter(tx => tx.type === "debit").forEach(tx => {
      if (tx.tags && tx.tags.length > 0) {
        tx.tags.forEach(tag => {
          if (!tagTotals[tag]) tagTotals[tag] = 0;
          tagTotals[tag] += Math.abs(tx.amount);
        });
      }
    });
    const sortedTags = Object.entries(tagTotals).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return {
      labels: sortedTags.map(([tag]) => tag),
      datasets: [{ data: sortedTags.map(([_,amount])=>amount), backgroundColor: ["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f"], borderWidth:1, hoverOffset:15}]
    };
  }, [transactions]);

  const weeklyChartData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(start, i);
      const dayTotal = transactions.filter(tx => format(parseISO(tx.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd") && tx.type==="debit")
                                   .reduce((sum, tx) => sum + Math.abs(tx.amount),0);
      return { day: format(day, "EEE"), total: dayTotal };
    });
    return { labels: days.map(d => d.day), datasets: [{ label:"Weekly Spending", data: days.map(d=>d.total), backgroundColor:"#f28e2b"}] };
  }, [transactions]);

  // --- Transactions grouped by month ---
  const monthlyTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach(tx => {
      const date = parseISO(tx.date);
      const monthKey = format(date, "MMMM yyyy");
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(tx);
    });
    const sortedKeys = Object.keys(groups).sort((a,b)=>{
      const dateA = new Date(a), dateB = new Date(b);
      return dateB - dateA; // descending
    });
    return sortedKeys.map(key => ({ month: key, transactions: groups[key] }));
  }, [transactions]);

  // --- Render ---
  const renderActiveView = () => {
    if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
    switch(activeView){
      case "dashboard":
        return (
          <>
            <Card className="text-center mb-3">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center">
                    <User size={24} className="me-2" />
                    <div className="fw-bold">Hello, {username}</div>
                    <Button size="sm" variant="outline-secondary" className="ms-2" onClick={()=>setShowEditUser(true)}><Edit2 size={16}/></Button>
                  </div>
                </div>
                <Card.Title>Current Balance</Card.Title>
                <Card.Text className="fs-3">
                  <CountUp end={amount} duration={0.5} prefix="$" separator="," decimals={2} />
                </Card.Text>
              </Card.Body>
            </Card>
            <Row className="mb-3">
              <Col md={6} className="mb-3 mb-md-0">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Status</Card.Title>
                    <Badge bg={navigator.onLine ? "success" : "secondary"}>
                      {navigator.onLine ? "ONLINE" : "OFFLINE"}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Weekly Spending</Card.Title>
                    <Bar data={weeklyChartData} options={{ responsive:true, plugins:{legend:{display:false}}}}/>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
      case "transactions":
        return monthlyTransactions.map(m => (
          <div key={m.month} className="mb-4">
            <h5 className="mb-2">{m.month}</h5>
            {m.transactions.map(tx => <TransactionItem key={tx.id} tx={tx} onDelete={handleDeleteTransaction} />)}
          </div>
        ));
      case "goals":
        return goals.map(goal => <GoalItem key={goal.id} goal={goal} currentAmount={amount} onDelete={handleDeleteGoal} />);
      case "charts":
        return (
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Spending by Tags</Card.Title>
                  <Pie data={tagChartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Weekly Spending</Card.Title>
                  <Bar data={weeklyChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      default: return null;
    }
  };

  return (
    <Container fluid className={`p-4 ${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4>Finance App</h4>
        <Button variant="outline-secondary" onClick={toggleDarkMode}>
          {theme==="light"?<Moon/>:<Sun/>}
        </Button>
      </div>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <Button variant={activeView==="dashboard"?"primary":"outline-primary"} onClick={()=>setActiveView("dashboard")}>Dashboard</Button>
        <Button variant={activeView==="transactions"?"primary":"outline-primary"} onClick={()=>setActiveView("transactions")}>Transactions</Button>
        <Button variant={activeView==="goals"?"primary":"outline-primary"} onClick={()=>setActiveView("goals")}>Goals</Button>
        <Button variant={activeView==="charts"?"primary":"outline-primary"} onClick={()=>setActiveView("charts")}>Charts</Button>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Button variant="success" onClick={()=>setShowAddTx(true)}><PlusCircle/> Add Transaction</Button>
        <Button variant="info" onClick={()=>setShowAddGoal(true)}><Trophy/> Add Goal</Button>
      </div>

      {renderActiveView()}

      {/* Modals */}
      <Modal show={showAddTx} onHide={()=>setShowAddTx(false)}>
        <Modal.Header closeButton><Modal.Title>Add Transaction</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTransaction}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Transaction Name" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" value={newAmount} onChange={e=>setNewAmount(e.target.value)} placeholder="0.00" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control type="text" value={tags} onChange={e=>setTags(e.target.value)} placeholder="food, rent" />
            </Form.Group>
            <div className="mb-3 d-flex gap-2">
              <Button variant={creditButton?"success":"outline-success"} onClick={()=>{ setCreditButton(!creditButton); setDebitButton(false); }}>Credit</Button>
              <Button variant={debitButton?"danger":"outline-danger"} onClick={()=>{ setDebitButton(!debitButton); setCreditButton(false); }}>Debit</Button>
            </div>
            <Button type="submit" className="w-100">Add Transaction</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddGoal} onHide={()=>setShowAddGoal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Goal</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddGoal}>
            <Form.Group className="mb-2">
              <Form.Label>Goal Name</Form.Label>
              <Form.Control type="text" value={goalName} onChange={e=>setGoalName(e.target.value)} placeholder="Goal Name" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Target Amount</Form.Label>
              <Form.Control type="number" value={goalAmount} onChange={e=>setGoalAmount(e.target.value)} placeholder="0.00" />
            </Form.Group>
            <Button type="submit" className="w-100">Add Goal</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditUser} onHide={()=>setShowEditUser(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Username</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e)=>{ e.preventDefault(); handleSaveUsername(); }}>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your name"/>
            </Form.Group>
            <Button type="submit" className="w-100">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default FinanceApp;
