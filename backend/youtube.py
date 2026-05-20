import os
import time
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# Rate limiting
RATE_LIMIT_DELAY = 0.5  # seconds between API calls

def get_youtube_client():
    """Build YouTube API client."""
    if not YOUTUBE_API_KEY:
        raise ValueError("YOUTUBE_API_KEY not found in environment variables")
    return build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

def search_channel(company_name):
    """
    Find the official YouTube channel for a company.
    Returns channel info dict if found, None otherwise.
    """
    try:
        youtube = get_youtube_client()
        
        # Search for the company channel
        request = youtube.search().list(
            part="snippet",
            q=company_name,
            type="channel",
            maxResults=10,
            relevanceLanguage="en",
            order="relevance"
        )
        response = request.execute()
        time.sleep(RATE_LIMIT_DELAY)
        
        if not response.get("items"):
            print(f"No YouTube channels found for search: {company_name}")
            return None

        channel_ids = [item["snippet"]["channelId"] for item in response["items"]]
        print(f"Found {len(channel_ids)} potential channels for {company_name}")

        # Get statistics for all channels
        stats_request = youtube.channels().list(
            part="statistics,snippet",
            id=",".join(channel_ids)
        )
        stats_response = stats_request.execute()
        time.sleep(RATE_LIMIT_DELAY)

        if not stats_response.get("items"):
            return None

        # Score each channel to find the official one
        def score_channel(channel):
            title = channel["snippet"]["title"].lower()
            name = company_name.lower()
            subs = int(channel["statistics"].get("subscriberCount", 0))
            views = int(channel["statistics"].get("viewCount", 0))

            score = 0

            # Exact name match gets huge bonus
            if title == name:
                score += 1000000

            # Title starts with company name
            if title.startswith(name):
                score += 500000

            # Company name is in title
            if name in title:
                score += 100000

            # Avoid sub-channels and unofficial channels
            negative_keywords = [
                "football", "basketball", "soccer", "baseball", 
                "running", "training", "kids", "junior", "clips",
                "fan", "unofficial", "highlights", "shorts", "music", 
                "news", "live", "vevo", "gaming", "sports", "channel",
                "vlog", "vlogs", "clip", "compilation"
            ]
            for word in negative_keywords:
                if word in title:
                    score -= 200000

            # Add subscriber and view weight
            score += subs * 0.5
            score += views * 0.1

            return score

        best_channel = max(stats_response["items"], key=score_channel)
        
        print(f"Selected best channel: {best_channel['snippet']['title']} ({best_channel['id']})")

        return {
            "channel_id": best_channel["id"],
            "channel_name": best_channel["snippet"]["title"],
            "description": best_channel["snippet"]["description"]
        }
    
    except HttpError as e:
        print(f"YouTube API error searching for {company_name}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error searching for channel {company_name}: {e}")
        return None

def get_channel_stats(channel_id):
    """
    Get detailed statistics for a YouTube channel.
    Returns dict with channel stats or None on error.
    """
    try:
        youtube = get_youtube_client()
        request = youtube.channels().list(
            part="statistics,snippet,contentDetails",
            id=channel_id
        )
        response = request.execute()
        time.sleep(RATE_LIMIT_DELAY)
        
        if not response.get("items"):
            print(f"No stats found for channel ID: {channel_id}")
            return None
            
        item = response["items"][0]
        stats = item["statistics"]
        snippet = item["snippet"]
        
        return {
            "channel_id": channel_id,
            "title": snippet["title"],
            "description": snippet.get("description", ""),
            "country": snippet.get("country", "Unknown"),
            "published_at": snippet["publishedAt"],
            "subscriber_count": int(stats.get("subscriberCount", 0)),
            "video_count": int(stats.get("videoCount", 0)),
            "view_count": int(stats.get("viewCount", 0)),
            "uploads_playlist_id": item["contentDetails"]["relatedPlaylists"]["uploads"]
        }
    except HttpError as e:
        print(f"YouTube API error getting stats for channel {channel_id}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error getting channel stats: {e}")
        return None

