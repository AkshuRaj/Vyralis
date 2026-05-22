# Vyralis

Analyze competitor YouTube presence and generate AI-powered intelligence reports instantly.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Python-blue)

## How It Works

Enter a company and up to 4 competitors. Vyralis will:

1. **Find channels** - Identifies official YouTube channels
2. **Gather data** - Pulls subscriber counts, views, video metrics
3. **Analyze** - AI-powered competitive insights
4. **Generate report** - Professional PowerPoint with charts and recommendations

**Try it:** Enter "Nike" + "Adidas, Puma" → Get instant competitive analysis

## Features

- Real-time YouTube data analysis
- AI-powered competitive insights  
- Professional PowerPoint reports
- Live progress tracking
- Graceful error handling
- CORS configured for production

## Requirements

- Python 3.11+
- Node.js 16+
- YouTube Data API key
- Groq API key

## Quick Start

### Get API Keys
- **YouTube API**: [Google Cloud Console](https://console.cloud.google.com/) → Enable YouTube Data API v3 → Create API Key
- **Groq API**: [Groq](https://console.groq.com) → Create API Key

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Add `.env` file with your API keys:
```
YOUTUBE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

Start server:
```bash
python main.py
```

Backend runs on `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Deploy

**Backend:** [Render](https://render.com)
**Frontend:** [Vercel](https://vercel.app)

Live: [https://vyralis.vercel.app](https://vyralis.vercel.app)

### API Rate Limiting

The system includes a 0.5-second delay between YouTube API calls. This is controlled in `backend/youtube.py`:

```python
RATE_LIMIT_DELAY = 0.5  # seconds
```

Adjust if needed based on your API quota. The default is safe for free tier usage.

### Gemini AI Prompts

The marketing analysis prompt is in `backend/gemini.py`. It instructs Gemini to think like a "Senior Video Marketing Strategist with 15+ years of experience". You can modify this prompt to:
- Change the persona or expertise level
- Add specific industries or use cases
- Customize the analysis framework
- Adjust the JSON response format

## 🐛 Troubleshooting

### "No YouTube channel found for {Company}"

This means the system couldn't find an official YouTube channel for that company name. Try:
## Tech Stack

- **Backend**: FastAPI + Python
- **Frontend**: React + Vite + Tailwind CSS
- **APIs**: YouTube Data API, Groq
- **Deployment**: Render (backend), Vercel (frontend)

## Project Structure

```
vyralis/
├── backend/
│   ├── main.py
│   ├── youtube.py
│   ├── gemini.py
│   ├── pptx_builder.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── components/
    ├── package.json
    └── vite.config.js
```

### 4. PowerPoint Report Generation
Creates a professional 12-slide report:
1. **Cover** - Company names, title, date
2. **Executive Summary** - Key findings and leader
3. **Channel Overview** - Comparison table
4. **Subscriber Comparison** - Bar chart
5. **Top Performing Videos** - By company
6. **Content Themes** - Topics covered
7. **Posting Frequency** - Consistency analysis
8. **Engagement Analysis** - Grouped bar chart
9. **Gap Analysis** - Opportunities
10. **Recommendations** - Priority-ranked actions
11. **Scorecard** - Performance metrics
12. **Thank You** - Winner announcement

## 🎨 Design

### Color Scheme
- **Navy** (#0A2342) - Headers and dark backgrounds
- **Red** (#E63946) - Accent, highlights, CTAs
- **White** (#FFFFFF) - Text on dark backgrounds
- **Gray** (#6B7280) - Body text on light backgrounds

### Typography
- **Font**: Calibri (backend), Segoe UI (frontend)
- **Titles**: 28-32pt
- **Body**: 12-14pt
- **Labels**: 10pt

### Theme
- Dark mode throughout for professional appearance
- Smooth animations and transitions
- Responsive design (mobile-first)
- Consistent spacing and padding

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS v3** - Styling
- **Fetch API** - HTTP requests

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **google-api-python-client** - YouTube API
- **google-generativeai** - Gemini API
- **python-pptx** - PowerPoint generation
- **matplotlib** - Chart generation
- **python-dotenv** - Environment variables

## 📝 API Documentation

### POST /analyse
Analyze companies and return JSON insights.

**Request:**
```json
{
  "company": "Nike",
  "competitors": ["Adidas", "Puma", "Under Armour"]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "executive_summary": "...",
    "channel_comparison": { ... },
    "content_themes": { ... },
    "posting_analysis": { ... },
    "engagement_analysis": { ... },
    "gap_analysis": { ... },
    "recommendations": [ ... ],
    "scorecard": { ... },
    "winner": "Nike"
  },
  "company_data": [ ... ],
  "failed_companies": null,
  "timestamp": "2026-05-20T..."
}
```

### POST /generate-report
Generate and download PowerPoint report.

**Request:**
```json
{
  "company": "Nike",
  "competitors": ["Adidas", "Puma"]
}
```

**Response:**
- File download: `competitor-report-nike-20260520_120000.pptx`
- Content-Type: `application/vnd.openxmlformats-officedocument.presentationml.presentation`

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## 🚀 Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect Railway to GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set `VITE_API_URL` environment variable to backend URL
4. Deploy automatically on push

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**
```
YOUTUBE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:8000  # Local development
VITE_API_URL=https://your-backend.com  # Production
```

## 🐛 Troubleshooting

### YouTube Channel Not Found
- Ensure company name is spelled correctly
- Some channels may be private or restricted
- Try searching for the channel manually on YouTube first

### Gemini API Errors
- Check API key is valid
- Verify quota limits not exceeded
- Ensure account has billing enabled (free tier has limits)

### CORS Errors
- Backend has CORS enabled for all origins
- Check frontend is using correct API URL
- Verify backend is running on correct port

### PowerPoint Won't Download
- Check browser console for errors
- Ensure backend is generating report correctly
- Try a different browser or clear cache

## 📚 Further Development

Potential enhancements:
- User authentication and saved reports
- Custom date ranges for analysis
- Export to PDF, Excel formats
- Real-time dashboard with live metrics
- Video transcript analysis
- Custom branding in PowerPoint
- Advanced filters and sorting
- Scheduled reports via email
- Competitor tracking over time

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API key validity
3. Check backend/frontend logs for errors
4. Verify network connectivity

---

**Built with ❤️ using React, FastAPI, and AI**
