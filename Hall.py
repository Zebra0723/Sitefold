# Hall.py – Hall of Legends
import streamlit as st
import pandas as pd
from utils.storage import load_hall
from utils.effects import get_rank_emoji

st.set_page_config(page_title="Hall of Legends", layout="centered")

st.title("👑 Hall of Legends")
st.caption("Songs that dominated the arena and earned their crown.")

hall = load_hall()

if hall.empty:
    st.info("No legends yet. Win battles to unlock this hall.")
    st.stop()

# Add rank emoji
def rank_label(wins):
    if wins >= 20: return "💎 Cosmic Tier"
    elif wins >= 10: return "👑 Legendary"
    elif wins >= 5: return "🔥 Boss Slayer"
    elif wins >= 3: return "🥇 Rising Star"
    else: return "🎵 Challenger"

hall["Rank"] = hall["Win Count"].apply(rank_label)

# Sort and show
hall_sorted = hall.sort_values("Win Count", ascending=False).reset_index(drop=True)
st.dataframe(hall_sorted, use_container_width=True)
