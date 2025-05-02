import streamlit as st
import pandas as pd
from datetime import datetime
import os

# Config
st.set_page_config(page_title="Battle")
st.title("🎤 Arena Battle")

# Load song pool or fallback
if "songs" not in st.session_state:
    st.session_state.songs = [
        {"title": "Echo Drive", "artist": "Nova", "genre": "Synthwave"},
        {"title": "Firestorm", "artist": "Riotrix", "genre": "Hardstyle"},
        {"title": "Neon Bloom", "artist": "Glowkit", "genre": "Electro"},
        {"title": "Moonlight Bass", "artist": "Lunara", "genre": "Chill"},
    ]

song_titles = [s["title"] for s in st.session_state.songs]

# 🎯 Select songs manually
col1, col2 = st.columns(2)
song_a_title = col1.selectbox("🔵 Select Song A", song_titles, key="selectA")
song_b_title = col2.selectbox("🟣 Select Song B", song_titles, key="selectB")

if song_a_title == song_b_title:
    st.warning("Pick two different songs.")
    st.stop()

# Get song details
song_a = next(s for s in st.session_state.songs if s["title"] == song_a_title)
song_b = next(s for s in st.session_state.songs if s["title"] == song_b_title)

# Show song info
col1, col2 = st.columns(2)
with col1:
    st.subheader("🔵 Song A")
    st.markdown(f"**{song_a['title']}**\n*{song_a['artist']}*\n_{song_a['genre']}_")

with col2:
    st.subheader("🟣 Song B")
    st.markdown(f"**{song_b['title']}**\n*{song_b['artist']}*\n_{song_b['genre']}_")

# Rating sliders
st.markdown("---")
st.subheader("🎚️ Rate the Battle")

rating_fields = ["Originality", "Energy", "Lyrics", "Vocals", "Production"]
ratingsA, ratingsB = {}, {}

for f in rating_fields:
    l, r = st.columns(2)
    ratingsA[f] = l.slider(f"{f} – A", 1, 10, 5)
    ratingsB[f] = r.slider(f"{f} – B", 1, 10, 5)

# Submit
if st.button("Submit Ratings"):
    sA, sB = sum(ratingsA.values()), sum(ratingsB.values())
    winner = song_a["title"] if sA > sB else song_b["title"] if sB > sA else "Tie"

    file = "data/leaderboard.csv"
    if not os.path.exists(file):
        pd.DataFrame(columns=["Time", "Song A", "Song B", "Winner", "Score A", "Score B"]).to_csv(file, index=False)
    df = pd.read_csv(file)

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

    st.success(f"🎉 Winner: {winner}!")
    st.balloons()
