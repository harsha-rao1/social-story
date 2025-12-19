import axios from 'axios'

// For demo purposes, we'll use a mock API endpoint
// In production, you would set up a backend server that securely handles the OpenAI API key
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.openai.com/v1'

// This should be set as an environment variable in production
// For demo, users can input their own API key
const getApiKey = () => {
  // Check localStorage first
  const storedKey = localStorage.getItem('openai_api_key')
  if (storedKey && storedKey.trim()) return storedKey.trim()
  
  // Return null if no key - the UI will handle prompting
  return null
}

const buildPrompt = (formData) => {
  const { scenario, age, languageLevel, childName, customDetails, specificConcerns } = formData
  
  const ageNum = parseInt(age)
  const childNameText = childName ? ` named ${childName}` : ''
  
  // Language level guidelines
  const languageGuidelines = {
    simple: 'Use very short sentences (3-5 words), simple vocabulary, and repetition. Use present tense.',
    intermediate: 'Use clear sentences (5-10 words), common vocabulary, and simple explanations.',
    advanced: 'Use varied sentence structures, descriptive language, and can include more complex concepts.'
  }
  
  // Scenario-specific context
  const scenarioContexts = {
    school: 'going to school, being in a classroom, following teacher instructions, interacting with classmates',
    doctor: 'visiting the doctor, medical checkup, waiting in the waiting room, meeting healthcare professionals',
    playground: 'playing at the playground, taking turns, sharing equipment, playing with other children',
    shopping: 'going shopping, walking through stores, selecting items, paying at checkout',
    restaurant: 'eating at a restaurant, ordering food, waiting for food, using table manners',
    birthday: 'attending a birthday party, celebrating with friends, eating cake, giving gifts',
    haircut: 'getting a haircut, sitting in the barber chair, staying still, seeing the result',
    dentist: 'visiting the dentist, dental checkup, cleaning teeth, following dentist instructions',
    library: 'visiting the library, being quiet, selecting books, checking out books',
    other: 'the specified scenario'
  }
  
  const scenarioContext = scenarioContexts[scenario] || scenarioContexts.other
  
  return `Create a personalized social story for a ${age}-year-old child${childNameText} about ${scenarioContext}.

Requirements:
- Language Level: ${languageGuidelines[languageLevel]}
- Age-appropriate: Content should be suitable for a ${age}-year-old
- Positive and reassuring tone
- Clear, step-by-step narrative
- Include what the child will see, hear, and do
- Emphasize positive outcomes and feelings
- Use "I" perspective (first person)
- Keep it concise but complete (approximately 200-400 words)

${customDetails ? `Additional Context: ${customDetails}\n` : ''}
${specificConcerns ? `Specific Goals: ${specificConcerns}\n` : ''}

Format the story as a clear narrative that can be read aloud or by the child. Start with an introduction, then describe the scenario step by step, and end with a positive conclusion.`
}

