import streamlit as st
import pandas as pd
import os

st.set_page_config(page_title="Hall of Legends")
st.title("👑 Hall of Legends")

file = "data/leaderboard.csv"
if not os.path.exists(file):
    st.info("No battles yet.")
    st.stop()

df = pd.read_csv(file)
if df.empty:
    st.info("No battles yet.")
    st.stop()

hall = df["Winner"].value_counts().reset_index()
hall.columns = ["Song", "Wins"]

def emoji(wins):
    if wins >= 10: return "💎"
    elif wins >= 5: return "👑"
    elif wins >= 3: return "🔥"
    else: return "🎵"

hall["Tier"] = hall["Wins"].apply(emoji)

st.dataframe(hall, use_container_width=True)
