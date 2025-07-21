import React, { useState, useEffect } from 'react';

function findStartNode(nodes) {
    return nodes.find(n => n.type === 'start') || nodes[0];
}

export default function FlowTester({ nodes, edges }) {
    const [chat, setChat] = useState([]);
    const [input, setInput] = useState('');
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const currentNode = nodes.find(n => n.id === currentNodeId);

    useEffect(() => {
        if (
            currentNode &&
            currentNode.type !== 'interactive_buttons' &&
            chat.length > 0 &&
            chat[chat.length - 1]?.from === 'bot' &&
            !waiting
        ) {
            const nextId = getNextNodeId(currentNode.id, 'reply') || getNextNodeId(currentNode.id);
            if (nextId) {
                setTimeout(() => displayNode(nextId), 500);
            }
        }
    }, [currentNodeId, chat]);

    const getNextNodeId = (nodeId, sourceHandle = null) => {
        const edge = edges.find(
            e =>
                e.source === nodeId &&
                (!sourceHandle || e.sourceHandle === sourceHandle)
        );
        return edge?.target;
    };

    const displayNode = (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        const { type, data } = node;
        const delay = data.meta?.delay || 500;
        const messages = [];

        switch (type) {
            case 'interactive_buttons':
                if (data.header) messages.push({ from: 'bot', text: data.header });
                if (data.message) messages.push({ from: 'bot', text: data.message });
                if (data.footer) messages.push({ from: 'bot', text: data.footer });
                break;

            case 'interactive_list_section':
                console.log("data.sectionTitle", data.sectionTitle);
                if (data.sectionTitle) {
                    messages.push({ from: 'bot', text: `📚 ${data.sectionTitle}` });
                } else {
                    messages.push({ from: 'bot', text: '[Empty List Section]' });
                }
                break;

            case 'interactive_list_row':
                if (data.title) messages.push({ from: 'bot', text: `📌 ${data.title}` });
                if (data.description) messages.push({ from: 'bot', text: data.description });
                break;

            case 'image':
                messages.push({ from: 'bot', text: `🖼️ ${data.label || '[Image node]'}` });
                break;

            case 'audio':
                messages.push({ from: 'bot', text: '🔊 Audio message' });
                break;

            case 'video':
                messages.push({ from: 'bot', text: '🎥 Video message' });
                break;

            case 'text':
            default:
                messages.push({ from: 'bot', text: data.message || data.label || '[no message]' });
                break;
        }

        setWaiting(true);
        let step = 0;

        const sendMessagesSequentially = () => {
            if (step < messages.length) {
                setChat(prev => [...prev, messages[step]]);
                step++;
                setTimeout(sendMessagesSequentially, delay);
            } else {
                setCurrentNodeId(node.id);
                setWaiting(false);
            }
        };

        sendMessagesSequentially();
    };

    const handleSend = () => {
        if (!input.trim()) return;
        setChat(c => [...c, { from: 'user', text: input }]);

        if (input.trim().toLowerCase() === 'menu' || !currentNode) {
            const start = findStartNode(nodes);
            if (start) {
                setChat([{ from: 'user', text: input }]);
                setCurrentNodeId(start.id);
                displayNode(start.id);

                const nextId = getNextNodeId(start.id);
                if (nextId) {
                    setTimeout(() => displayNode(nextId), 500);
                }

            }
            setInput('');
            return;
        }

        setInput('');
    };

    const handleButtonClick = (btnIndex) => {
        const sourceHandle = `btn-${btnIndex}`;
        const nextId = getNextNodeId(currentNode.id, sourceHandle);
        console.log('Clicked:', sourceHandle, '→', nextId);
        if (nextId) displayNode(nextId);
    };





    const showButtons =
        currentNode?.type === 'interactive_buttons' &&
        Array.isArray(currentNode.data.buttons);

    return (
        <div>
            <div className="mb-4 h-64 overflow-y-auto bg-gray-50 p-2 rounded">
                {chat.map((msg, i) => {
                    if (!msg || !msg.from || !msg.text) return null;
                    return (
                        <div key={i} className={`mb-2 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                            <span
                                className={`inline-block px-3 py-1 rounded ${msg.from === 'user'
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-green-100 text-green-900'
                                    }`}
                            >
                                {msg.text}
                            </span>
                        </div>
                    );
                })}
                {waiting && <div className="text-left text-gray-400 italic">Bot is typing...</div>}
            </div>

            {showButtons && (
                <div className="mb-2">
                    {currentNode.data.buttons.map((btn, index) => (
                        <button
                            key={btn.id}
                            className="block w-full bg-blue-100 hover:bg-blue-200 rounded px-3 py-2 text-left mb-1"
                            onClick={() => handleButtonClick(index)}
                            disabled={waiting}
                        >
                            {btn.title}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    className="flex-1 border px-2 py-1 rounded"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={waiting}
                    placeholder="Type 'menu' to start"
                />
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={handleSend}
                    disabled={waiting}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