export const generateStory = async (formData) => {
  try {
    const apiKey = getApiKey()
    
    const prompt = buildPrompt(formData)
    
    // For demo: If no API key, return a mock story
    if (!apiKey) {
      console.warn('No API key found, using mock story for demo')
      return generateMockStory(formData)
    }
    
    // Call OpenAI API
    const response = await axios.post(
      `${API_BASE_URL}/chat/completions`,
      {
        model: 'gpt-4o-mini', // Using the more affordable model
        messages: [
          {
            role: 'system',
            content: 'You are an expert in creating social stories for children with autism. Create clear, age-appropriate, and supportive social stories that help children understand social situations and expectations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const content = response.data.choices[0].message.content.trim()
    
    return {
      content,
      formData
    }
  } catch (error) {
    console.error('API Error:', error)
    
    // If API call fails, return mock story as fallback for demo purposes
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key. Using demo story instead.')
    } else if (error.response?.status === 429) {
      // Rate limit exceeded - use mock story for demo, but warn user
      console.warn('Rate limit exceeded, using mock story for demo')
      const mockStory = generateMockStory(formData)
      // Add a note to the story about rate limiting
      mockStory.rateLimitWarning = true
      return mockStory
    } else if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
      // Network error - use mock story
      console.warn('Network error, using mock story')
      return generateMockStory(formData)
    }
    
    // For other errors, try to use mock story as fallback for demo
    console.warn('API error occurred, using mock story as fallback')
    return generateMockStory(formData)
  }
}

// Helper function to incorporate custom details and concerns into story
const incorporateContext = (baseStory, customDetails, specificConcerns, scenario) => {
  let enhancedStory = baseStory
  
  // Extract key concerns from the text
  const concerns = []
  if (customDetails) concerns.push(customDetails.toLowerCase())
  if (specificConcerns) concerns.push(specificConcerns.toLowerCase())
  
  const allConcerns = concerns.join(' ').toLowerCase()
  
  // Add context-specific paragraphs based on detected concerns
  const contextAdditions = []
  
  // Loud noises / sound sensitivity
  if (allConcerns.includes('loud') || allConcerns.includes('noise') || allConcerns.includes('sound')) {
    if (scenario === 'school') {
      contextAdditions.push(`\n\nSometimes school can be loud. The bell might ring. Children might talk. This is okay. I can cover my ears if it feels too loud. I can take deep breaths. I am safe.`)
    } else {
      contextAdditions.push(`\n\nSometimes there might be loud sounds. This is okay. I can cover my ears if I need to. I can take deep breaths. I am safe.`)
    }
  }
  
  // Anxiety / worry
  if (allConcerns.includes('anxiety') || allConcerns.includes('worry') || allConcerns.includes('nervous') || allConcerns.includes('scared')) {
    contextAdditions.push(`\n\nIf I feel worried, that is okay. I can tell a grown-up how I feel. I can take deep breaths. I am brave. Everything will be okay.`)
  }
  
  // Transitions / changes
  if (allConcerns.includes('transition') || allConcerns.includes('change') || allConcerns.includes('adjust')) {
    contextAdditions.push(`\n\nThings might change during the day. That is okay. I can ask for help if I need it. I can take my time.`)
  }
  
  // Social / sharing
  if (allConcerns.includes('share') || allConcerns.includes('turn') || allConcerns.includes('friend')) {
    contextAdditions.push(`\n\nI will remember to share. I will wait for my turn. This makes everyone happy.`)
  }
  
  // Add custom details if provided
  if (customDetails && !allConcerns.includes(customDetails.toLowerCase())) {
    contextAdditions.push(`\n\n${customDetails.charAt(0).toUpperCase() + customDetails.slice(1)}. I can handle this. I am strong.`)
  }
  
  // Insert context additions before the conclusion
  if (contextAdditions.length > 0) {
    const lastSentenceIndex = enhancedStory.lastIndexOf('!')
    if (lastSentenceIndex > 0) {
      enhancedStory = enhancedStory.slice(0, lastSentenceIndex + 1) + contextAdditions.join('') + enhancedStory.slice(lastSentenceIndex + 1)
    } else {
      enhancedStory += contextAdditions.join('')
    }
  }
  
  return enhancedStory
}

// Mock story generator for demo purposes
export const generateMockStory = (formData) => {
  const { scenario, age, languageLevel, childName, customDetails, specificConcerns } = formData
  const name = childName || 'Alex'
  const ageNum = parseInt(age)
  
  const stories = {
    school: `My School Day

My name is ${name}. I am ${age} years old. Today I am going to school.

When I get to school, I will see my teacher. My teacher will say hello. I will say hello back.

I will sit at my desk. I will listen to my teacher. I will raise my hand if I want to talk.

At recess, I will play with my friends. We will take turns. We will share toys.

When school is done, I will go home. I did a good job today!`,
    
    doctor: `Going to the Doctor

My name is ${name}. I am ${age} years old. Today I am going to see the doctor.

First, we will drive to the doctor's office. I will sit in my car seat.

When we get there, we will wait in the waiting room. I can read a book or play quietly.

Then the nurse will call my name. I will go into a room. The doctor will come in.

The doctor will check my body. The doctor will use tools. This is okay. The doctor helps me stay healthy.

When we are done, I will get a sticker! I am brave.`,
    
    playground: `Playing at the Playground

My name is ${name}. I am ${age} years old. Today I am going to the playground.

At the playground, I will see swings. I will see slides. I will see other children playing.

I can play on the swings. I will wait my turn if someone else is using them.

I can go down the slide. I will wait for the person in front of me to finish first.

I can play with other children. We can play together. This is fun!

When it is time to go, I will say goodbye. I had a good time at the playground.`
  }
  
  let baseStory = stories[scenario] || `My Social Story

My name is ${name}. I am ${age} years old. 

Today I will do something new. I will be brave. I will try my best.

Everything will be okay. I can do this!`
  
  // Incorporate custom details and concerns
  baseStory = incorporateContext(baseStory, customDetails, specificConcerns, scenario)
  
  // Adjust complexity based on language level
  if (languageLevel === 'advanced' && ageNum >= 8) {
    baseStory += `\n\nI feel proud when I try new things. Each day I learn something new.`
  }
  
  return {
    content: baseStory,
    formData
  }
}

// Function to update API key
export const setApiKey = (key) => {
  localStorage.setItem('openai_api_key', key)
}

// Function to clear API key
export const clearApiKey = () => {
  localStorage.removeItem('openai_api_key')
}

