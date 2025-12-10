import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./../styles/home.css";

//page home
export default function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

// crear room
  const handleCreateRoom = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    navigate(`/room/${code}`);
  };

  //join room
  const handleJoinRoom = () => {
    if (!roomCode.trim()) return;
    navigate(`/room/${roomCode.trim().toUpperCase()}`);
  };

  return (
    <div className="home-root">

      <div className="home-card">

  <div className="home-logo">KCanvas</div>

 <h1 className="home-title">Draw together in real time.</h1>

  <p className="home-subtitle"> Create a room, share the code with friends, and start drawing together on a shared canvas.</p>

     <div className="home-actions">

 <button className="kc-btn kc-btn-primary" onClick={handleCreateRoom}> Create room  </button>

   <div className="home-join">

     <input
       className="home-input"
       placeholder="Enter room code"
       value={roomCode}
       onChange={(e) => setRoomCode(e.target.value)} />
           
    <button className="kc-btn kc-btn-ghost" onClick={handleJoinRoom}> Join </button>

     </div>
     </div>

   <p className="home-hint"> No login, no accounts! just share the code and start drawing :) </p>

      </div>

    </div>

  );
}
