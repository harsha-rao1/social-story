// Free image service using Unsplash API (no key needed for basic usage)
// Can be upgraded to paid services later (DALL-E, Midjourney, etc.)

const UNSPLASH_BASE = 'https://source.unsplash.com/800x600/?'

// Map scenarios to search terms for Unsplash
const scenarioKeywords = {
  school: 'classroom,children,teacher',
  doctor: 'doctor,medical,clinic',
  playground: 'playground,children,playing',
  shopping: 'shopping,store,supermarket',
  restaurant: 'restaurant,food,dining',
  birthday: 'birthday,party,cake',
  haircut: 'haircut,salon,barber',
  dentist: 'dentist,dental,teeth',
  library: 'library,books,reading',
  other: 'children,happy,smiling'
}

export const getImageUrl = (scenario, prompt) => {
  const keywords = scenarioKeywords[scenario] || scenarioKeywords.other
  const searchTerm = prompt ? prompt.toLowerCase().replace(/\s+/g, ',') : keywords
  // Unsplash free API - no key needed
  return `${UNSPLASH_BASE}${encodeURIComponent(searchTerm)}`
}

export const getImagesForStory = async (scenario, visualPrompts) => {
  // Return image URLs for the first few prompts
  const imagePrompts = visualPrompts.slice(0, 4) // Get first 4 images
  return imagePrompts.map(prompt => ({
    url: getImageUrl(scenario, prompt),
    prompt: prompt,
    alt: prompt
  }))
}

// Alternative: Use placeholder images (completely free, no API calls)
export const getPlaceholderImages = (scenario, count = 4) => {
  const baseUrl = 'https://picsum.photos/800/600?random='
  return Array.from({ length: count }, (_, i) => ({
    url: `${baseUrl}${Date.now()}-${i}`,
    prompt: `Story image ${i + 1}`,
    alt: `Illustration for ${scenario} story`
  }))
}

