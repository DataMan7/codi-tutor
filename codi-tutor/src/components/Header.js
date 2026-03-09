import React from 'react';
import { SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/solid';

const Header = () => (
    <header className="chat-header">
        <div className="logo">
            <SparklesIcon className="icon" />
            <h1>Codi The AI Tutor</h1>
        </div>
        <div className="mascot">
            <CodeBracketIcon className="mascot-icon" />
            <span>Hi, I'm codi! 👋</span>
        </div>
    </header>
);

export default Header;