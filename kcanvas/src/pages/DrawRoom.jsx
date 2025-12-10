import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import CanvasBoard from "../components/CanvasBoard";
import Toolbar from "../components/Toolbar";
import "../styles/drawroom.css";

export default function DrawRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  //drawing state
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState("brush"); // brush | highlighter | eraser
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(1);

  // triggers para acciones globales
  const [clearTrigger, setClearTrigger] = useState(0);
  const [downloadTrigger, setDownloadTrigger] = useState(0);

  // ai sketch
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTrigger, setAiTrigger] = useState(0);

  const handleDownload = () => setDownloadTrigger((prev) => prev + 1);

  const handleClear = () => setClearTrigger((t) => t + 1);
  const handleLeaveRoom = () => navigate("/");

  const handleGenerateSketch = () => {

    if (!aiPrompt.trim()) return;

    // esto dispara el efecto en canvasboard useEffect con aiTrigger
    setAiTrigger((t) => t + 1);
  };

  return (
    <div className="room-root">
      <header className="room-header">

        {/* header  */}
        <div className="room-header-top">

          <div className="room-header-left">

            <span className="room-label">Room</span>
            <span className="room-id">{roomId}</span>

          </div>

    <div className="room-header-right">
           
 <button className="kc-btn kc-btn-danger" onClick={handleLeaveRoom}>Leave room</button>
          </div>

        </div>

        {/* input for Ai */}
        <div className="room-ai-row">
          <input
            className="home-input room-ai-input"
            placeholder="Describe the sketch you want (ex. cute cat in space)"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)} />
         
          <button className="kc-btn kc-btn-ghost room-ai-btn" onClick={handleGenerateSketch} >Generate </button>
        </div>

      </header>

      <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        tool={tool}
        setTool={setTool}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        opacity={opacity}
        setOpacity={setOpacity}
        onClear={handleClear}
        onDownload={handleDownload}  />

      <CanvasBoard
        color={color}
        brushSize={brushSize}
        tool={tool}
        backgroundColor={backgroundColor}
        opacity={opacity}
        clearTrigger={clearTrigger}
        downloadTrigger={downloadTrigger}
        roomId={roomId}
        setBackgroundColor={setBackgroundColor}
        // ai props
        aiPrompt={aiPrompt}
        aiTrigger={aiTrigger} />

    </div>

  );

}
