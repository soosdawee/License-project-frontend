import {
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import backend from "../../data-access/Backend";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import CancelIcon from "@mui/icons-material/Cancel";
import { GlobalStyles } from "@mui/material";

const CommentModal = ({ open, onClose, visualization }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyName, setReplyName] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!open || !visualization) return;

    const connectWebSocket = () => {
      const token = localStorage.getItem("jwt");
      const socket = new SockJS("http://localhost:8080/ws");

      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          client.subscribe(
            `/topic/comments/${visualization.visualizationId}`,
            (msg) => {
              const newComment = JSON.parse(msg.body);
              setComments((prev) => [...prev, newComment]);
            }
          );

          client.subscribe(
            `/topic/comments/${visualization.visualizationId}/typing`,
            (msg) => {
              const username = msg.body;
              const currentUsername = localStorage.getItem("email");
              if (username !== currentUsername) {
                setTypingUser(username);
                setTimeout(() => {
                  setTypingUser(null);
                }, 3000);
              }
            }
          );

          backend
            .get(`/comment/${visualization.visualizationId}`)
            .then((res) => setComments(res.data));
        },
      });

      client.activate();
      stompClientRef.current = client;
    };

    connectWebSocket();

    return () => {
      stompClientRef.current?.deactivate();
      stompClientRef.current = null;
    };
  }, [open, visualization]);

  const handleSend = (visualizationId) => {
    if (!message.trim()) return;

    const payload = {
      visualizationId: visualization.visualizationId,
      content: message,
      userId: localStorage.getItem("userId"),
      ...(replyTo && { parentId: replyTo }),
    };

    stompClientRef.current?.publish({
      destination: `/app/comments/${visualizationId}/create`,
      body: JSON.stringify(payload),
    });

    setMessage("");
    setReplyTo(null);
    setReplyName("");
  };

  const handleTyping = () => {
    if (!stompClientRef.current || !visualization) return;
    stompClientRef.current.publish({
      destination: `/app/comments/${visualization.visualizationId}/typing`,
      body: "",
    });
  };

  const getElapsedTime = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInSeconds = Math.floor((now - created) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return rtf.format(-minutes, "minute");
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return rtf.format(-hours, "hour");
    const days = Math.floor(hours / 24);
    return rtf.format(-days, "day");
  };

  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      map[comment.commentId] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        map[comment.parentId]?.replies.push(map[comment.commentId]);
      } else {
        roots.push(map[comment.commentId]);
      }
    });

    return roots;
  };

  const handleReply = (comment) => {
    setReplyTo(comment.commentId);
    setReplyName(comment.firstname);
  };

  const CommentItem = ({ comment, level }) => (
    <Box sx={{ pl: level * 2 }}>
      <ListItem alignItems="flex-start" sx={{ py: 0.5, px: 0.5 }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "1% 2% 0 2%",
            border: "0.5px solid #001F47",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#001f47",
                  border: "1px solid #001F47",
                }}
              >
                {comment.firstname[0].toUpperCase()}
                {comment.lastname[0].toUpperCase()}
              </Avatar>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "#001F47",
                }}
              >
                {comment.firstname} {comment.lastname}
              </Typography>
            </Box>
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                color: "#a8a8a8",
              }}
            >
              {getElapsedTime(comment.createdAt)}
            </Typography>
          </Box>

          <Box
            sx={{
              color: "#007FA7",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: 1,
            }}
          >
            <SubdirectoryArrowRightIcon />
            {comment.content}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
            }}
          >
            <Button
              sx={{
                backgroundColor: "white",
                padding: 0,
                margin: "1% 0 1% 0",
                color: "#007FA7",
                textTransform: "none",
                alignItems: "start",
                "&:hover": { backgroundColor: "#f8f4f4" },
              }}
              onClick={() => handleReply(comment)}
            >
              Reply
            </Button>
          </Box>
        </Box>
      </ListItem>
      {comment.replies.map((reply) => (
        <CommentItem key={reply.commentId} comment={reply} level={level + 1} />
      ))}
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          backgroundColor: "#f8f4f4",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#001F47",
            }}
          >
            Visualization of {visualization?.user.firstname}{" "}
            {visualization?.user.lastname}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#c12c2d" }}>
            <CancelIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1, mb: 2 }}>
          {comments.length > 0 ? (
            <List sx={{ py: 0 }}>
              {buildCommentTree(comments).map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  level={0}
                />
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#666", textAlign: "center", mt: 2 }}
            >
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>

        {replyTo && (
          <Typography variant="body2" sx={{ color: "#007FA7", mb: 1 }}>
            Replying to {replyName}{" "}
            <Button size="small" onClick={() => setReplyTo(null)}>
              Cancel
            </Button>
          </Typography>
        )}

        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
          }}
        >
          {typingUser && (
            <div className="typing">
              <div className="typing__dot"></div>
              <div className="typing__dot"></div>
              <div className="typing__dot"></div>
            </div>
          )}
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write your comment..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#001f47", textTransform: "none" }}
              onClick={() => handleSend(visualization.visualizationId)}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommentModal;
