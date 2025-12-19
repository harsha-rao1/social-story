# 🌟 Social Story Generator

An AI-powered tool for creating personalized social stories for children with autism. This application helps therapists and educators generate custom social stories based on scenarios, age, and language level.

## ✨ Features

- **AI-Powered Generation**: Uses OpenAI GPT models to generate age-appropriate social stories
- **Structured Input**: Easy-to-use form with scenario selection, age, and language level options
- **Editable Output**: Review and edit generated stories before use
- **Interactive Storybook View**: Beautiful storybook with images and text-to-speech narration (FREE!)
- **Visual Prompts**: AI-suggested visual prompts for each story
- **Text-to-Speech**: Browser-based narration using Web Speech API (completely free)
- **Story History**: Save and access previously generated stories
- **Export Functionality**: Download stories as text files
- **Professional UI**: Modern, responsive design perfect for customer demos

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key (get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys))

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Using the Application

1. **Set API Key**: Enter your OpenAI API key in the form (stored locally in browser)
2. **Fill Form**: 
   - Select a scenario (school, doctor visit, playground, etc.)
   - Enter child's age
   - Choose language level
   - Optionally add child's name and additional context
3. **Generate**: Click "Generate Social Story" and wait for AI generation
4. **Review & Edit**: Review the generated story and edit as needed
5. **View Storybook**: Click "Storybook" button to see interactive view with images and narration
6. **Play Story**: Click "Play Story" to hear text-to-speech narration (auto-advances pages)
7. **Save/Export**: Save to history or download as text file

## 🎯 Use Cases

- **Therapists**: Quickly create personalized social stories for clients
- **Educators**: Generate stories for classroom situations
- **Parents**: Create stories for home situations
- **Training**: Demonstrate responsible AI use in pediatric education

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Custom CSS with modern gradients and animations
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o-mini API
- **Images**: Picsum Photos (free placeholder images - can upgrade to DALL-E/Unsplash)
- **Text-to-Speech**: Web Speech API (browser-native, completely free)
- **Storage**: LocalStorage for story history

## 📋 Available Scenarios

- School
- Doctor Visit
- Playground
- Shopping
- Restaurant
- Birthday Party
- Haircut
- Dentist Visit
- Library
- Custom/Other

## 🔒 Privacy & Security

- API keys are stored locally in browser localStorage
- No data is sent to external servers except OpenAI API
- Stories are stored locally in your browser
- For production use, implement a backend server to securely handle API keys

## 🎨 Demo Features

This application is designed to be impressive for customer demos:

- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile
- **Interactive**: Real-time editing, copy, download features
- **Professional**: Clean, accessible interface suitable for presentations

## 📝 Academic Value

This project demonstrates:

- Responsible GenAI use in pediatric education
- Human-in-the-loop AI systems (mandatory review)
- Age-appropriate content generation
- Ethical AI application in healthcare/education contexts

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a demo project. Feel free to fork and modify for your needs!

## 💡 Tips for Demo

1. **Prepare API Key**: Have an OpenAI API key ready before demo
2. **Test Scenarios**: Try different scenarios to show versatility
3. **Show Editing**: Demonstrate the edit functionality
4. **Highlight Visual Prompts**: Explain how these help with story illustration
5. **Show History**: Demonstrate saving and loading previous stories

---

Built with ❤️ for helping children with autism navigate social situations.
