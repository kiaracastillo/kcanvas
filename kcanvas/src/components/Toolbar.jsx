import "./../styles/toolbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrush,
  faEraser,
  faHighlighter,
  faPalette,
  faCircleMinus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function Toolbar({
  color,
  setColor,
  brushSize,
  setBrushSize,
  tool,
  setTool,
  backgroundColor,
  setBackgroundColor,
  opacity,
  setOpacity,
  onClear,
  onDownload,
}) {

  //when color changes switch to brush tool
  const handleColorChange = (e) => {

    setTool("brush");
    setColor(e.target.value);

  };

  const handleBackgroundChange = (e) => {

    setBackgroundColor(e.target.value);
  };

  
  return (
    <div className="toolbar">

      {/* color,  tamaño,  opacidad */}
      <div className="toolbar-group">

        <span className="toolbar-label"> <FontAwesomeIcon icon={faPalette} className="toolbar-icon-inline" />Color </span>

        <input type="color" value={color} onChange={handleColorChange} />

      </div>

      <div className="toolbar-group">

        <span className="toolbar-label">Size:</span>

        <input
          type="range"
          min="1"
          max="40"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))} />
       
        <span className="toolbar-size-label">{brushSize}px</span>

      </div>

      <div className="toolbar-group">

        <span className="toolbar-label">Opacity:</span>

        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}  />
       
        <span className="toolbar-size-label">{opacity.toFixed(1)}</span>

      </div>

      <div className="toolbar-group">

<span className="toolbar-label">Background:</span>

        <input
          type="color"
          value={backgroundColor}
          onChange={handleBackgroundChange}  />

      </div>

      {/* tools */}
      <div className="toolbar-group">

        <button
          className={`tool-btn ${tool === "brush" ? "active" : ""}`} onClick={() => setTool("brush")} > 
          <FontAwesomeIcon icon={faBrush} className="tool-btn-icon" />Brush </button>


        <button
          className={`tool-btn ${tool === "highlighter" ? "active" : ""}`} onClick={() => setTool("highlighter")} >
          <FontAwesomeIcon icon={faHighlighter} className="tool-btn-icon" /> Highlighter </button>
       
       
        <button
          className={`tool-btn ${tool === "eraser" ? "active" : ""}`} onClick={() => setTool("eraser")} >
          <FontAwesomeIcon icon={faEraser} className="tool-btn-icon" /> Eraser  </button>
     
     
      </div>

      {/* clear and download btn */}
      <div className="toolbar-group">

        <button className="tool-btn danger" onClick={onClear}>
          <FontAwesomeIcon icon={faCircleMinus} className="tool-btn-icon" /> Clear </button>

        <button className="tool-btn primary" onClick={onDownload}><FontAwesomeIcon icon={faDownload} className="tool-btn-icon" />
          Download</button>

      </div>

    </div>

    
  );
}

