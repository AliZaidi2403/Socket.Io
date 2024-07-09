import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";
function App() {
  const socket = useMemo(() => io("http://localhost:8000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState();
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("welcome", (m) => {
      console.log(m);
    });
    socket.on("recieve-message", (d) => {
      console.log(d);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  //note that before a useEffect is used again, a cleanup function is used
  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  }
  function handleJoinRoom(e) {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }
  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.Io
      </Typography>
      <Typography variant="h2" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={handleJoinRoom}>
        <h5>Join Room</h5>
        <TextField
          id="outline-basic"
          variant="outlined"
          value={roomName}
          label="Message"
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outline-basic"
          variant="outlined"
          value={message}
          label="Message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <TextField
          id="outline-basic"
          variant="outlined"
          value={room}
          label="Room"
          onChange={(e) => {
            setRoom(e.target.value);
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
}

export default App;
