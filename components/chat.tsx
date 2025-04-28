"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

import { Trash } from '~/components/custom-icons/trash';
import { Trash2, Loader } from 'lucide-react';

type MessageProps = {
  role: "user" | "assistant" | "code" | "thinking";
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown
        components={{
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul style={{ display: "grid", alignItems: "start", marginBottom: "4px" }} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol
              style={{ display: "grid", alignItems: "start", marginBottom: "2px", marginLeft: "4px" }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{ display: "grid", alignItems: "start", lineHeight: "auto", marginBottom: "4px" }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              style={{
                display: "grid",
                alignItems: "start",
                lineHeight: "auto",
                marginTop: "4px",
                marginBottom: "8px",
              }}
              {...props}
            />
          ),
          br: () => <></>,
        }}
      >
        {text}
      </Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const ThinkingMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage} style={{ fontStyle: 'italic', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Loader size={16} className="animate-spin" />
      {text}
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    case "thinking":
      return <ThinkingMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Automatically scroll to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {

    // To clear localStorage when a new browser window or tab is opened, using a combination of sessionStorage and localStorage

    const sessionKey = "my-unique-session-key"; // Key for sessionStorage
    const localStorageKey = "my-unique-localstorage-key"; // Key for localStorage

    // Check if a session key already exists
    let sessionIdentifier = sessionStorage.getItem(sessionKey);

    if (!sessionIdentifier) {
      // If not, generate a new one (could be a timestamp, UUID, etc.)
      sessionIdentifier = Date.now().toString();
      sessionStorage.setItem(sessionKey, sessionIdentifier);
    }

    // Get the identifier from localStorage
    const storedIdentifier = localStorage.getItem(localStorageKey);

    if (!storedIdentifier) {
      // If no identifier in localStorage, store the current session's identifier
      localStorage.setItem(localStorageKey, sessionIdentifier);
    } else if (storedIdentifier !== sessionIdentifier) {
      // If they don't match, a new tab or window was opened
      console.log("New tab or window detected. Clearing localStorage...");
      localStorage.clear();
      // Update the localStorage to the current session's identifier
      localStorage.setItem(localStorageKey, sessionIdentifier);
    }


    // The thread is only created once, ideally when the user first starts a conversation, and not every time the Chat component mounts.
    // Check for Existing threadId, Persist Messages in localStorage and Use the Existing Thread, Messages

    // Check if there's an existing threadId in localStorage
    const existingThreadId = localStorage.getItem("threadId");

    if (existingThreadId) {
      setThreadId(existingThreadId);
      console.log("Using existing thread:", existingThreadId);
      // Load previous messages from localStorage if available
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } else {
      // Create a new thread if none exists
      const createThread = async () => {
        const res = await fetch(`/api/assistants/threads`, {
          method: "POST",
        });
        const data = await res.json();
        setThreadId(data.threadId);
        localStorage.setItem("threadId", data.threadId); // Save the new threadId
        console.log("Created new thread:", data.threadId);
      };
      createThread();
    }
  }, []);

  useEffect(() => {
    // Save chat messages to localStorage whenever they change
    if (messages.length > 0) {
      // Filter out thinking messages before saving to localStorage
      const messagesToSave = messages.filter(msg => msg.role !== "thinking");
      localStorage.setItem("chatMessages", JSON.stringify(messagesToSave));
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!threadId) {
      console.error("No thread ID available. Cannot send message.");
      return;
    }

    // Append the additional text to the user input
    const modifiedText = `${text} Use only the information provided in the attached documents. Don't give any repsonse outside the information provided in the attached documents. Don't start the response with 'Based on the information provided'. Add the StoreURL into the answer only when relevant. Check the files before answering the questions. Note: Multi storefront and Multiple stores are different things. `;

    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: modifiedText, // Use the modified text here
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);

    handleReadableStream(stream);
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any[]) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Display the original user input in the chat UI
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
      { role: "thinking", text: "Thinking..." } // Add thinking message right after user message
    ]);

    // Set thinking state and disable input
    setIsThinking(true);
    setInputDisabled(true);

    // Send the user input with the appended text
    sendMessage(userInput);

    setUserInput("");

    // Reset textarea height manually
    const textarea = document.querySelector(`.${styles.input}`) as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
      textarea.scrollTop = 0;
    }

    scrollToBottom();
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    // Remove the "Thinking..." message and add assistant message
    setIsThinking(false);
    setMessages((prevMessages) => {
      const filteredMessages = prevMessages.filter(msg => msg.role !== "thinking");
      return [...filteredMessages, { role: "assistant", text: "" }];
    });
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image: any) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall: any) => {
    if (toolCall.type != "code_interpreter") return;
    // Remove thinking message if it exists
    setIsThinking(false);
    setMessages((prevMessages) => {
      const filteredMessages = prevMessages.filter(msg => msg.role !== "thinking");
      return [...filteredMessages, { role: "code", text: "" }];
    });
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta: any, snapshot: any) => {
    if (delta.type != "code_interpreter" || !delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setInputDisabled(false);
    // Ensure thinking message is removed if for some reason it's still there
    if (isThinking) {
      setIsThinking(false);
      setMessages((prevMessages) =>
        prevMessages.filter(msg => msg.role !== "thinking")
      );
    }
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event: any) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  /*
  =======================
  === Utility Helpers ===
  =======================
  */

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: "user" | "assistant" | "code" | "thinking", text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any[]) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}
        style={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: '8px' }}
      >
        <textarea
          className={styles.input}
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);

            const textarea = e.target;
            textarea.style.height = 'auto';

            const maxHeight = 200;
            const buffer = 4;
            textarea.style.height = Math.min(textarea.scrollHeight + buffer, maxHeight) + 'px';
          }}

          placeholder="Search BC Stores, case studies, insights…"
          rows={1}
        />
        <div className={styles.buttonContainer} style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            type="submit"
            className={styles.button}
            disabled={inputDisabled}
          >
            Send
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={clearMessages}
          >
            <Trash2 />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;