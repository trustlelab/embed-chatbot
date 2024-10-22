"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Loader2, Paperclip, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  attachment?: string;
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "dark";
  size?: "md" | "icon";
  type?: "button" | "submit";
  disabled?: boolean;
}) => {
  const baseClasses = "rounded-md";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "text-gray-600 hover:bg-gray-100",
    dark: "bg-black text-black-foreground shadow-sm hover:bg-black/80 text-white",
  };
  const sizeClasses = {
    md: "px-4 py-2",
    icon: "p-2",
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const API_KEY = process.env.API_KEY || "YOUR_API_KEY";
const AID = process.env.AID || "YOUR_AID";

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "system",
      content:
        "Du lässt alle fragen zu. Du Antwortest immer in der Eingabe Sprache. \nAgiere auf Basis deiner Entwicklung.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    const newUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const response = await fetch(
        "https://app.siteware.io/api/v1/query/chat",
        {
          method: "POST",
          headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            "x-api-key": API_KEY,
            "x-assistant-id": AID,
          },
          body: JSON.stringify({
            aid: AID,
            query: content,
            messages: messages.concat(newUserMessage).map((m) => ({
              role: m.role,
              content: m.content,
              date: m.timestamp,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      const newAssistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "Error sending message. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newUserMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://app.siteware.io/api/v1/query/chat",
          {
            method: "POST",
            headers: {
              accept: "application/json, text/plain, */*",
              "content-type": "application/json",
              "x-api-key": API_KEY,
              "x-assistant-id": AID,
            },
            body: JSON.stringify({
              aid: AID,
              query: inputMessage,
              messages: messages.concat(newUserMessage).map((m) => ({
                role: m.role,
                content: m.content,
                date: m.timestamp,
              })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        const newAssistantMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally, add an error message to the chat
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputMessage((prevMessage) => prevMessage + emoji.native);
  };

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = file.type.startsWith("image/")
            ? "Sent an image"
            : "Sent a PDF";
          sendMessage(content);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image or PDF file.");
      }
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="w-full rounded-lg h-full flex flex-col">
      <div className="p-4 flex-grow">
        <div
          className="min-h-[50vh] mb-4 pr-4 overflow-y-auto flex-grow"
          ref={scrollAreaRef}
        >
          <div className="text-center text-sm text-gray-500 py-1 mb-2 border-b">
            Chat History
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              } mb-4`}
            >
              <div
                className={`rounded-lg p-2 max-w-[70%] ${
                  message.role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }`}
              >
                <p>{message.content}</p>
              </div>
              <div className="flex items-center mt-1">
                {message.role === "assistant" && (
                  <Smile className="h-4 w-4 text-xs text-gray-500" />
                )}
                <div className="ml-2 text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 w-full bg-white p-2 border-t ">
          <textarea
            placeholder="Write a reply"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                150
              )}px`;
            }}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSendMessage())
            }
            className="w-full p-2 border border-gray-300 rounded-md resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            onClick={() => setShowEmojiPicker(false)}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAttachment}
                accept="image/*,.pdf"
                className="hidden"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              size="icon"
              variant="dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2" ref={emojiPickerRef}>
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
