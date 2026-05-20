from gemini import analyse_companies

# Fake mini data to test
test_data = [
    {
        "company_name": "Nike",
        "channel_stats": {
            "title": "Nike",
            "subscriber_count": 48000000,
            "video_count": 1200,
            "view_count": 500000000,
            "country": "US",
            "published_at": "2006-01-01"
        },
        "recent_videos": [],
        "top_videos": [
            {"title": "Just Do It Campaign 2024", "view_count": 5000000, "like_count": 200000},
            {"title": "Nike Air Max Launch", "view_count": 3000000, "like_count": 150000}
        ],
        "averages": {"avg_views": 500000, "avg_likes": 20000, "avg_comments": 1000},
        "posting_frequency": 8
    },
    {
        "company_name": "Adidas",
        "channel_stats": {
            "title": "adidas",
            "subscriber_count": 12000000,
            "video_count": 800,
            "view_count": 200000000,
            "country": "DE",
            "published_at": "2007-01-01"
        },
        "recent_videos": [],
        "top_videos": [
            {"title": "Adidas Originals New Drop", "view_count": 2000000, "like_count": 80000},
            {"title": "Football Collection 2024", "view_count": 1500000, "like_count": 60000}
        ],
        "averages": {"avg_views": 200000, "avg_likes": 8000, "avg_comments": 400},
        "posting_frequency": 5
    }
]

print("Testing full analysis...")
result = analyse_companies(test_data)

import json
print(json.dumps(result, indent=2)[:1000])