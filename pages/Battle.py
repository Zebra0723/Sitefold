import streamlit as st
from datetime import datetime
import random
import pandas as pd
import os

# Config
st.set_page_config(page_title="Battle")

# Ratings + song list
rating_fields = ["Originality", "Energy", "Lyrics", "Vocals", "Production"]
default_songs = [
    {"title": "Echo Drive", "artist": "Nova", "genre": "Synthwave"},
    {"title": "Firestorm", "artist": "Riotrix", "genre": "Hardstyle"},
    {"title": "Neon Bloom", "artist": "Glowkit", "genre": "Electro"},
    {"title": "Moonlight Bass", "artist": "Lunara", "genre": "Chill"},
]

# Load/create leaderboard
file = "data/leaderboard.csv"
if not os.path.exists(file):
    pd.DataFrame(columns=["Time", "Song A", "Song B", "Winner", "Score A", "Score B"]).to_csv(file, index=False)

df = pd.read_csv(file)

# Pick 2 songs
if "songs" not in st.session_state:
    st.session_state.songs = default_songs.copy()

if "battle" not in st.session_state:
    st.session_state.battle = random.sample(st.session_state.songs, 2)

song_a, song_b = st.session_state.battle

st.title("🎤 Arena Battle")

col1, col2 = st.columns(2)

with col1:
    st.subheader("🔵 Song A")
    st.markdown(f"**{song_a['title']}**  \n*{song_a['artist']}*  \n_{song_a['genre']}_")

with col2:
    st.subheader("🟣 Song B")
    st.markdown(f"**{song_b['title']}**  \n*{song_b['artist']}*  \n_{song_b['genre']}_")

st.markdown("---")
st.subheader("🎚️ Rate the Battle")

ratingsA, ratingsB = {}, {}
for f in rating_fields:
    l, r = st.columns(2)
    ratingsA[f] = l.slider(f"{f} – A", 1, 10, 5)
    ratingsB[f] = r.slider(f"{f} – B", 1, 10, 5)

if st.button("Submit Ratings"):
    sA = sum(ratingsA.values())
    sB = sum(ratingsB.values())
    winner = song_a["title"] if sA > sB else song_b["title"] if sB > sA else "Tie"

    new_row = {
        "Time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "Song A": song_a["title"],
        "Song B": song_b["title"],
        "Winner": winner,
        "Score A": sA,
        "Score B": sB
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(file, index=False)
    st.success(f"✅ Winner: {winner}")
    st.balloons()
    st.session_state.battle = random.sample(st.session_state.songs, 2)
    st.experimental_rerun()
