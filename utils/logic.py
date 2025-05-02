# utils/logic.py

# 💥 Rating categories used across the entire app
rating_fields = ["Originality", "Energy", "Lyrics", "Vocals", "Production"]

# 💀 Boss song names that trigger boss fight mode
BOSS_SONGS = ["Firestorm", "Crimson Keys", "Nova Drop"]

# 🧮 Score calculator (sum of sliders)
def total_score(ratings: dict) -> int:
    return sum(ratings.values())
