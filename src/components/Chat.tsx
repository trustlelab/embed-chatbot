"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Maximize2, MessageCircle, Minimize2, X } from "lucide-react";
import { FC, useEffect, useState } from "react";

const Chat: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint at 768px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      setIsExpanded(true);
    }
  }, [isMobile, isOpen]);

  const handleToggle = () => {
    if (isExpanded && !isMobile) {
      setIsExpanded(false);
    } else {
      setIsOpen(!isOpen);
      if (isMobile) {
        setIsExpanded(true);
      }
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  return (
    <>
      {!isExpanded && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full fixed w-16 h-16 flex items-center justify-center z-[9999] bottom-6 left-8"
          onClick={handleToggle}
        >
          {isOpen ? (
            <X className="h-10 w-10 text-black" />
          ) : (
            <MessageCircle className="h-10 w-10 text-black fill-black" />
          )}
        </Button>
      )}

      {isOpen && (
        <div
          className={`fixed ${
            isExpanded || isMobile
              ? "inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              : "bottom-24 left-8"
          } z-[9999]`}
        >
          <div
            className={`bg-background border rounded-lg shadow-lg ${
              isExpanded || isMobile
                ? "w-[90%] max-h-[70%] md:max-w-2xl md:max-h-[80vh] min-h-[60vh]"
                : "w-80"
            } `}
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-lg">Sugarpool Chat</h4>
                <div className="flex items-center space-x-2">
                  {!isMobile && (
                    <Button variant="ghost" size="icon" onClick={handleExpand}>
                      {isExpanded ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {(isExpanded || isMobile) && (
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {/* Scrollable chat content */}
              <div className="flex-grow flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-muted-foreground mb-4">
                  Send us a message
                </p>

                <div>
                  <Label htmlFor="name" className="mb-1 block">
                    Name
                  </Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="message" className="mb-1 block">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    placeholder="Type your message here"
                    className="flex-grow resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <Button className="w-full">Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
