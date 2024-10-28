'use client'

import { Maximize2, Minimize2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import ChatComponent from "./ui/chats";
import { AppChatIcon } from "./ui/SvgIcons";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && isOpen) setIsExpanded(true)
  }, [isMobile, isOpen])

  const handleToggle = useCallback(() => {
    !isExpanded && setIsExpanded(false);

    setTimeout(() => {
      setIsOpen((prev) => !prev);
      if (isMobile) setIsExpanded(true);
    }, 0);
  }, [isMobile]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setIsExpanded(false), 300)
  }, [])

  return (
      <>
        <button
            className={`fixed w-16 h-16 flex items-center justify-center rounded-full shadow-lg border-gray-300 bg-white text-black
          hover:bg-black hover:text-white hover:border-black hover:scale-110
          active:scale-90 bottom-6 left-8
          ${isOpen ? "rotate-180" : "rotate-0"}
          ${isOpen && isExpanded ? "opacity-0" : "opacity-100"}`}
            onClick={handleToggle}
            aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
              <X className="h-10 w-10" />
          ) : (
              <AppChatIcon
                  width={40}
                  height={40}
                  fill="currentColor"
              />
          )}
        </button>

        <div
            className={`
          fixed transition-all duration-300 ease-in-out
          ${isExpanded || isMobile
                ? "inset-0 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-xs"
                : "bottom-24 left-8"}
          ${isExpanded || isMobile ? "z-50" : "z-40"}
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
        >
          <div
              className={`
            bg-[#e9efe7] border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded || isMobile ? "w-full md:max-w-2xl max-h-[90vh]" : "w-96"}
          `}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 flex justify-between items-center">
                <h4 className="font-medium text-lg">Chat with Sugarpool</h4>
                <div className="flex items-center space-x-2">
                  {!isMobile && (
                      <button
                          className="p-1 transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90"
                          onClick={handleExpand}
                          aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
                      >
                        {isExpanded ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                      </button>
                  )}
                  {(isExpanded || isMobile) && (
                      <button
                          className="p-1 transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90"
                          onClick={handleClose}
                          aria-label="Close chat"
                      >
                        <X className="h-4 w-4" />
                      </button>
                  )}
                </div>
              </div>

              {/* Message Display Area */}
              <div className="flex-grow flex flex-col space-y-4 bg-white rounded-t-3xl overflow-auto custom-scrollbar max-h-[90vh]">
                <ChatComponent />
              </div>
            </div>
          </div>
        </div>
      </>
  );
}