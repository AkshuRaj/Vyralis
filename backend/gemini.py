import os
import json
import re
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyse_companies(all_company_data: list) -> dict:
    companies_summary = format_companies_data(all_company_data)
    
    prompt = f"""You are a Senior Video Marketing Strategist with 15+ years of experience.
Analyze this YouTube data and return ONLY valid JSON with no markdown or code blocks.

COMPANY DATA:
{companies_summary}

Return this exact JSON structure:
{{
  "executive_summary": "2-3 sentences on who leads and why",
  "channel_comparison": {{
    "leader": "company name",
    "reasoning": "why they lead with specific metrics",
    "rankings": [
      {{"company": "name", "rank": 1, "subscriber_count": 1000000, "reason": "specific reason"}}
    ]
  }},
  "content_themes": {{
    "company_name": {{
      "main_topics": ["topic1", "topic2"],
      "content_style": "description",
      "missing_topics": ["gap1", "gap2"]
    }}
  }},
  "engagement_analysis": {{
    "best_performer": "company name",
    "engagement_rate_insight": "analysis",
    "engagement_opportunities": ["opportunity1", "opportunity2"]
  }},
  "posting_strategy": {{
    "most_consistent": "company name",
    "frequency_insight": "X posts per month",
    "posting_pattern": "analysis"
  }},
  "competitive_gap_analysis": {{
    "biggest_opportunity": "specific opportunity",
    "content_gap": "type of content nobody produces",
    "supporting_evidence": "why this will work"
  }},
  "strategic_recommendations": [
    {{
      "priority": "Immediate",
      "action": "specific action",
      "reasoning": "why this works",
      "expected_impact": "quantified result"
    }},
    {{
      "priority": "High",
      "action": "action",
      "reasoning": "why",
      "expected_impact": "impact"
    }},
    {{
      "priority": "Medium",
      "action": "action",
      "reasoning": "why",
      "expected_impact": "impact"
    }}
  ],
  "performance_scorecard": {{
    "company_name": {{
      "subscriber_growth_potential": 8,
      "engagement_quality": 7,
      "content_consistency": 9,
      "audience_loyalty": 8,
      "strategic_positioning": 7,
      "overall_score": 8
    }}
  }},
  "overall_winner": "company name",
  "key_insight": "most important competitive dynamic"
}}"""

    try:
        print("Sending analysis request to Groq...")
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000,
        )
        
        response_text = response.choices[0].message.content.strip()
        print(f"Groq response length: {len(response_text)} characters")
        
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            response_text = json_match.group(0)
        
        analysis = json.loads(response_text)
        print("Successfully parsed analysis JSON")
        return analysis
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return {
            "error": "Failed to parse analysis",
            "details": str(e),
            "fallback": True
        }
    except Exception as e:
        print(f"Groq API error: {e}")
        return {
            "error": f"API error: {str(e)}",
            "fallback": True
        }


def analyze_video_titles(videos: list) -> list:
    if not videos:
        return []
    topics = {}
    keywords = {
        "tutorials": ["tutorial", "how to", "guide", "lesson", "tip"],
        "reviews": ["review", "unboxing", "comparison", "vs"],
        "lifestyle": ["vlog", "day in the life", "behind the scenes"],
        "performance": ["performance", "test", "challenge"],
        "announcements": ["new", "reveal", "launch", "release", "introducing"],
    }
    for video in videos[:20]:
        title_lower = video.get("title", "").lower()
        for topic, keyword_list in keywords.items():
            for keyword in keyword_list:
                if keyword in title_lower:
                    topics[topic] = topics.get(topic, 0) + 1
                    break
    sorted_topics = sorted(topics.items(), key=lambda x: x[1], reverse=True)
    return [topic for topic, count in sorted_topics[:3]]


def calculate_engagement_rate(videos: list) -> dict:
    if not videos:
        return {"avg_like_ratio": 0, "avg_comment_ratio": 0, "total_engagement_rate": 0}
    total_views = sum(v.get("view_count", 1) for v in videos)
    total_likes = sum(v.get("like_count", 0) for v in videos)
    total_comments = sum(v.get("comment_count", 0) for v in videos)
    avg_like_ratio = (total_likes / total_views * 100) if total_views > 0 else 0
    avg_comment_ratio = (total_comments / total_views * 100) if total_views > 0 else 0
    return {
        "avg_like_ratio": round(avg_like_ratio, 2),
        "avg_comment_ratio": round(avg_comment_ratio, 2),
        "total_engagement_rate": round((total_likes + total_comments) / total_views * 100, 2) if total_views > 0 else 0
    }


def format_companies_data(all_company_data: list) -> str:
    formatted = []
    for company in all_company_data:
        if "error" in company:
            formatted.append(f"⚠️ {company.get('company_name', 'Unknown')}: NO DATA")
            continue
        stats = company.get("channel_stats", {})
        averages = company.get("averages", {})
        videos = company.get("recent_videos", [])
        top_videos = company.get("top_videos", [])
        posting_freq = company.get("posting_frequency", 0)
        topics = analyze_video_titles(videos)
        engagement = calculate_engagement_rate(videos)
        company_text = f"""
COMPANY: {company.get('company_name', 'Unknown').upper()}
  Subscribers: {stats.get('subscriber_count', 0):,}
  Total Videos: {stats.get('video_count', 0)}
  Total Views: {stats.get('view_count', 0):,}
  Avg Views/Video: {averages.get('avg_views', 0):,}
  Avg Likes/Video: {averages.get('avg_likes', 0):,}
  Avg Comments/Video: {averages.get('avg_comments', 0):,}
  Engagement Rate: {engagement.get('total_engagement_rate', 0):.2f}%
  Posting Frequency: {posting_freq} posts/month
  Main Topics: {', '.join(topics) if topics else 'Mixed content'}

TOP VIDEOS:"""
        for i, video in enumerate(top_videos[:3], 1):
            views = video.get('view_count', 0)
            likes = video.get('like_count', 0)
            company_text += f"\n  {i}. \"{video.get('title', '')[:60]}\" - {views:,} views, {likes:,} likes"
        formatted.append(company_text)
    return "\n".join(formatted)