def get_recent_videos(uploads_playlist_id, max_results=20):
    """
    Get recent videos from a channel's uploads playlist.
    Returns list of video dicts with statistics.
    """
    try:
        youtube = get_youtube_client()
        
        # Get playlist items (video IDs)
        request = youtube.playlistItems().list(
            part="snippet,contentDetails",
            playlistId=uploads_playlist_id,
            maxResults=max_results
        )
        response = request.execute()
        time.sleep(RATE_LIMIT_DELAY)
        
        video_ids = [item["contentDetails"]["videoId"] for item in response.get("items", [])]
        
        if not video_ids:
            print(f"No videos found in playlist: {uploads_playlist_id}")
            return []
        
        print(f"Fetching stats for {len(video_ids)} videos")
        
        # Get statistics for all videos
        stats_request = youtube.videos().list(
            part="statistics,snippet,contentDetails",
            id=",".join(video_ids)
        )
        stats_response = stats_request.execute()
        time.sleep(RATE_LIMIT_DELAY)
        
        videos = []
        for item in stats_response.get("items", []):
            stats = item.get("statistics", {})
            snippet = item.get("snippet", {})
            
            try:
                videos.append({
                    "video_id": item["id"],
                    "title": snippet.get("title", "Untitled"),
                    "published_at": snippet.get("publishedAt", ""),
                    "description": snippet.get("description", "")[:200],
                    "view_count": int(stats.get("viewCount", 0)),
                    "like_count": int(stats.get("likeCount", 0)),
                    "comment_count": int(stats.get("commentCount", 0)),
                    "duration": item.get("contentDetails", {}).get("duration", "PT0S")
                })
            except (ValueError, KeyError) as e:
                print(f"Error parsing video data: {e}")
                continue
        
        # Sort by view count descending
        videos.sort(key=lambda x: x["view_count"], reverse=True)
        print(f"Successfully fetched {len(videos)} videos")
        
        return videos
        
    except HttpError as e:
        print(f"YouTube API error getting videos from playlist {uploads_playlist_id}: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error getting recent videos: {e}")
        return []

def calculate_posting_frequency(videos):
    """
    Calculate estimated posts per month based on recent video dates.
    Returns float representing posts per month.
    """
    if len(videos) < 2:
        return 0
    
    try:
        # Parse dates
        dates = []
        for video in videos:
            try:
                date = datetime.fromisoformat(video["published_at"].replace("Z", "+00:00"))
                dates.append(date)
            except (ValueError, KeyError):
                continue
        
        if len(dates) < 2:
            return 0
        
        # Sort dates in ascending order (oldest first)
        dates.sort()
        
        # Calculate average days between posts
        total_days = (dates[-1] - dates[0]).days
        intervals = len(dates) - 1
        
        if total_days == 0 or intervals == 0:
            return 0
        
        avg_days_between = total_days / intervals
        
        # Convert to posts per month (30 days)
        posts_per_month = 30 / avg_days_between if avg_days_between > 0 else 0
        
        return round(posts_per_month, 2)
    
    except Exception as e:
        print(f"Error calculating posting frequency: {e}")
        return 0

def get_full_company_data(company_name):
    """
    Get complete YouTube data for a company.
    Returns dict with all company data or error dict if channel not found.
    """
    try:
        print(f"Fetching complete data for: {company_name}")
        
        # Find the company's official YouTube channel
        channel = search_channel(company_name)
        if not channel:
            return {"error": f"No official YouTube channel found for '{company_name}'"}
        
        # Get channel statistics
        channel_stats = get_channel_stats(channel["channel_id"])
        if not channel_stats:
            return {"error": f"Could not fetch channel statistics for '{company_name}'"}
        
        # Get recent videos
        videos = get_recent_videos(channel_stats["uploads_playlist_id"])
        
        # Calculate aggregates
        total_views = sum(v["view_count"] for v in videos)
        total_likes = sum(v["like_count"] for v in videos)
        total_comments = sum(v["comment_count"] for v in videos)
        video_count = len(videos) if videos else 1
        
        # Get top 5 videos by view count
        top_videos = videos[:5] if len(videos) >= 5 else videos
        
        # Calculate posting frequency
        posting_frequency = calculate_posting_frequency(videos)
        
        print(f"Successfully compiled data for {company_name}")
        
        return {
            "company_name": company_name,
            "channel_stats": channel_stats,
            "recent_videos": videos,
            "averages": {
                "avg_views": total_views // video_count,
                "avg_likes": total_likes // video_count,
                "avg_comments": total_comments // video_count
            },
            "top_videos": top_videos,
            "posting_frequency": posting_frequency
        }
        
    except Exception as e:
        print(f"Unexpected error in get_full_company_data: {e}")
        return {"error": f"Unexpected error fetching data for '{company_name}': {str(e)}"}