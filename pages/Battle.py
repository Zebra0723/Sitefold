# Battle.py – SongArena Battle Page
import streamlit as st
import pandas as pd
import random
import os
from datetime import datetime

from utils.storage import load_lb, save_lb, load_hall, save_hall
from utils.effects import show_confetti, get_rank_emoji, boss_fight_effect
from utils.state import init_state, pick_two_songs
from utils.logic import total_score, BOSS_SONGS, rating_fields

init_state()

st.title("🎤 Arena Battle")
st.caption("Rate two songs. Boss tracks may appear...")

# 🔀 Choose songs
song_a, song_b = st.session_state.battle
edit = st.checkbox("✏️ Edit Current Songs")

col1, col2 = st.columns(2)

# 🔵 Song A
with col1:
    st.subheader("🔵 Song A")
    if edit:
        song_a["title"]  = st.text_input("Title A", song_a["title"])
        song_a["artist"] = st.text_input("Artist A", song_a["artist"])
        song_a["genre"]  = st.text_input("Genre A", song_a["genre"])
    else:
        st.write(f"**{song_a['title']}**")
        st.caption(f"*{song_a['artist']}*")
        st.caption(f"`{song_a['genre']}`")

# 🟣 Song B
with col2:
    st.subheader("🟣 Song B")
    if edit:
        song_b["title"]  = st.text_input("Title B", song_b["title"])
        song_b["artist"] = st.text_input("Artist B", song_b["artist"])
        song_b["genre"]  = st.text_input("Genre B", song_b["genre"])
    else:
        st.write(f"**{song_b['title']}**")
        st.caption(f"*{song_b['artist']}*")
        st.caption(f"`{song_b['genre']}`")

# 🔮 Boss alert
if any(s["title"] in BOSS_SONGS for s in [song_a, song_b]):
    boss_fight_effect()

st.markdown("---")
st.header("🎚️ Rate This Battle")

ratingsA, ratingsB = {}, {}
for f in rating_fields:
    l, r = st.columns(2)
    ratingsA[f] = l.slider(f"{f} – A", 1, 10, 5)
    ratingsB[f] = r.slider(f"{f} – B", 1, 10, 5)

# 💾 Submission
if st.button("Submit Ratings"):
    scoreA = total_score(ratingsA)
    scoreB = total_score(ratingsB)
    winner = song_a["title"] if scoreA > scoreB else song_b["title"] if scoreB > scoreA else "Tie"
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Leaderboard row
    lb = load_lb()
    row = {
        "Time": time_now,
        "Nickname": st.session_state.nickname,
        "Song A": song_a["title"],
        "Song B": song_b["title"],
        "Winner": winner,
        "Score A": scoreA,
        "Score B": scoreB
    }
    row.update(ratingsA if scoreA >= scoreB else ratingsB)
    lb = pd.concat([lb, pd.DataFrame([row])], ignore_index=True)
    save_lb(lb)

    # Hall update
    hall = load_hall()
    if winner != "Tie":
        if winner in hall["Song"].values:
            hall.loc[hall["Song"] == winner, "Win Count"] += 1
        else:
            hall = pd.concat([hall, pd.DataFrame([{"Song": winner, "Win Count": 1}])], ignore_index=True)
        save_hall(hall)

    # History + celebration
    st.session_state.history.append(f"{song_a['title']} vs {song_b['title']} — Winner: {winner} ({scoreA}-{scoreB})")
    st.session_state.celebrate = True
    st.success(f"🔥 Winner: {winner}!")

    show_confetti()
    pick_two_songs()
    st.experimental_rerun()
