import { useState } from 'react'
import { ImageIcon, Copy, Check, Download, BookOpen } from 'lucide-react'
import StorybookView from './StorybookView'

function StoryDisplay({ story, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(story.content)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState('storybook') // Default to storybook for demo

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(story.content)
  }

  const handleSave = () => {
    onUpdate(editedContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(story.content)
    setIsEditing(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([story.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `social-story-${story.formData?.scenario || 'story'}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateVisualPrompts = () => {
    const prompts = []
    const scenario = story.formData?.scenario || 'general'
    
    // Generate relevant visual prompts based on scenario
    const scenarioPrompts = {
      school: ['Classroom setting', 'Teacher at desk', 'Children sitting', 'School bus', 'Lunchroom'],
      doctor: ['Doctor\'s office', 'Medical equipment', 'Doctor with stethoscope', 'Waiting room', 'Nurse'],
      playground: ['Playground equipment', 'Children playing', 'Swings', 'Slide', 'Playing together'],
      shopping: ['Shopping cart', 'Store aisle', 'Cashier', 'Products on shelves', 'Paying at checkout'],
      restaurant: ['Restaurant table', 'Menu', 'Waiter', 'Food on plate', 'Eating together'],
      birthday: ['Birthday cake', 'Party decorations', 'Gifts', 'Friends celebrating', 'Balloons'],
      haircut: ['Barber chair', 'Haircut tools', 'Mirror', 'Barber', 'Hair salon'],
      dentist: ['Dental chair', 'Dentist', 'Dental tools', 'Toothbrush', 'Smiling'],
      library: ['Bookshelves', 'Reading area', 'Librarian', 'Books', 'Quiet space']
    }

    const basePrompts = scenarioPrompts[scenario] || ['People interacting', 'Happy faces', 'Calm environment']
    
    // Add age-appropriate prompts
    const age = parseInt(story.formData?.age || 5)
    if (age < 6) {
      prompts.push('Simple illustrations', 'Bright colors', 'Friendly characters')
    } else {
      prompts.push('Realistic images', 'Diverse characters', 'Clear scenes')
    }

    return [...basePrompts, ...prompts].slice(0, 8)
  }

  const visualPrompts = generateVisualPrompts()

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Scenario:</strong> {story.formData?.scenario || 'N/A'} | 
          <strong> Age:</strong> {story.formData?.age || 'N/A'} | 
          <strong> Level:</strong> {story.formData?.languageLevel || 'N/A'}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={viewMode === 'text' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('text')}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Text View
          </button>
          <button
            className={viewMode === 'storybook' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('storybook')}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <BookOpen size={16} />
            Storybook
          </button>
          <button 
            className="btn-secondary"
            onClick={handleCopy}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button 
            className="btn-secondary"
            onClick={handleDownload}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            title="Download as text file"
          >
            <Download size={16} />
          </button>
          {!isEditing ? (
            <button 
              className="btn-secondary"
              onClick={handleEdit}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Edit
            </button>
          ) : (
            <>
              <button 
                className="btn-secondary"
                onClick={handleCancel}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSave}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {viewMode === 'storybook' && !isEditing ? (
        <StorybookView story={story} />
      ) : isEditing ? (
        <textarea
          className="story-content"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{ minHeight: '400px', fontFamily: 'inherit' }}
        />
      ) : (
        <div className="story-content" style={{ cursor: 'text' }}>
          {story.content}
        </div>
      )}

      {viewMode === 'text' && (
        <div className="visual-prompts">
          <h3>
            <ImageIcon size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Suggested Visual Prompts
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Use these prompts to generate or find appropriate images for the story.
          </p>
          <div className="prompt-tags">
            {visualPrompts.map((prompt, index) => (
              <span key={index} className="prompt-tag">
                {prompt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryDisplay

