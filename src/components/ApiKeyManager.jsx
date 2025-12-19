import { useState } from 'react'
import { Key, Eye, EyeOff, Check } from 'lucide-react'
import { setApiKey, clearApiKey } from '../services/api'

function ApiKeyManager() {
  const [showKey, setShowKey] = useState(false)
  const [apiKey, setApiKeyValue] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    clearApiKey()
    setApiKeyValue('')
    setSaved(false)
  }

  const storedKey = localStorage.getItem('openai_api_key')
  const displayKey = storedKey ? (showKey ? storedKey : '•'.repeat(20)) : ''

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '1rem', 
      borderRadius: '8px', 
      marginBottom: '1rem',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Key size={18} />
        <strong style={{ fontSize: '0.9rem' }}>OpenAI API Key</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem' }}>
        Enter your OpenAI API key to enable AI story generation. Get one at{' '}
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
          platform.openai.com/api-keys
        </a>
      </p>
      {storedKey ? (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={displayKey}
            readOnly
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              background: 'white',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}
          />
          <button
            className="btn-secondary"
            onClick={() => setShowKey(!showKey)}
            style={{ padding: '0.5rem' }}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            className="btn-secondary"
            onClick={handleClear}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Clear
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKeyValue(e.target.value)}
            placeholder="sk-..."
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '2px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
          />
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!apiKey.trim()}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {saved ? <Check size={16} /> : 'Save'}
          </button>
        </div>
      )}
      {saved && (
        <div style={{ marginTop: '0.5rem', color: '#3c3', fontSize: '0.85rem' }}>
          ✓ API key saved!
        </div>
      )}
    </div>
  )
}

export default ApiKeyManager

