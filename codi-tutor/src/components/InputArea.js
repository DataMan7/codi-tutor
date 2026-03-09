// InputArea.jsx
import React, { useState } from 'react';
import { PaperAirplaneIcon, LightBulbIcon } from '@heroicons/react/24/solid';

const InputArea = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');

    const quickPrompts = [
        "Explain loops like I'm 10",
        "Help me fix this error",
        "What is a function?",
        "Create a simple game"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input.trim()); // Trim the input
            setInput('');
        }
    };

    const handleQuickPrompt = (prompt) => {
        if (!isLoading) {
            onSend(prompt);
        }
    };

    return (
        <div className="input-area">
            <div className="quick-prompts">
                {quickPrompts.map((prompt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="prompt-chip"
                        disabled={isLoading}
                        type="button" // Prevent form submission
                    >
                        <LightBulbIcon className="icon" />
                        {prompt}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Codi anything about coding..."
                    disabled={isLoading}
                    autoFocus
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                >
                    {isLoading ? '...' : <PaperAirplaneIcon className="icon" />}
                </button>
            </form>
        </div>
    );
};

export default InputArea;
