"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Loader2, Paperclip, Send, Smile, Bot } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";
import {
  AppChatIcon,
  AppMessageIcon,
  AppSendIcon,
  AppTypingIcon,
} from "./SvgIcons";

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

export default function Component() {
  const currentDate = new Date().toISOString();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLandingMessage, setShowLandingMessage] = useState(true);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

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
      const response = await fetch(process.env.BASE_URL || "YOUR_BASE_URL", {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "x-api-key": process.env.API_KEY || "YOUR_API_KEY",
          "x-assistant-id": process.env.AID || "YOUR_AID",
        },
        body: JSON.stringify({
          aid: process.env.AID || "YOUR_AID",
          query: content,
          messages: messages.concat(newUserMessage).map((m) => ({
            role: m.role,
            content: m.content,
            date: m.timestamp,
          })),
        }),
      });

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
    if (!firstMessageSent) {
      setFirstMessageSent(true);
      setShowLandingMessage(false);
    }
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
      setIsTyping(true);

      try {
        const response = await fetch(process.env.BASE_URL || "YOUR_BASE_URL", {
          method: "POST",
          headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            "x-api-key": process.env.API_KEY || "YOUR_API_KEY",
            "x-assistant-id": process.env.AID || "YOUR_AID",
          },
          body: JSON.stringify({
            aid: process.env.AID || "YOUR_AID",
            query: inputMessage,
            messages: messages.concat(newUserMessage).map((m) => ({
              role: m.role,
              content: m.content,
              date: m.timestamp,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessageContent = "";
        const newAssistantMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantMessageContent += chunk;

          // Update the assistant message content with markdown as chunks arrive
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const assistantMessageIndex = updatedMessages.findIndex(
                (msg) => msg.id === newAssistantMessage.id
            );
            updatedMessages[assistantMessageIndex].content =
                assistantMessageContent;
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally, add an error message to the chat
      } finally {
        setIsLoading(false);
        setIsTyping(false);
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
    // Scroll to the end of messages
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Check for overflow
    const chatContainer = scrollAreaRef.current;
    if (chatContainer) {
      const isOverflowing =
          chatContainer.scrollHeight > chatContainer.clientHeight;
      if (isOverflowing) {
        chatContainer.classList.add("overflow");
      } else {
        chatContainer.classList.remove("overflow");
      }
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

  const dateTimeDisplay = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
        new Date(currentDate)
    );
  };

  return (
      <div className="w-full rounded-lg h-full flex flex-col">
        <div className="p-4 flex-grow">
          <div
              className="min-h-[50vh] m max-h-[60vh] mb-4 overflow-y-auto custom-scrollbar"
              ref={scrollAreaRef}
          >
            {showLandingMessage ? (
                <div className="p-4 text-sm text-center text-gray-500">
                  I'm Sugarpools chatbot. I'm here 24/7 to answer most questions
                  <div className="flex justify-center my-5">
                    <AppMessageIcon height={80} width={80} />
                  </div>
                </div>
            ) : (
                <>
                  <div className="text-center text-sm text-gray-500 py-1 mb-2">
                    {dateTimeDisplay()}
                  </div>
                  {messages.map((message, index) => (
                      <div
                          key={message.id}
                          className={`flex flex-col ${
                              message.role === "user" ? "items-end" : "items-start"
                          } mb-4`}
                      >
                        <div
                            className={`rounded-lg p-2 max-w-[70%] markdown-body ${
                                message.role === "user"
                                    ? "bg-black text-white"
                                    : "bg-gray-100"
                            }`}
                        >
                          {message.role === "assistant" ? (
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                          ) : (
                              <p>{message.content}</p>
                          )}
                          {message.role === "assistant" &&
                              isTyping &&
                              index === messages.length - 1 && (
                                  <span className="inline-block ml-1 animate-pulse">
                          ▋
                        </span>
                              )}
                        </div>
                        <div className="flex items-center mt-1">
                          {message.role === "assistant" ? (
                              <>
                                {isLoading ? (
                                    <div className="flex justify-start items-center">
                                      <AppTypingIcon />
                                    </div>
                                ) : (
                                    <>
                                      <AppChatIcon width={25} height={25} />
                                      <div className="ml-2 text-xs text-gray-500">
                                        {new Date(message.timestamp).toLocaleTimeString(
                                            [],
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: false,
                                            }
                                        )}
                                      </div>
                                    </>
                                )}
                              </>
                          ) : (
                              <div className="ml-2 text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </div>
                          )}
                        </div>
                      </div>
                  ))}
                  <div ref={endOfMessagesRef} />
                </>
            )}
          </div>

          <div className="sticky bottom-0 left-0 w-full bg-white p-2 border-t ">
          <textarea
              placeholder="Message Sugarpool"
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
              className="w-full p-2 border border-gray-300 rounded-md resize-none overflow-hidden focus:border-black focus:outline-none"
              rows={1}
              onClick={() => setShowEmojiPicker(false)}
          />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <Button
                    variant={showEmojiPicker ? "dark" : "ghost"}
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </Button>
                {/*<Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>*/}
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
                    <AppSendIcon />
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