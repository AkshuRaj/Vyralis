import os
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def get_youtube_client():
    return build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

def search_channel(company_name):
    youtube = get_youtube_client()
    
    # Try exact match first
    request = youtube.search().list(
        part="snippet",
        q=company_name,
        type="channel",
        maxResults=10
    )
    response = request.execute()
    if not response["items"]:
        return None

    channel_ids = [item["snippet"]["channelId"] for item in response["items"]]

    stats_request = youtube.channels().list(
        part="statistics,snippet",
        id=",".join(channel_ids)
    )
    stats_response = stats_request.execute()

    # Score each channel
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

        # Avoid sub-channels (Football, Basketball etc)
        keywords = ["football", "basketball", "soccer", "baseball", 
                   "running", "training", "kids", "junior", "clips",
                   "fan", "unofficial", "highlights", "shorts"]
        for word in keywords:
            if word in title:
                score -= 200000

        # Add subscriber and view weight
        score += subs * 0.5
        score += views * 0.1

        return score

    best_channel = max(stats_response["items"], key=score_channel)

    return {
        "channel_id": best_channel["id"],
        "channel_name": best_channel["snippet"]["title"],
        "description": best_channel["snippet"]["description"]
    }

def get_channel_stats(channel_id):
    youtube = get_youtube_client()
    request = youtube.channels().list(
        part="statistics,snippet,contentDetails",
        id=channel_id
    )
    response = request.execute()
    if not response["items"]:
        return None
    item = response["items"][0]
    stats = item["statistics"]
    snippet = item["snippet"]
    return {
        "channel_id": channel_id,
        "title": snippet["title"],
        "description": snippet["description"],
        "country": snippet.get("country", "N/A"),
        "published_at": snippet["publishedAt"],
        "subscriber_count": int(stats.get("subscriberCount", 0)),
        "video_count": int(stats.get("videoCount", 0)),
        "view_count": int(stats.get("viewCount", 0)),
        "uploads_playlist_id": item["contentDetails"]["relatedPlaylists"]["uploads"]
    }

def get_recent_videos(uploads_playlist_id, max_results=20):
    youtube = get_youtube_client()
    request = youtube.playlistItems().list(
        part="snippet,contentDetails",
        playlistId=uploads_playlist_id,
        maxResults=max_results
    )
    response = request.execute()
    video_ids = []
    for item in response["items"]:
        video_ids.append(item["contentDetails"]["videoId"])
    if not video_ids:
        return []
    stats_request = youtube.videos().list(
        part="statistics,snippet,contentDetails",
        id=",".join(video_ids)
    )
    stats_response = stats_request.execute()
    videos = []
    for item in stats_response["items"]:
        stats = item["statistics"]
        snippet = item["snippet"]
        videos.append({
            "video_id": item["id"],
            "title": snippet["title"],
            "published_at": snippet["publishedAt"],
            "description": snippet["description"][:200],
            "view_count": int(stats.get("viewCount", 0)),
            "like_count": int(stats.get("likeCount", 0)),
            "comment_count": int(stats.get("commentCount", 0)),
            "duration": item["contentDetails"]["duration"]
        })
    videos.sort(key=lambda x: x["view_count"], reverse=True)
    return videos

def get_full_company_data(company_name):
    print(f"Fetching data for: {company_name}")
    channel = search_channel(company_name)
    if not channel:
        return {"error": f"No channel found for {company_name}"}
    channel_stats = get_channel_stats(channel["channel_id"])
    if not channel_stats:
        return {"error": f"Could not fetch stats for {company_name}"}
    videos = get_recent_videos(channel_stats["uploads_playlist_id"])
    total_views = sum(v["view_count"] for v in videos)
    total_likes = sum(v["like_count"] for v in videos)
    total_comments = sum(v["comment_count"] for v in videos)
    count = len(videos) if videos else 1
    return {
        "company_name": company_name,
        "channel_stats": channel_stats,
        "recent_videos": videos,
        "averages": {
            "avg_views": total_views // count,
            "avg_likes": total_likes // count,
            "avg_comments": total_comments // count
        }
    }