import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
)

const BotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
)

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const MessageSquareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
)

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false)
  const language = className?.replace('language-', '') || 'text'

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-language">{language}</span>
        <button onClick={handleCopy} className="copy-btn-code">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  )
}

function App() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('allChats')
    if (saved) {
      return JSON.parse(saved)
    }
    const defaultChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    }
    return [defaultChat]
  })
  const [currentChatId, setCurrentChatId] = useState(() => {
    const saved = localStorage.getItem('currentChatId')
    return saved ? parseInt(saved) : chats[0]?.id
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0)
  
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY
  const geminiApiKeys = [
    import.meta.env.VITE_GEMINI_API_KEY_1,
    import.meta.env.VITE_GEMINI_API_KEY_2
  ].filter(Boolean)
  
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const currentChat = chats.find(chat => chat.id === currentChatId)
  const messages = currentChat?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    localStorage.setItem('allChats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    localStorage.setItem('currentChatId', currentChatId.toString())
  }, [currentChatId])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: file.type
          }
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const updateChatMessages = (chatId, newMessages) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedChat = { ...chat, messages: newMessages }
        if (newMessages.length === 1 && chat.title === 'New Chat') {
          const firstMessage = newMessages[0].content
          updatedChat.title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
        }
        return updatedChat
      }
      return chat
    }))
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || loading) return

    const userMessage = input.trim()
    const userImage = imagePreview
    setInput('')
    
    const newUserMessage = { 
      role: 'user', 
      content: userMessage,
      image: userImage 
    }
    updateChatMessages(currentChatId, [...messages, newUserMessage])
    
    const imageToSend = selectedImage
    removeImage()
    setLoading(true)

    try {
      let text
      
      if (imageToSend) {
        // Use Gemini for images with key rotation
        let success = false
        let lastError = null
        
        for (let i = 0; i < geminiApiKeys.length; i++) {
          try {
            const keyIndex = (currentKeyIndex + i) % geminiApiKeys.length
            const genAI = new GoogleGenerativeAI(geminiApiKeys[keyIndex])
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
            
            const imagePart = await fileToGenerativePart(imageToSend)
            const result = await model.generateContent([userMessage || "What's in this image?", imagePart])
            const response = await result.response
            text = response.text()
            
            // Success! Update to next key for next time
            setCurrentKeyIndex((keyIndex + 1) % geminiApiKeys.length)
            success = true
            break
          } catch (error) {
            lastError = error
            continue // Try next key
          }
        }
        
        if (!success) {
          throw lastError || new Error('All Gemini API keys failed')
        }
      } else {
        // Use Groq for text chat
        const groq = new Groq({
          apiKey: groqApiKey,
          dangerouslyAllowBrowser: true
        })
        
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: userMessage }],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2048,
        })
        
        text = chatCompletion.choices[0]?.message?.content || 'No response'
      }
      
      updateChatMessages(currentChatId, [...messages, newUserMessage, { role: 'assistant', content: text }])
    } catch (error) {
      updateChatMessages(currentChatId, [...messages, newUserMessage, { 
        role: 'assistant', 
        content: `Error: ${error.message}` 
      }])
    } finally {
      setLoading(false)
    }
  }

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const deleteChat = (chatId) => {
    if (chats.length === 1) {
      createNewChat()
    }
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId)
      if (currentChatId === chatId && filtered.length > 0) {
        setCurrentChatId(filtered[0].id)
      }
      return filtered
    })
  }

  const startEditingChat = (chatId, currentTitle) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }

  const saveEditedTitle = () => {
    if (editingTitle.trim()) {
      setChats(prev => prev.map(chat => 
        chat.id === editingChatId ? { ...chat, title: editingTitle.trim() } : chat
      ))
    }
    setEditingChatId(null)
    setEditingTitle('')
  }

  const exportChat = () => {
    const chatText = messages.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'AI'
      return `${role}: ${msg.content}\n`
    }).join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
  }

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the best practices for React?",
    "Summarize the latest AI trends"
  ]

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button onClick={createNewChat} className="new-chat-btn" title="New chat">
            <PlusIcon />
          </button>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={saveEditedTitle}
                  onKeyPress={(e) => e.key === 'Enter' && saveEditedTitle()}
                  className="chat-title-input"
                  autoFocus
                />
              ) : (
                <>
                  <div 
                    className="chat-item-content"
                    onClick={() => setCurrentChatId(chat.id)}
                  >
                    <MessageSquareIcon />
                    <span className="chat-title">{chat.title}</span>
                  </div>
                  <div className="chat-item-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditingChat(chat.id, chat.title)
                      }}
                      className="chat-action-btn"
                      title="Rename"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat.id)
                      }}
                      className="chat-action-btn"
                      title="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="chat-container">
          <div className="chat-header-bar">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="menu-btn"
              title="Toggle sidebar"
            >
              <MenuIcon />
            </button>
            {messages.length > 0 && (
              <div className="chat-actions">
                <button onClick={exportChat} className="action-btn" title="Export chat">
                  <DownloadIcon />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          <div className="messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <h3>How can I help you today?</h3>
                <div className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-chip"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? <UserIcon /> : <BotIcon />}
              </div>
              <div className="message-bubble">
                {message.image && (
                  <img src={message.image} alt="Uploaded" className="message-image" />
                )}
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        if (inline) {
                          return <code className={className} {...props}>{children}</code>
                        }
                        return <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-avatar">
                <BotIcon />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
            <div ref={messagesEndRef} />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button onClick={removeImage} className="remove-image-btn">
                <CloseIcon />
              </button>
            </div>
          )}

          <form onSubmit={sendMessage} className="input-form">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="icon-btn-input"
              title="Upload image"
            >
              <ImageIcon />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || (!input.trim() && !selectedImage)} className="send-btn">
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
