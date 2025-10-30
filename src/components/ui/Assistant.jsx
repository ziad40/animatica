import React, { useState, useEffect, useRef } from "react";
import Avatar from "./Avatar";
import AssistantGif from "@/assets/gif/assistant.gif";
import AssistantPNG from "@/assets/images/assistant.png";
import { getHelp } from "@/services/assistant";

export const Assistant = ({
        size = 150,
        alt = "AI Assistant",
        title = "Hi, I'm Your Assistant!",
        problem,
        scheduledProcesses,
        waitingTimes,
        operations,
        averageWaitingTime,
    }) => {
        const [showButton, setShowButton] = useState(false);
        const [hint, setHint] = useState("");
        const [loading, setLoading] = useState(false);
        const hideTimer = useRef(null);
        
        useEffect(() => {
            setHint("");
            setLoading(false);
        }, [problem]);

        const getHint = async () => {
            try {
            setLoading(true);
            setHint(""); // clear previous hint
            const answer = {
                schedule : scheduledProcesses,
                waitingTimes : waitingTimes,
                operations : operations,
                averageWaitingTime : parseFloat(averageWaitingTime),
            };
            const response = await getHelp(problem?.type, answer, problem?.solution);
                setHint(response);
            } catch (error) {
                console.error("Error fetching hint:", error);
                setHint("⚠️ Something went wrong while getting your hint.");
            } finally {
                setLoading(false);
            }
        };

        const handleMouseEnter = () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            setShowButton(true);
        };

        const handleMouseLeave = () => {
            // Delay hiding the button by 2 seconds
            hideTimer.current = setTimeout(() => {
                setShowButton(false);
            }, 2000);
        };

        useEffect(() => {
            return () => {
                if (hideTimer.current) clearTimeout(hideTimer.current);
            };
        }, []);

        return (
            <div
            className="relative flex flex-col items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ width: size }}
            >
            <Avatar
                src={AssistantPNG}
                hoverSrc={AssistantGif}
                size={size}
                alt={alt}
                title={title}
            />

            {/* Floating "Get Help" button */}
            {showButton && !loading && (
                <button
                onClick={getHint}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-lg shadow transition-all duration-300"
                >
                    Get Help
                </button>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="text-sm text-gray-600 animate-pulse">
                    Processing...
                </div>
            )}

            {/* Hint display area */}
            {hint && (
                <div
                    className="mt-6 max-w-[250px] bg-blue-50 border border-blue-200 text-gray-800 text-sm p-3 rounded-lg shadow-sm transition-all duration-300 animate-fadeIn"
                    style={{ textAlign: "center", whiteSpace: "pre-line" }}
                >
                💡 {hint}
                </div>
            )}
            </div>
        );
};
