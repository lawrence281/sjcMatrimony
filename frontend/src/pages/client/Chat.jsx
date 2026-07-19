import { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  const { getSocket, isConnected } = useSocket();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get('/chats');
      setChats(res.data?.data || []);
    } catch (err) {
      // Handle error
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const selectChatRoom = async (chat) => {
    // Leave previous room if any
    const socket = getSocket();
    if (selectedChat && socket) {
      socket.emit('chat:leave', selectedChat._id);
    }

    setSelectedChat(chat);
    setLoadingMessages(true);
    try {
      const res = await axiosInstance.get(`/chats/${chat._id}/messages`);
      setMessages(res.data?.data || []);

      if (socket) {
        socket.emit('chat:join', chat._id);
        // Mark as read
        socket.emit('chat:read', { chatId: chat._id });
        await axiosInstance.patch(`/chats/${chat._id}/read`).catch(() => null);
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoadingMessages(false);
    }
  };

  // Socket listener for new messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedChat) return;

    const handleNewMessage = (msg) => {
      if (msg.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
        // Auto mark as read
        socket.emit('chat:read', { chatId: selectedChat._id });
      }
      // Re-fetch conversation list to update last messages
      fetchChats();
    };

    socket.on('chat:message:new', handleNewMessage);

    return () => {
      socket.off('chat:message:new', handleNewMessage);
    };
  }, [selectedChat, getSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    const socket = getSocket();
    if (socket && isConnected) {
      socket.emit('chat:message', {
        chatId: selectedChat._id,
        content: inputMessage.trim(),
        type: 'text',
      });
      setInputMessage('');
    } else {
      // REST fallback
      axiosInstance
        .post(`/chats/${selectedChat._id}/messages`, {
          content: inputMessage.trim(),
          type: 'text',
        })
        .then((res) => {
          setMessages((prev) => [...prev, res.data?.data?.message]);
          setInputMessage('');
          fetchChats();
        })
        .catch(() => null);
    }
  };

  return (
    <div className="bg-white border rounded-2xl h-[calc(100vh-10rem)] flex overflow-hidden shadow-sm animate-fade-in">
      {/* Sidebar chats list */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-base font-bold text-neutral-800">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y">
          {loadingChats ? (
            <div className="text-center py-10 text-neutral-400 text-sm">Loading chats...</div>
          ) : (
            chats.map((chat) => {
              const recipient = chat.participants?.find((p) => p._id !== user?._id);
              const p = recipient?.profile;
              const isSelected = selectedChat?._id === chat._id;
              return (
                <button
                  key={chat._id}
                  onClick={() => selectChatRoom(chat)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-neutral-50 transition text-left ${
                    isSelected ? 'bg-primary-50/55 border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center shrink-0">
                    {p?.profilePicture ? (
                      <img src={p.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg text-neutral-300">👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-800 truncate">
                      {p?.firstName} {p?.lastName}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate">
                      {chat.lastMessage?.content || 'No messages yet.'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
          {!loadingChats && chats.length === 0 && (
            <div className="text-center py-10 text-neutral-400 text-sm">No conversations yet.</div>
          )}
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col bg-neutral-50">
        {selectedChat ? (
          <>
            {/* Header */}
            {(() => {
              const recipient = selectedChat.participants?.find((p) => p._id !== user?._id);
              const p = recipient?.profile;
              return (
                <div className="p-4 border-b bg-white flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center shrink-0">
                    {p?.profilePicture ? (
                      <img src={p.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg text-neutral-300">👤</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-800">
                    {p?.firstName} {p?.lastName}
                  </h3>
                </div>
              );
            })()}

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="text-center py-10 text-neutral-400 text-sm">Loading messages...</div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?._id || msg.senderId?._id === user?._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMe
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white text-neutral-800 border rounded-tl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <span className={`text-[9px] block text-right mt-1 ${
                          isMe ? 'text-primary-200' : 'text-neutral-400'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="input flex-1 py-3 px-4 rounded-xl border border-neutral-200"
              />
              <button type="submit" className="btn-primary px-6 rounded-xl font-bold">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-8">
            <span className="text-5xl mb-4 font-heading">💬</span>
            <p className="text-sm font-medium">Select a conversation to start messaging matches.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
