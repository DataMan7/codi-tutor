import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { sendMessage } from '../utils/api';
import '../styles/chat.css';

const ChatInterface = () => {
    // Use lazy initialization for the initial message so timestamp is set when component mounts
    const [messages, setMessages] = useState(() => [
        {
            id: 1,
            sender: 'bot',
            text: `Hey there, future coder! 🚀 I'm Codi, now powered by Kimi K2 + PicoClaw agent tech!\n\n

I can help you:\n
• 📝 Write and edit code files\n
• 🔍 Search the web for coding help\n  
• 🧩 Break down big projects into steps\n
• 💻 Learn Python, JavaScript, or Scratch\n
• 🐛 Debug your code with hints\n
• 🎯 Build cool games and projects\n\n

What would you like to create today?`,
            time: new Date().toLocaleTimeString()
        }
    ]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    
    // Use a ref counter for unique IDs, starting after the initial message (id=1)
    const idCounter = useRef(2);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        setError(null);

        // Create user message with unique ID from counter
        const userMsg = {
            id: idCounter.current++,
            sender: 'user',
            text,
            time: new Date().toLocaleTimeString()
        };

        // Update messages with user message
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Send the updated messages to the API
            const responseText = await sendMessage(updatedMessages);

            // Create bot message with unique ID from counter
            const botMsg = {
                id: idCounter.current++,
                sender: 'bot',
                text: responseText,
                time: new Date().toLocaleTimeString()
            };

            // Add bot response to messages
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setError("Failed to get response. Please try again.");
            console.error('Error in handleSend:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <Header />
            <div className="messages-area">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
    );
};

export default ChatInterface;