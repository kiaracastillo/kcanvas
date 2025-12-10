import { useEffect, useRef } from "react";
import "./../styles/canvasboard.css";

export default function CanvasBoard({
  color,
  brushSize,
  tool,
  backgroundColor,
  opacity,
  clearTrigger,
  downloadTrigger,
  roomId,
  setBackgroundColor,
  aiPrompt,
  aiTrigger,
}) {

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const socketRef = useRef(null);

  const remoteBgRef = useRef(false);
  const remoteClearRef = useRef(false);

  // canvas size setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 140; // header and toolbar
  }, []);

  // helpers to clear canvas with bg color
  const clearCanvasWithBg = (bg) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };


    // dibuja un sketch ai a partir de base64
  const drawAISketch = (imageBase64) => {

    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

// crear una nueva imagen
    const img = new Image();
    img.src = `data:image/png;base64,${imageBase64}`;

    img.onload = () => {
      clearCanvasWithBg("#ffffff");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  // draw from server messages
  const drawFromServer = (msg) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (msg.tool === "eraser") {

     //use background color for eraser
      ctx.strokeStyle = msg.backgroundColor || "#ffffff";
      ctx.globalAlpha = 1;
      ctx.lineWidth = msg.brushSize * 1.2;

    } else if (msg.tool === "highlighter") {

      ctx.strokeStyle = msg.color;
      ctx.globalAlpha = 0.3 * msg.opacity;
      ctx.lineWidth = msg.brushSize * 2;

    } else {

      ctx.strokeStyle = msg.color;
      ctx.globalAlpha = msg.opacity;
      ctx.lineWidth = msg.brushSize;

    }

    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(msg.lastX, msg.lastY);
    ctx.lineTo(msg.x, msg.y);
    ctx.stroke();
  };

  // conect to WebSocket server
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join-room", roomId }));
      console.log("Joined room via WS:", roomId);
    };

       socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "draw") {
    drawFromServer(msg);
  }

  if (msg.type === "background-change") {
    remoteBgRef.current = true;
    setBackgroundColor(msg.backgroundColor);
    clearCanvasWithBg(msg.backgroundColor);
  }

  if (msg.type === "clear") {
    remoteClearRef.current = true;
    clearCanvasWithBg(msg.backgroundColor || backgroundColor);
  }

  // new ai sketch received
  if (msg.type === "ai-sketch" && msg.payload?.imageBase64) {
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = `data:image/png;base64,${msg.payload.imageBase64}`;

    img.onload = () => {
      clearCanvasWithBg("#ffffff");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

  }

};



socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    
  };

    return () => {
      socket.close();
    };
  }, [roomId, setBackgroundColor, backgroundColor]);

  // drawing logic
  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

  const getPos = (e) => {
   const rect = canvas.getBoundingClientRect();
    
   return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

    };

    // iniciar dibujo
    const handleMouseDown = (e) => {

      isDrawingRef.current = true;
      lastPosRef.current = getPos(e);

    };

   //drawing
    const handleMouseMove = (e) => {
   if (!isDrawingRef.current) return;
      const pos = getPos(e);

      // dibujo local 
      if (tool === "eraser") {

        ctx.strokeStyle = backgroundColor;
        ctx.globalAlpha = 1;
        ctx.lineWidth = brushSize * 1.2;

      } else if (tool === "highlighter") {

        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3 * opacity;
        ctx.lineWidth = brushSize * 2;

      } else {

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = brushSize;
      }

      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // send draw data to server
      if (

        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "draw",
            roomId,
            x: pos.x,
            y: pos.y,
            lastX: lastPosRef.current.x,
            lastY: lastPosRef.current.y,
            color,
            brushSize,
            opacity,
            tool,
            backgroundColor,
          }
        )

        );

      }

      lastPosRef.current = pos;
    };

  const handleMouseUp = () => {
   isDrawingRef.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseup", handleMouseUp);


    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

  }, [color, brushSize, tool, opacity, backgroundColor, roomId]);

  // clear canvas 

  useEffect(() => {
    if (!canvasRef.current) return;

clearCanvasWithBg(backgroundColor);

    if (remoteClearRef.current) {

      remoteClearRef.current = false;
      return;

    }

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {

      socketRef.current.send(
        JSON.stringify({
          type: "clear",
          roomId,
          backgroundColor,

        })
);
    }
  }, [clearTrigger, backgroundColor, roomId]);

  // sincrionizar cambio de fondo
  useEffect(() => {
    if (!canvasRef.current) return;

    clearCanvasWithBg(backgroundColor);

    if (remoteBgRef.current) {

      remoteBgRef.current = false;
      return;
    }

    if (

      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      console.log("sending backgroundchange:", backgroundColor);
      socketRef.current.send(
        JSON.stringify({
          type: "background-change",
          roomId,
          backgroundColor,
        }
      )
      );
    }

  }, [backgroundColor, roomId]);

 // ai sketch generation

useEffect(() => {
  if (!aiTrigger) return;        
  if (!aiPrompt.trim()) return;

  
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // llamar al servidor ai
  (async () => {
    try {
      const res = await fetch("http://localhost:4000/api/sketch", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),

      }
  );

      if (!res.ok) {

        const errData = await res.json().catch(() => ({}));
        console.error("AI server error:", errData);

        if (errData.error === "org_not_verified") {

          alert(
            "AI sketch is not available yet.\n" +
            "Go to OpenAI dashboard"
          );
        } else {
          alert("Sorry the ai sketch could not be generated right now.");
        }

        return;
      }

      const data = await res.json();

      // playload to send to other users
      const payload = {

        imageBase64: data.imageBase64,
        prompt: aiPrompt,
      };

      const img = new Image();

   img.src = `data:image/png;base64,${payload.imageBase64}`;

      img.onload = () => {
        clearCanvasWithBg("#ffffff");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // send ai sketch to other users
        if (

          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {

          socketRef.current.send(
            JSON.stringify({
              type: "ai-sketch",
              roomId,
              payload,
            })

          );

        }


      };
    } catch (err) {

      console.error("ai fetch error:", err);
    }
  })();

}, [aiTrigger, aiPrompt, roomId]);




  // download canvas as png
  useEffect(() => {
    if (downloadTrigger === 0) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "kcanvas-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [downloadTrigger]);

  return <canvas ref={canvasRef} className="canvas-board" />;
}
