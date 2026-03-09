import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { sendMessage } from '../utils/api';
import '../styles/chat.css';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: `Hey there, future coder! 🚀 I'm Codi, now powered by Kimi K2 + PicoClaw agent tech!

I can help you:
• 📝 Write and edit code files
• 🔍 Search the web for coding help  
• 🧩 Break down big projects into steps
• 💻 Learn Python, JavaScript, or Scratch
• 🐛 Debug your code with hints
• 🎯 Build cool games and projects

What would you like to create today?`,
            time: new Date().toLocaleTimeString()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        setError(null);

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text,
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const responseText = await sendMessage([...messages, userMsg]);

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: responseText,
                time: new Date().toLocaleTimeString()
            };

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
