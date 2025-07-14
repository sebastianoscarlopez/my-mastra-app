import { useState, useEffect } from "react";
import { memoryAgent } from "../agents/memory-agent";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function MemoryChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [threadId] = useState(`conversation_${Date.now()}`);
  const [resourceId] = useState("user_123"); // In a real app, this would come from authentication

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to UI
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      // Only send the newest message to the agent
      const response = await memoryAgent.stream(input, {
        resourceId,
        threadId,
      });

      // Add agent response to UI
      setMessages([...newMessages, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error in UI
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            <div className="text-sm font-semibold mb-1">
              {msg.role === "user" ? "You" : "Assistant"}
            </div>
            <div className="text-gray-800">{msg.content}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Thread ID: {threadId}
      </div>
    </div>
  );
} 