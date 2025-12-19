import { useState } from 'react'
import { Loader } from 'lucide-react'
// import ApiKeyManager from './ApiKeyManager' // Hidden for demo

const SCENARIOS = [
  { value: 'school', label: 'School' },
  { value: 'doctor', label: 'Doctor Visit' },
  { value: 'playground', label: 'Playground' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'haircut', label: 'Haircut' },
  { value: 'dentist', label: 'Dentist Visit' },
  { value: 'library', label: 'Library' },
  { value: 'other', label: 'Other' }
]

const LANGUAGE_LEVELS = [
  { value: 'simple', label: 'Simple (3-5 years)', description: 'Very short sentences, basic words' },
  { value: 'intermediate', label: 'Intermediate (6-8 years)', description: 'Clear sentences, common vocabulary' },
  { value: 'advanced', label: 'Advanced (9+ years)', description: 'Complex sentences, varied vocabulary' }
]

function StoryForm({ onSubmit, isGenerating }) {
  const [formData, setFormData] = useState({
    scenario: 'school',
    age: '5',
    languageLevel: 'simple',
    childName: '',
    customDetails: '',
    specificConcerns: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* API Key Manager hidden for demo - uncomment if needed */}
      {/* <ApiKeyManager /> */}
      <div className="form-group">
        <label htmlFor="scenario">Scenario *</label>
        <select
          id="scenario"
          name="scenario"
          value={formData.scenario}
          onChange={handleChange}
          required
        >
          {SCENARIOS.map(scenario => (
            <option key={scenario.value} value={scenario.value}>
              {scenario.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="age">Child's Age *</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="3"
          max="18"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="languageLevel">Language Level *</label>
        <select
          id="languageLevel"
          name="languageLevel"
          value={formData.languageLevel}
          onChange={handleChange}
          required
        >
          {LANGUAGE_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="childName">Child's Name (Optional)</label>
        <input
          type="text"
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          placeholder="e.g., Alex"
        />
      </div>

      <div className="form-group">
        <label htmlFor="customDetails">Additional Context (Optional)</label>
        <textarea
          id="customDetails"
          name="customDetails"
          value={formData.customDetails}
          onChange={handleChange}
          placeholder="Add any specific details about the situation, environment, or people involved..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="specificConcerns">Specific Concerns or Goals (Optional)</label>
        <textarea
          id="specificConcerns"
          name="specificConcerns"
          value={formData.specificConcerns}
          onChange={handleChange}
          placeholder="e.g., Help child understand waiting in line, reduce anxiety about loud noises..."
        />
      </div>

      <button 
        type="submit" 
        className="btn-primary"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader className="loading-spinner" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
            Generating Story...
          </>
        ) : (
          '✨ Generate Story'
        )}
      </button>
      <p style={{ 
        fontSize: '0.85rem', 
        color: '#666', 
        marginTop: '0.75rem', 
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Works instantly - no API key needed for demo!
      </p>
    </form>
  )
}

export default StoryForm

