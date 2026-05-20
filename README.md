# Video Competitor Intelligence & Report Generator

A full-stack web application that analyzes YouTube channel presence across competitors and generates AI-powered intelligence reports with professional PowerPoint downloads. Built with React, FastAPI, Python, and powered by Google APIs.

![Architecture](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Python-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 What It Does

Enter a company name and up to 4 competitors. The system:

1. **Finds official YouTube channels** - Uses advanced scoring to identify the real company channel (not fan pages or sub-channels)
2. **Fetches real data** - Pulls subscriber counts, view metrics, video performance stats, and publishing patterns
3. **Analyzes with AI** - Sends data to Google Gemini API for strategic marketing insights from a "senior marketing strategist" perspective
4. **Generates reports** - Creates professional 12-13 slide PowerPoint presentations with charts, rankings, and actionable recommendations
5. **Shows live progress** - Frontend displays real-time progress (finding channels → fetching data → AI analysis → building report)

**Example**: Enter "Nike" + competitors "Adidas, Puma, Reebok" → Get professional competitive analysis in PowerPoint

## ✨ Key Features

- ✅ **No placeholder code** - Every function works with real YouTube data
- ✅ **Professional PowerPoint** - 12+ slides with charts, tables, and client-ready design
- ✅ **Real marketing insights** - Gemini analyzes like a CMO, not a statistician
- ✅ **Error handling** - Gracefully skips companies without YouTube channels
- ✅ **Rate limiting** - 0.5s delays between API calls to respect quota limits
- ✅ **Live progress** - Users see what's happening (no frozen screen)
- ✅ **Proper CORS** - Configured for localhost:5173 and Vercel deployments
- ✅ **Environment variables** - All API keys loaded from .env using python-dotenv
- ✅ **Engagement analysis** - Calculates like/comment ratios and audience insights
- ✅ **Content theme detection** - Analyzes video titles to identify content strategy

## 📋 System Requirements

- Python 3.9+
- Node.js 16+
- Google Cloud account (for YouTube API)
- Google AI Studio account (for Gemini API)

## 🚀 Quick Start

### Step 1: Get Your API Keys

#### YouTube Data API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Search for "YouTube Data API v3" and enable it
4. Go to Credentials → Create API Key (choose "API key", not OAuth)
5. Copy your API key

#### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your key

### Step 2: Backend Setup

```bash
cd backend

# Create .env file with your API keys
cp ../.env.example .env
# Edit .env and add your actual API keys
nano .env

# Create Python virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Server starts on `http://localhost:8000`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional, for custom backend)
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

App runs on `http://localhost:5173`

### Step 4: Use It!

1. Open http://localhost:5173 in your browser
2. Enter a company name (e.g., "Nike")
3. Add 1-4 competitors (e.g., "Adidas", "Puma")
4. Click "Analyze"
5. Wait 20-40 seconds for analysis (progress shown on screen)
6. Review the analysis in the web preview
7. Click "Download PowerPoint Report" for the full presentation

## 📊 What You Get

### Online Preview Shows:
- 🏆 Overall winner with detailed reasoning
- 📈 Channel overview for all companies
- 📊 Subscriber/view/engagement comparisons
- 💬 Content themes and strategy analysis
- 📱 Top performing videos per channel
- 🎯 Engagement analysis and tips
- 🔍 Content gaps and opportunities
- ⭐ Performance scorecard

### PowerPoint Report Includes:
1. **Cover Slide** - Professional title slide
2. **Executive Summary** - High-level insights and winner announcement
3. **Channel Overview** - Comparison table of all metrics
4. **Subscriber Chart** - Visual comparison of subscriber counts
5. **Top Videos** - Best performing video per company
6. **Content Themes** - What each company's content is about
7. **Posting Frequency** - Consistency analysis and patterns
8. **Engagement Analysis** - Likes, comments, audience response
9. **Gap Analysis** - Untapped opportunities and content gaps
10. **Recommendations** - Prioritized actionable strategies
11. **Scorecard** - Detailed scoring across all dimensions
12. **Winner Summary** - Final conclusions and key insight
13. (Optional) **Notes** - Companies that couldn't be found

## 🔧 Configuration

### CORS (Cross-Origin Resource Sharing)

The backend is configured to allow requests from:
- `http://localhost:5173` (local development)
- `http://127.0.0.1:5173` (local development alternative)
- `https://*.vercel.app` (Vercel deployments)
- Custom domain via `FRONTEND_URL` environment variable

To add more origins, edit `backend/main.py`:

```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://yourdomain.com",
    "https://yourapp.vercel.app"
]
```

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
- Using a different name format ("The Nike Company" vs "Nike")
- Checking if the company actually has a YouTube channel
- Looking up the exact channel name on YouTube and using that

### "YOUTUBE_API_KEY not found"

Make sure your `.env` file is in the `backend/` directory with your actual API key:

```bash
cd backend
ls -la .env  # Should exist and not be empty
```

### "Gemini API error" or "Failed to parse JSON"

This usually means:
- Your Gemini API key is invalid or expired
- Rate limit exceeded (try again in a few minutes)
- Network connectivity issue

Check:
```bash
curl "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_KEY_HERE"
```

### "CORS error: blocked by Cross-Origin Resource Sharing policy"

The frontend is trying to connect to a backend URL not in the allowed list. Check:
1. Frontend is making requests to `http://localhost:8000` ✓
2. If deployed, backend `FRONTEND_URL` is set correctly
3. No typos in CORS configuration

### Analysis takes too long / times out

YouTube API calls take time, especially if downloading 20 videos per company. This is normal:
- First company: ~8 seconds
- Additional companies: ~5-7 seconds each
- AI analysis: ~10-12 seconds

Total expected: 20-40 seconds. If it takes longer:
- Check your internet speed
- Verify API keys are valid
- Check YouTube API quotas in Google Cloud Console

## 🚀 Deployment

### Deploy Backend (Python/FastAPI)

**Option 1: Heroku**
```bash
# Create Procfile in backend/
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt

# Set environment variables in Heroku dashboard
heroku config:set YOUTUBE_API_KEY=your_key
heroku config:set GEMINI_API_KEY=your_key
heroku config:set FRONTEND_URL=https://yourfrontend.vercel.app

# Deploy
git push heroku main
```

**Option 2: Railway**
```bash
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
# Railway auto-detects FastAPI and deploys
```

**Option 3: Render**
- Connect GitHub repo to Render
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Set environment variables in Render dashboard

### Deploy Frontend (React/Vite)

**Option: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
# Enter your backend URL: https://yourbackend.herokuapp.com
```

**Alternative: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir frontend/dist

# Set environment variable in dashboard
VITE_API_URL=https://yourbackend.com
```

## 📦 Project Structure

```
video-comp-tool/
├── backend/
│   ├── main.py           # FastAPI server with endpoints
│   ├── youtube.py        # YouTube API integration
│   ├── gemini.py         # Gemini AI analysis
│   ├── pptx_builder.py   # PowerPoint generation
│   ├── requirements.txt   # Python dependencies
│   └── .env             # API keys (create from .env.example)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── components/
│   │   │   ├── InputForm.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ReportPreview.jsx
│   │   │   └── DownloadButton.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env.example          # API key template
└── README.md            # This file
```

## 🔐 Security Notes

- **Never commit `.env` files** - Add to `.gitignore`
- **Rotate API keys regularly** in production
- **Use environment variables** for all secrets
- **CORS is restricted** to specific domains in production
- **Rate limiting is enabled** to prevent API quota abuse
- **API keys are not logged** anywhere in the system

## 📈 Performance

- Finding channels: ~3-5 seconds total
- Fetching video data: ~5-8 seconds total
- AI analysis: ~8-15 seconds (depends on Gemini)
- Building PowerPoint: ~2-3 seconds
- **Total time: 20-40 seconds** (shown in progress UI)

Each company adds ~3-5 seconds of API calls.

## 🤖 How the AI Works

The Gemini API is prompted to analyze like a "Senior Marketing Strategist", not a statistician. The prompt specifically asks for:
- Comparative analysis (not just individual stats)
- Strategic positioning and competitive dynamics
- Content gaps and untapped opportunities
- Specific, data-driven recommendations with expected impact
- Engagement quality analysis (not just raw numbers)
- Actionable insights for THIS MONTH

This produces real marketing strategy, not generic observations.

## 📝 API Endpoints

### POST `/analyse`
Returns analysis without generating report.
```json
{
  "company": "Nike",
  "competitors": ["Adidas", "Puma"]
}
```

Response includes: `analysis`, `company_data`, `failed_companies` (if any)

### POST `/generate-report`
Analyzes and generates PowerPoint (.pptx file).
```json
{
  "company": "Nike",
  "competitors": ["Adidas", "Puma"]
}
```

Returns: Binary PowerPoint file with `Content-Disposition` header

### GET `/health`
Health check endpoint for monitoring.

## 🎓 Learning Resources

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Google Gemini API Docs](https://ai.google.dev/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [python-pptx Docs](https://python-pptx.readthedocs.io/)

## 🤝 Contributing

Feel free to:
- Improve the Gemini prompt for better insights
- Add more analysis features
- Optimize API calls
- Enhance the PowerPoint design
- Improve error handling

## 📄 License

MIT License - feel free to use, modify, and deploy!

## ⚡ Pro Tips

1. **Test with Nike vs Adidas** - Both have large official channels with lots of data
2. **Names matter** - Use official company names ("Apple Inc" not "Apple Music")
3. **Check YouTube directly** - If unsure, search for the company on YouTube first
4. **Read the report carefully** - Scroll through the web preview before downloading
5. **Download early** - Generate PowerPoint while reviewing the web preview
6. **Scale cautiously** - Each analysis uses ~10 YouTube API calls and 1 Gemini call

## 🚨 Known Limitations

- Some companies may not have official YouTube channels
- YouTube API has daily quotas (depends on your plan)
- Gemini API has rate limits (free tier: 60 calls/minute)
- Very new channels may have limited video history
- Regional differences may affect channel discovery

---

**Built with ❤️ using React, FastAPI, and Google APIs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
# Opens on http://localhost:5173
```

## 📁 Project Structure

```
video-competitor-tool/
├── backend/
│   ├── main.py              # FastAPI server with CORS
│   ├── youtube.py           # YouTube data fetching with smart channel detection
│   ├── gemini.py            # Google Gemini AI analysis
│   ├── pptx_builder.py      # Professional PowerPoint generation
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # API keys (create from .env.example)
│
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main app with state management
    │   ├── App.css          # Global styles
    │   ├── index.css        # Tailwind CSS imports
    │   ├── main.jsx         # React entry point
    │   └── components/
    │       ├── InputForm.jsx        # Company/competitor form
    │       ├── LoadingState.jsx     # Loading screen
    │       ├── ReportPreview.jsx    # Results display
    │       └── DownloadButton.jsx   # PowerPoint download
    ├── index.html           # HTML template
    ├── vite.config.js       # Vite configuration
    ├── tailwind.config.js   # Tailwind configuration
    ├── postcss.config.js    # PostCSS configuration
    ├── package.json         # Node dependencies
    ├── .env.local           # Local API URL
    └── .env.example         # Environment variables template
```

## 🎯 How It Works

### 1. User Input
User enters their company name and 1-4 competitors in the form.

### 2. YouTube Data Fetching
- Searches YouTube for each company's official channel
- Uses smart scoring algorithm to identify official channels (not fan/sub-channels)
- Fetches 20 recent videos with engagement metrics
- Calculates: subscribers, total views, posting frequency, engagement rates

### 3. AI Analysis (Gemini)
- Sends all company data to Google Gemini API
- Acts as a senior video marketing strategist
- Generates comparative insights including:
  - Executive summary with leader identification
  - Content theme analysis
  - Posting pattern consistency
  - Engagement benchmark analysis
  - Gap analysis with opportunities
  - Actionable recommendations
  - Performance scorecard

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
