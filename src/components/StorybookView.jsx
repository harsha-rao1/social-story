import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { getPlaceholderImages } from '../services/imageService'

function StorybookView({ story }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [images, setImages] = useState([])
  const [pages, setPages] = useState([])
  const synthRef = useRef(null)
  const utteranceRef = useRef(null)

  useEffect(() => {
    // Split story into pages (by paragraphs)
    const paragraphs = story.content.split(/\n\n+/).filter(p => p.trim())
    setPages(paragraphs)
    
    // Get images for the story
    const storyImages = getPlaceholderImages(story.formData?.scenario || 'other', paragraphs.length)
    setImages(storyImages)
  }, [story])

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const speakText = (text) => {
    if (!synthRef.current || isMuted) return
    
    // Stop any current speech
    if (utteranceRef.current) {
      synthRef.current.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9 // Slightly slower for children
    utterance.pitch = 1.1 // Slightly higher pitch
    utterance.volume = 1
    
    utteranceRef.current = utterance
    synthRef.current.speak(utterance)

    utterance.onend = () => {
      utteranceRef.current = null
    }
  }

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      utteranceRef.current = null
    }
  }

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      stopSpeech()
    } else {
      setIsPlaying(true)
      if (pages[currentPage]) {
        speakText(pages[currentPage])
      }
    }
  }

  const handleNext = () => {
    stopSpeech()
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      if (isPlaying && pages[nextPage]) {
        speakText(pages[nextPage])
      }
    } else {
      setIsPlaying(false)
    }
  }

  const handlePrevious = () => {
    stopSpeech()
    if (currentPage > 0) {
      const prevPage = currentPage - 1
      setCurrentPage(prevPage)
      if (isPlaying && pages[prevPage]) {
        speakText(pages[prevPage])
      }
    }
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopSpeech()
    } else if (isPlaying && pages[currentPage]) {
      speakText(pages[currentPage])
    }
  }

  // Auto-advance when speech ends
  useEffect(() => {
    if (!isPlaying || !pages[currentPage]) return
    
    const handleEnd = () => {
      if (currentPage < pages.length - 1) {
        setTimeout(() => {
          const nextPage = currentPage + 1
          setCurrentPage(nextPage)
          if (isPlaying && pages[nextPage]) {
            speakText(pages[nextPage])
          }
        }, 500)
      } else {
        setIsPlaying(false)
      }
    }
    
    if (utteranceRef.current) {
      utteranceRef.current.onend = handleEnd
    }
    
    return () => {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null
      }
    }
  }, [isPlaying, currentPage, pages.length])

  if (pages.length === 0) {
    return <div>Loading storybook...</div>
  }

  const currentImage = images[currentPage] || images[0]
  const hasSpeechSupport = 'speechSynthesis' in window

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '16px',
      padding: '2rem',
      minHeight: '500px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Storybook Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        <BookOpen size={24} />
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          Interactive Storybook
        </h2>
      </div>

      {/* Storybook Page */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '800px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Image */}
        <div style={{
          width: '100%',
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={currentImage?.url}
            alt={currentImage?.alt || 'Story illustration'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.src = `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(currentImage?.prompt || 'Story Image')}`
            }}
          />
        </div>

        {/* Text Content */}
        <div style={{
          fontSize: '1.2rem',
          lineHeight: '1.8',
          color: '#333',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          {pages[currentPage]}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        justifyContent: 'center'
      }}>
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentPage === 0}
          style={{
            padding: '0.75rem',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentPage === 0 ? 0.5 : 1,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {hasSpeechSupport && (
          <button
            className="btn-secondary"
            onClick={handleMute}
            style={{
              padding: '0.75rem',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        )}

        <button
          className="btn-primary"
          onClick={handlePlay}
          style={{
            padding: '1rem 2.5rem',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          {isPlaying ? (
            <>
              <Pause size={24} />
              Pause Story
            </>
          ) : (
            <>
              <Play size={24} />
              ▶ Play Story
            </>
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          style={{
            padding: '0.75rem',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentPage === pages.length - 1 ? 0.5 : 1,
            cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Page Indicator */}
      <div style={{
        marginTop: '1rem',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        Page {currentPage + 1} of {pages.length}
      </div>

      {!hasSpeechSupport && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#fff3cd',
          borderRadius: '8px',
          color: '#856404',
          fontSize: '0.85rem'
        }}>
          ⚠️ Text-to-speech not available in this browser
        </div>
      )}
    </div>
  )
}

export default StorybookView

