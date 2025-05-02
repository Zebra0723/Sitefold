# SongStats.py – drilldown song stats
import streamlit as st
import pandas as pd
from utils.storage import load_lb, load_hall
from utils.effects import get_rank_emoji
from utils.state import init_state

init_state()
st.set_page_config(page_title="Song Stats", layout="centered")
st.title("📊 Song Stats")
st.caption("Check performance history of any song in the arena.")

lb = load_lb()
if lb.empty:
    st.info("No data yet.")
    st.stop()

songs = sorted(set(lb["Song A"]) | set(lb["Song B"]))
choice = st.selectbox("Choose a song", songs)

filtered = lb[(lb["Song A"] == choice) | (lb["Song B"] == choice)]

wins = (filtered["Winner"] == choice).sum()
total = len(filtered)
avg_score = filtered.loc[(filtered["Song A"] == choice), "Score A"].mean()
avg_score_b = filtered.loc[(filtered["Song B"] == choice), "Score B"].mean()
avg_score = round((avg_score + avg_score_b) / 2, 2)

st.markdown(f"""
### 🎶 {choice}
- ✅ Battles: **{total}**
- 🏆 Wins: **{wins}**
- 📈 Avg Score: **{avg_score}**
""")

hall = load_hall()
if choice in hall["Song"].values:
    crown = hall.loc[hall["Song"] == choice, "Win Count"].values[0]
    emoji = get_rank_emoji(crown)
    st.markdown(f"👑 **Legend Tier:** {emoji} ({crown} wins)")

if st.checkbox("🔍 Show Full Battle Log"):
    st.dataframe(filtered.sort_values("Time", ascending=False), use_container_width=True)
