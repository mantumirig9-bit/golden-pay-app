import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import QRCode from "react-qr-code";
import { Wallet, Bell, Menu, X, User, LayoutDashboard, Landmark, Download, ShieldCheck, MessageSquare, Activity, LogOut, Plus, Clock, CheckCircle, Upload, Headphones, ChevronRight, Mail, Lock, Copy, Smartphone } from "lucide-react";
import "./style.css";

const gold = "gold-gradient";
const FIXED_DEPOSIT_AMOUNT = 999;
const UPI_ID = "gmsm@ptyes";
const UPI_NAME = "Golden Pay";

function makeUpiLink(amount = FIXED_DEPOSIT_AMOUNT) {
  return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR&am=${encodeURIComponent(String(amount))}`;
}

function loadLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function Header({ openMenu }) {
  return <header className="header"><div className="brand"><div className="logo"><Wallet size={28}/></div><h1>GOLDEN PAY</h1></div><div className="top-icons"><Bell/><button onClick={openMenu}><Menu/></button></div></header>;
}

function Card({ children, className="" }) { return <div className={`card ${className}`}>{children}</div>; }

function StatCard({ title, value, subtitle, icon }) {
  return <Card><div className="stat"><div><p className="stat-title">{title}</p><h2>{value}</h2><p className="muted">{subtitle}</p></div><div className="iconbox">{icon}</div></div></Card>;
}

function Input({ label, placeholder, type="text", value, onChange, readOnly=false }) {
  return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly}/></label>;
}

function AuthScreen({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    const finalName = name.trim() || email.split("@")[0] || "User";
    onSignup({ name: finalName, email });
  }

  function googleSignup() {
    onSignup({ name: "Google User", email: "" });
  }

  return <div className="auth-page">
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-logo"><Wallet size={54}/></div>
      <h1>Welcome to Golden Pay</h1>
      <p>Create your account to continue</p>
      <button type="button" className="google-btn" onClick={googleSignup}><span className="google-g">G</span> Sign up with Google</button>
      <div className="divider"><span/> OR <span/></div>
      <label>Name</label>
      <div className="auth-input"><User/><input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/></div>
      <label>Email</label>
      <div className="auth-input"><Mail/><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <label>Password</label>
      <div className="auth-input"><Lock/><input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/></div>
      <button className="auth-submit">Sign up</button>
      <button type="button" className="auth-link">Already have an account? Sign in</button>
    </form>
  </div>;
}

function Dashboard({ setPage, user, transactions }) {
  const recent = transactions.slice(0, 3);
  return <main className="page">
    <Card className="welcome"><p className="big-muted">Welcome back,</p><h2>{user.name} 👋</h2><p className="big-muted">Track your earnings and manage accounts</p><div className="online"><span/> System Online</div></Card>
    <section className="grid2"><StatCard title="Total Earnings" value="₹0" subtitle="Available balance" icon={<Wallet/>}/><StatCard title="Active Accounts" value="0" subtitle="10% commission" icon={<CheckCircle/>}/><StatCard title="Pending" value="2" subtitle="Awaiting activation" icon={<Clock/>}/><StatCard title="Transactions" value={transactions.length} subtitle="All time" icon={<Activity/>}/></section>
    <section className="grid2 actions"><button onClick={()=>setPage("accounts")} className={gold}><Plus/>Add Account</button><button onClick={()=>setPage("withdraw")}><Download/>Withdraw</button><button onClick={()=>setPage("transactions")}><Activity/>History</button><button onClick={()=>setPage("support")}><MessageSquare/>Support</button></section>
    <Card><div className="section-head"><div><h2>Recent Transactions</h2><p>Live earning updates</p></div><button onClick={()=>setPage("transactions")}>View All <ChevronRight size={18}/></button></div>{recent.length ? <div className="transaction-list">{recent.map(tx=><TransactionRow key={tx.id} tx={tx}/>)}</div> : <div className="empty"><Activity/><h3>No transactions yet</h3><p>Your earnings will appear here</p></div>}</Card>
  </main>;
}

function Accounts(){return <main className="page"><h2 className="title">Enter your bank details</h2><Card className="form"><Input label="Account Holder Name" placeholder="As per bank records"/><Input label="Bank Name" placeholder="e.g., State Bank of India"/><Input label="Account Number" placeholder="Enter account number"/><Input label="IFSC Code" placeholder="SBIN0001234"/><Input label="Branch" placeholder="Branch name"/><Input label="Phone Number" placeholder="Enter phone number"/><Input label="UPI ID" placeholder="yourname@upi"/><button className="submit">Add Account</button></Card></main>}
function Deposit({ onSaveDeposit, deposits }){
  const [amount] = useState(FIXED_DEPOSIT_AMOUNT);
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const upiLink = makeUpiLink(amount);
  const pendingTotal = deposits.filter(d=>d.status === "Pending").reduce((sum,d)=>sum + Number(d.amount || 0), 0);

  async function copyUpi() {
    await navigator.clipboard?.writeText(UPI_ID);
    setCopied(true);
    setTimeout(()=>setCopied(false), 1600);
  }

  function submitDeposit(e) {
    e.preventDefault();
    if (!utr.trim()) { alert("Please enter UTR / Transaction ID"); return; }
    onSaveDeposit({ amount, utr: utr.trim(), upiId: UPI_ID, status: "Pending", date: new Date().toLocaleString() });
    setUtr("");
    alert("Deposit saved locally and added to transactions.");
  }

  return <main className="page"><h2 className="title">Security Deposit</h2><p className="subtitle">Fixed security deposit amount</p><section className="grid2"><StatCard title="Verified Deposit" value="₹0" subtitle="" icon={<ShieldCheck/>}/><StatCard title="Pending" value={`₹${pendingTotal || FIXED_DEPOSIT_AMOUNT}`} subtitle="" icon={<Clock/>}/></section><Card className="form" as="form"><form onSubmit={submitDeposit} className="deposit-form"><h2>Add Deposit</h2><div className="qrbox"><h3>Scan & Pay</h3><div className="qr real-qr"><QRCode value={upiLink} size={220} level="M" /></div><button type="button" className="upi-pill" onClick={copyUpi}><Copy size={18}/> UPI ID: {UPI_ID} <small>{copied ? "Copied" : "Tap to copy"}</small></button><a className="pay-btn" href={upiLink}><Smartphone/> Pay using UPI app</a></div><Input label="Amount (₹)" value={amount} readOnly/><Input label="UTR / Transaction ID" placeholder="Enter UTR number" value={utr} onChange={e=>setUtr(e.target.value)}/><button type="button" className="upload"><Upload/> Upload Screenshot</button><button className="submit">Submit Deposit ₹999</button></form></Card></main>}

function TransactionRow({ tx }) {
  return <div className="tx-row"><div className="tx-icon"><Activity/></div><div><h3>{tx.type}</h3><p>{tx.date}</p><p className="tx-note">UTR: {tx.utr}</p></div><div className="tx-right"><strong>₹{tx.amount}</strong><span>{tx.status}</span></div></div>;
}

function Transactions({ transactions }) {
  return <main className="page"><Card><h2 className="title">Transactions</h2>{transactions.length ? <div className="transaction-list">{transactions.map(tx=><TransactionRow key={tx.id} tx={tx}/>)}</div> : <div className="empty"><Activity/><h3>No transactions yet</h3><p>Deposit submissions will appear here</p></div>}</Card></main>;
}
function Support(){return <main className="page"><h2 className="title">Support</h2><p className="subtitle">Get help with your queries</p><button className="submit"><Plus/> New Ticket</button><Card><Headphones className="large-icon"/><h2>Need Quick Help?</h2><p className="muted">Contact us on WhatsApp for faster response</p><div className="whitebar"/></Card>{["29 Apr","28 Apr"].map(d=><Card key={d} className="ticket"><MessageSquare/><div><h2>Account Activation</h2><p>Other · {d}</p><span>Open</span></div></Card>)}</main>}
function SimplePage({title}){return <main className="page"><Card><h2 className="title">{title}</h2><p className="muted">This page is ready for backend integration.</p></Card></main>}
function Sidebar({open, close, setPage, user, onLogout}){const items=[["dashboard","Dashboard",LayoutDashboard],["accounts","Bank Accounts",Landmark],["withdraw","Withdrawal",Download],["deposit","Security Deposit",ShieldCheck],["transactions","Transactions",Activity],["support","Support",MessageSquare]];return <div className={`overlay ${open?'show':''}`}><div className="dim" onClick={close}/><aside><button className="close" onClick={close}><X/></button><div className="brand menu-brand"><div className="logo"><Wallet/></div><div><h1>GOLDEN PAY</h1><p>PREMIUM PARTNER</p></div></div><Card className="profile"><User/><div><h3>{user.name}</h3></div></Card><nav>{items.map(([key,label,Icon])=><button key={key} onClick={()=>{setPage(key);close()}}><Icon/> {label}</button>)}</nav><button className="logout" onClick={onLogout}><LogOut/> Logout</button></aside></div>}
function App(){const[user,setUser]=useState(null);const[page,setPage]=useState('dashboard');const[menu,setMenu]=useState(false);const[deposits,setDeposits]=useState(()=>loadLocal('goldenpay_deposits',[]));const[transactions,setTransactions]=useState(()=>loadLocal('goldenpay_transactions',[]));function saveDeposit(data){const deposit={id:crypto.randomUUID?.() || String(Date.now()),type:'Security Deposit',...data};const tx={...deposit};const nextDeposits=[deposit,...deposits];const nextTransactions=[tx,...transactions];setDeposits(nextDeposits);setTransactions(nextTransactions);localStorage.setItem('goldenpay_deposits',JSON.stringify(nextDeposits));localStorage.setItem('goldenpay_transactions',JSON.stringify(nextTransactions));setPage('transactions')}if(!user)return <AuthScreen onSignup={setUser}/>;const pages={dashboard:<Dashboard setPage={setPage} user={user} transactions={transactions}/>,accounts:<Accounts/>,deposit:<Deposit onSaveDeposit={saveDeposit} deposits={deposits}/>,support:<Support/>,withdraw:<SimplePage title="Withdrawal"/>,transactions:<Transactions transactions={transactions}/>};return <div className="app"><div className="phone"><Header openMenu={()=>setMenu(true)}/>{pages[page]}<Sidebar open={menu} close={()=>setMenu(false)} setPage={setPage} user={user} onLogout={()=>setUser(null)}/></div></div>}

createRoot(document.getElementById("root")).render(<App/>);
