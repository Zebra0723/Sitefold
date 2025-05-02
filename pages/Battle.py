import streamlit as st
st.set_page_config(page_title="Battle")  # THIS IS REQUIRED

st.title("🎤 Arena Battle")
st.write("You made it to the BATTLE page!")
# pages/Battle.py — Fully Debugged Arena Battle Page

import streamlit as st
import pandas as pd
from datetime import datetime
import random
import os

from utils.state import init_state, pick_two_songs
from utils.logic import rating_fields, BOSS_SONGS, total_score
from utils.storage import load_lb, save_lb, load_hall, save_hall
from utils.effects import show_confetti, boss_fight_effect, get_rank_emoji

init_state()

st.title("🎤 Arena Battle")
st.caption("Rate two songs. Boss tracks may appear...")

song_a, song_b = st.session_state.battle

edit = st.checkbox("✏️ Edit Current Songs")

col1, col2 = st.columns(2)

# SONG A
with col1:
    st.subheader("🔵 Song A")
    if edit:
        song_a["title"]  = st.text_input("Title A", song_a["title"], key="ta")
        song_a["artist"] = st.text_input("Artist A", song_a["artist"], key="aa")
        song_a["genre"]  = st.text_input("Genre A", song_a["genre"], key="ga")
    else:
        st.markdown(f"**{song_a['title']}**")
        st.caption(f"*{song_a['artist']}*")
        st.caption(f"`{song_a['genre']}`")

# SONG B
with col2:
    st.subheader("🟣 Song B")
    if edit:
        song_b["title"]  = st.text_input("Title B", song_b["title"], key="tb")
        song_b["artist"] = st.text_input("Artist B", song_b["artist"], key="ab")
        song_b["genre"]  = st.text_input("Genre B", song_b["genre"], key="gb")
    else:
        st.markdown(f"**{song_b['title']}**")
        st.caption(f"*{song_b['artist']}*")
        st.caption(f"`{song_b['genre']}`")

# 🔥 Boss Fight Warning
if song_a["title"] in BOSS_SONGS or song_b["title"] in BOSS_SONGS:
    boss_fight_effect()

st.markdown("---")
st.header("🎚️ Rate This Battle")

ratingsA, ratingsB = {}, {}

for field in rating_fields:
    c1, c2 = st.columns(2)
    ratingsA[field] = c1.slider(f"{field} – A", 1, 10, 5)
    ratingsB[field] = c2.slider(f"{field} – B", 1, 10, 5)

if st.button("🎤 Submit Ratings"):
    scoreA = total_score(ratingsA)
    scoreB = total_score(ratingsB)
    winner = song_a["title"] if scoreA > scoreB else song_b["title"] if scoreB > scoreA else "Tie"
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Save to leaderboard
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

    # Save to Hall of Legends
    hall = load_hall()
    if winner != "Tie":
        if winner in hall["Song"].values:
            hall.loc[hall["Song"] == winner, "Win Count"] += 1
        else:
            hall = pd.concat([hall, pd.DataFrame([{"Song": winner, "Win Count": 1}])], ignore_index=True)
        save_hall(hall)

    # Trigger celebration + next battle
    st.session_state.history.append(f"{song_a['title']} vs {song_b['title']} — Winner: {winner} ({scoreA}-{scoreB})")
    st.success(f"🔥 Winner: {winner}!")
    show_confetti()
    pick_two_songs()
    st.experimental_rerun()
