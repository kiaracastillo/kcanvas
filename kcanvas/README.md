# **Kcanvas**
## Real-Time collaborative drawing with AI prompts
*Cross-platform application built with React.js, WebSockets, OpenAI, and Electron*

### Project summary
**KCanvas** is a real-time collaborative drawing application where multiple users can join a shared room, draw together, and generate sketch-style AI images that appear instantly for everyone. The app offers a playful, creative space for group drawing sessions, games, or co-creating fun illustrations.

To reduce the “blank canvas anxiety”, users can type a prompt such as:

>"cute cat in space, line art"

The AI generates a clean outline sketch, which becomes the base layer of the collaborative canvas. The project is built using React, runs fully in a browser, and includes a desktop version packaged with Electron.


## Key features implemented
### Drawing Tools

- Brush, eraser, and highlighter

- Color picker

- Adjustable brush size

- Adjustable opacity

- Background color syncing

- Clear canvas (synchronized across all users)

- Download drawing as PNG

### Multiplayer Collaboration

- Join rooms using a Kahoot-style room code

- Real-time synchronized strokes across all clients

- Fully functioning WebSocket signaling server

- Background color sync

- Clear actions sync

- AI sketches sync (everyone sees the same image instantly)

- When a new user joins, they automatically receive the current AI sketch

### AI Sketch Generator

- Uses OpenAI GPT-Image-1 to generate clean line-art, “coloring-book style” sketches

- AI prompt available in UI

- AI image appears on all users’ canvases at once

- Server securely handles OpenAI key

- Handles unverification errors with friendly UI alerts

### Electron Desktop App

- Electron loads the Vite React app locally

## Technical approach and design choices

### Technical approach

The technical implementation of KCanvas follows a modular architecture combining React, WebSockets, the HTML5 Canvas API, a custom Node.js AI microservice, and Electron for desktop deployment. Each component of the system was selected to meet the project’s goals: real-time collaboration, AI-assisted sketch generation, and cross-platform compatibility.

### 1. Frontend Architecture (React + Vite)

The application is built using React for UI management and Vite for fast development and bundling.

#### Reasons for choosing React + Vite:

- Component-based structure simplifies modular UI development.

- Efficient state management for dynamic tools (brush, opacity, background changes).

- Vite enables extremely fast hot-reload during development.

- Ideal for integrating Canvas and real-time event listeners.

#### Key frontend components:

- Home.jsx – room creation and joining

- DrawRoom.jsx – main workspace

- CanvasBoard.jsx – core drawing logic

- Toolbar.jsx – tool and settings controls


### 2. Real-Time Collaboration (WebSockets)

Real-time features are handled through a custom WebSocket server using the ws library.

#### WebSockets are used for:

- Broadcasting drawing strokes

- Synchronizing background color changes

- Clearing the canvas across all clients

- Sharing AI-generated sketches

- Restoring the latest sketch when a new user joins

#### WebSocket room structure:
```
rooms = {
  "roomId": {
    clients: [...],
    sketch: null
  }
};
```

This allows multiple users to draw simultaneously with low latency.

### 3. Drawing Engine (HTML5 Canvas API)

The drawing engine uses the Canvas API for high-performance rendering.

#### Implemented tools:

- Brush

- Highlighter (reduced transparency)

- Eraser (draws with background color)

#### Technical aspects:

- Mouse events (mousedown, mousemove, mouseup) update stroke positions.

- Each stroke is serialized and transmitted via WebSockets to other users.

- Eraser uses dynamic background color to avoid leaving artifacts.

- Canvas automatically resizes and re-renders when needed.

### 4. AI Integration (OpenAI Image Generation)

A separate microservice (ai-server.mjs) handles all communication with OpenAI to securely store the API key on the backend.

#### Workflow:

1. User types a prompt in DrawRoom (e.g. “cute cat in space”).

2. React sends the prompt to the AI server via POST request.

3. The server calls gpt-image-1 with a structured prompt:

    ` line art, coloring book style, black outlines only, no shading `


4. OpenAI returns a base64 image.

5. Canvas renders the sketch.

6. The sketch is broadcast to all connected clients through WebSockets.

7. Any new participant joining the room receives the same sketch automatically.

This modular design keeps the AI logic isolated and secure.

### 5. Backend Microservice (Express + OpenAI SDK)

The backend AI server runs independently on port 4000.

#### Responsibilities:

- Handle /api/sketch requests

- Format prompts for line-art generation

- Communicate with OpenAI

- Return base64 images to the frontend

- Provide graceful error handling

- Detect unverified organizations (403 errors)

By keeping the backend lightweight, future expansion (e.g., multiple AI models) becomes easier.

### 6. Cross-Platform Deployment (Electron)

Electron is used to package the entire React app into a desktop application.

#### Electron responsibilities:

- Create a BrowserWindow

- Load the Vite dev server during development

- Load the production build in packaged mode

- Enable future access to local files and OS APIs

This fulfills the requirement for a cross-platform implementation.

## Design

The design of KCanvas follows a minimalist approach to keep the interface clean, simple, and distraction-free. A soft, candy-inspired color palette was selected to introduce a playful but elegant visual tone.

### Color Palette

```
--kc-bg: #f9fafb;
--kc-primary: #9d75ef;
--kc-primary-soft: #9d75ef;
--kc-accent-yellow: #ffe76a;
--kc-accent-coral: #f06568;
--kc-accent-teal: #7eDEE5;
```

### Reasons for this palette:

- Soft colors create a friendly, welcoming environment.

- Minimal contrast supports a non-intimidating creative space.

- Consistent pastel tones maintain brand identity across screens.

###


## Steps to run the application locally

1. Install Dependencies

    `npm install`

2. Start WebSocket server

    `Start WebSocket server`

3. Start AI Server

    Make sure to create a .env contains:

    ```
    OPENAI_API_KEY=your_key_here
    AI_PORT=4000
    ```
- Run:

    `node ai-server.mjs`

4. Start React App

    `npm run dev`

5. Start Desktop App (Electron)

    `npm run electron:dev`


..