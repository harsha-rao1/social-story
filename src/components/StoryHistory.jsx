import { Clock, BookOpen } from 'lucide-react'

function StoryHistory({ stories, onLoadStory }) {
  if (stories.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📚</div>
        <p>No saved stories yet. Generate your first story to see it here!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPreview = (content) => {
    return content.substring(0, 100) + (content.length > 100 ? '...' : '')
  }

  return (
    <div>
      {stories.map((story) => (
        <div 
          key={story.id} 
          className="history-item"
          onClick={() => onLoadStory(story)}
        >
          <div className="history-item-title">
            <BookOpen size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            {story.formData?.scenario ? 
              story.formData.scenario.charAt(0).toUpperCase() + story.formData.scenario.slice(1) + 
              ' Story' : 
              'Social Story'
            }
            {story.formData?.childName && (
              <span style={{ color: '#667eea', fontWeight: 'normal' }}>
                {' '}for {story.formData.childName}
              </span>
            )}
          </div>
          <div className="history-item-meta">
            <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
            {formatDate(story.createdAt)} • 
            Age {story.formData?.age || 'N/A'} • 
            {story.formData?.languageLevel || 'N/A'} level
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            {getPreview(story.content)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StoryHistory

