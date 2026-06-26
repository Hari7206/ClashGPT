// Mock data and sample responses for demonstration

export const SAMPLE_CONVERSATIONS = [
  {
    id: '1',
    title: 'Capital of Nepal',
    preview: 'What is the capital of Nepal?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    favorite: false,
  },
  {
    id: '2',
    title: 'React vs Vue comparison',
    preview: 'Compare React and Vue.js frameworks',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    favorite: true,
  },
  {
    id: '3',
    title: 'Quantum Computing Explained',
    preview: 'Explain quantum computing simply',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    favorite: false,
  },
  {
    id: '4',
    title: 'Python vs JavaScript',
    preview: 'Which is better Python or JavaScript?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    favorite: true,
  },
];

export const SAMPLE_RESPONSE = {
  message: "What is the capital of Nepal?",
  solution_1: `# The Capital of Nepal

The capital of Nepal is **Kathmandu** (also spelled *Kathmandu* or *Kāthmāṇḍu*).

## Key Facts

- **Official Name**: Kathmandu Metropolitan City
- **Population**: ~1.5 million (city), ~4 million (metropolitan area)
- **Elevation**: 1,400 meters (4,600 ft) above sea level
- **Founded**: Around 723 AD

## Historical Significance

Kathmandu has been the seat of power for centuries. It is home to:

1. **Pashupatinath Temple** — One of the most sacred Hindu temples
2. **Boudhanath Stupa** — A UNESCO World Heritage Site
3. **Swayambhunath** — Known as the *Monkey Temple*
4. **Durbar Square** — Ancient royal palace complexes

> "Kathmandu is a city where gods and humans coexist in a beautiful harmony of ancient traditions and modern life."

## Geography

The city is located in the **Kathmandu Valley**, surrounded by Himalayan peaks.

\`\`\`json
{
  "city": "Kathmandu",
  "country": "Nepal",
  "coordinates": {
    "latitude": 27.7172,
    "longitude": 85.3240
  },
  "timezone": "Asia/Kathmandu"
}
\`\`\`

---

Kathmandu serves as the **political, cultural, and economic hub** of Nepal.`,

  solution_2: `## Nepal's Capital City

**Kathmandu** is the capital and largest city of Nepal.

### Quick Overview

| Attribute | Details |
|-----------|---------|
| City Name | Kathmandu |
| Country | Nepal |
| Population | ~1.5 million |
| Altitude | 1,400m |
| Language | Nepali |

### Why Kathmandu?

Kathmandu became Nepal's capital due to its central location in the **Kathmandu Valley** and its historical importance as the center of the Malla Kingdom.

### Modern Kathmandu

Today, Kathmandu is:

- The hub of **tourism** in Nepal (gateway to Mt. Everest treks)
- Home to **Tribhuvan International Airport** — the only international airport
- The **economic center** with most corporate headquarters

### Code Example: Location Data

\`\`\`python
import geopy

kathmandu = {
    "name": "Kathmandu",
    "lat": 27.7172,
    "lon": 85.3240,
    "country": "Nepal"
}

# Calculate distance from equator
print(f"Distance from equator: {kathmandu['lat']}°N")
\`\`\`

The city attracts over **1 million tourists** annually, primarily mountaineers and trekkers.`,

  judge_recommendation: {
    solution_1_score: 8,
    solution_2_score: 7,
  }
};

export const AI_MODELS = [
  { id: 'mistral', name: 'Mistral AI', icon: '🧠', color: '#22d3ee', badge: 'Fast' },
  { id: 'cohere', name: 'Cohere AI', icon: '⚡', color: '#a78bfa', badge: 'Powerful' },
  { id: 'gpt4', name: 'GPT-4o', icon: '🤖', color: '#34d399', badge: 'Smart' },
  { id: 'claude', name: 'Claude 3', icon: '🌟', color: '#fbbf24', badge: 'Safe' },
  { id: 'gemini', name: 'Gemini Pro', icon: '💎', color: '#f87171', badge: 'Google' },
  { id: 'llama', name: 'LLaMA 3', icon: '🦙', color: '#fb923c', badge: 'Open' },
];

export const formatTimestamp = (date) => {
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

export const countWords = (text) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const getQualityLabel = (score) => {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Fair';
  return 'Poor';
};

export const getQualityColor = (score) => {
  if (score >= 9) return '#34d399';
  if (score >= 7) return '#22d3ee';
  if (score >= 5) return '#fbbf24';
  return '#f87171';
};
