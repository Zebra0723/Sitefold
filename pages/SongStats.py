import streamlit as st
import pandas as pd
import os

st.set_page_config(page_title="Song Stats")
st.title("📊 Song Stats")

file = "data/leaderboard.csv"
if not os.path.exists(file):
    st.info("No data yet."); st.stop()

df = pd.read_csv(file)
songs = sorted(set(df["Song A"]).union(df["Song B"]))
choice = st.selectbox("Choose a song", songs)

filtered = df[(df["Song A"] == choice) | (df["Song B"] == choice)]
wins = (filtered["Winner"] == choice).sum()
total = len(filtered)

scoreA = filtered.loc[filtered["Song A"] == choice, "Score A"].mean()
scoreB = filtered.loc[filtered["Song B"] == choice, "Score B"].mean()
avg_score = round((scoreA + scoreB) / 2, 2) if not pd.isna(scoreA) and not pd.isna(scoreB) else "–"

st.markdown(f"""
### {choice}
- 🏆 Wins: {wins}
- 🧠 Battles: {total}
- 📈 Avg Score: {avg_score}
""")

if st.checkbox("Show full history"):
    st.dataframe(filtered.sort_values("Time", ascending=False), use_container_width=True)

