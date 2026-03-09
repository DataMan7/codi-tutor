import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { UserIcon, CpuChipIcon } from '@heroicons/react/24/solid';

const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`message ${isUser ? 'user' : 'bot'}`}>
            <div className="avatar">
                {isUser ? <UserIcon /> : <CpuChipIcon />}
            </div>
            <div className="bubble">
                <ReactMarkdown
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {message.text}
                </ReactMarkdown>
                <span className="timestamp">{message.time}</span>
            </div>
        </div>
    );
};

export default MessageBubble;