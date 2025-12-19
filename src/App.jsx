import { useState, useEffect } from 'react'
import { Sparkles, BookOpen, Edit3, Save, History, Image as ImageIcon, Loader } from 'lucide-react'
import './App.css'
import StoryForm from './components/StoryForm'
import StoryDisplay from './components/StoryDisplay'
import StoryHistory from './components/StoryHistory'
import { generateStory, generateMockStory } from './services/api'

function App() {
  const [storyData, setStoryData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [storyHistory, setStoryHistory] = useState([])

  useEffect(() => {
    // Load saved stories from localStorage
    const saved = localStorage.getItem('storyHistory')
    if (saved) {
      try {
        setStoryHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load story history:', e)
      }
    }
  }, [])

  const handleGenerate = async (formData) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const generatedStory = await generateStory(formData)
      const newStory = {
        ...generatedStory,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        formData
      }
      
      setStoryData(newStory)
      
      // Show warning if rate limited but story was generated
      if (generatedStory.rateLimitWarning) {
        setError('⚠️ API rate limit reached. Showing demo story. Wait a few minutes and try again for AI-generated content.')
      }
      
      // Save to history
      const updatedHistory = [newStory, ...storyHistory].slice(0, 10) // Keep last 10
      setStoryHistory(updatedHistory)
      localStorage.setItem('storyHistory', JSON.stringify(updatedHistory))
    } catch (err) {
      // Only show error if we couldn't generate a fallback story
      if (err.message.includes('Invalid API key')) {
        setError(err.message + ' Using demo story instead.')
        // Still generate a mock story
        const mockStoryData = generateMockStory(formData)
        const mockStory = {
          ...mockStoryData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isMock: true
        }
        setStoryData(mockStory)
      } else {
        setError(err.message || 'Failed to generate story. Please check your API key and try again.')
      }
      console.error('Error generating story:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLoadStory = (story) => {
    setStoryData(story)
    setError(null)
  }

  const handleUpdateStory = (updatedContent) => {
    setStoryData(prev => ({
      ...prev,
      content: updatedContent
    }))
  }

  const handleSaveStory = () => {
    if (!storyData) return
    
    const updatedHistory = storyHistory.map(s => 
      s.id === storyData.id ? storyData : s
    )
    setStoryHistory(updatedHistory)
    localStorage.setItem('storyHistory', JSON.stringify(updatedHistory))
    
    // Show success feedback
    const successMsg = document.createElement('div')
    successMsg.className = 'success-message'
    successMsg.textContent = 'Story saved successfully!'
    successMsg.style.position = 'fixed'
    successMsg.style.top = '20px'
    successMsg.style.right = '20px'
    successMsg.style.zIndex = '1000'
    document.body.appendChild(successMsg)
    setTimeout(() => successMsg.remove(), 3000)
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <Sparkles style={{ display: 'inline', marginRight: '0.5rem' }} />
          Social Story Generator
        </h1>
        <p>Create Personalized Interactive Stories for Children with Autism</p>
      </header>

      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <BookOpen size={24} />
            Create New Story
          </div>
          {error && (
            <div className={error.includes('⚠️') || error.includes('demo') ? 'success-message' : 'error-message'}>
              {error}
              {error.includes('rate limit') && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>Tips:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    <li>Wait 1-2 minutes before trying again</li>
                    <li>Check your OpenAI account usage limits</li>
                    <li>The demo story shown is still fully editable</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {isGenerating && (
            <div style={{ 
              background: '#e3f2fd', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Loader className="loading-spinner" />
              <span style={{ color: '#1976d2' }}>Generating your personalized social story...</span>
            </div>
          )}
          <StoryForm 
            onSubmit={handleGenerate} 
            isGenerating={isGenerating}
          />
        </div>

        <div className="card">
          <div className="card-title">
            <Edit3 size={24} />
            Generated Story
            {storyData && (
              <span className="badge badge-success">Ready</span>
            )}
            {isGenerating && (
              <span className="badge badge-info">Generating...</span>
            )}
          </div>
          {storyData ? (
            <>
              <StoryDisplay 
                story={storyData}
                onUpdate={handleUpdateStory}
              />
              <div className="story-actions">
                <button 
                  className="btn-secondary"
                  onClick={handleSaveStory}
                >
                  <Save size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Save Story
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📖</div>
              <p>Fill out the form and generate your first social story!</p>
            </div>
          )}
        </div>
      </div>

      {storyHistory.length > 0 && (
        <div className="card" style={{ width: '100%', maxWidth: '1200px', marginTop: '2rem' }}>
          <div className="card-title">
            <History size={24} />
            Story History
          </div>
          <StoryHistory 
            stories={storyHistory}
            onLoadStory={handleLoadStory}
          />
        </div>
      )}
    </div>
  )
}

export default App
