# utils/effects.py
import streamlit as st

def show_confetti():
    st.balloons()

def get_rank_emoji(wins):
    if wins >= 20: return "💎 Cosmic"
    elif wins >= 10: return "👑 Legendary"
    elif wins >= 5: return "🔥 Boss Slayer"
    elif wins >= 3: return "🥇 Rising"
    else: return "🎵"

def boss_fight_effect():
    st.markdown("## 💀 **BOSS FIGHT!!** 💀")
    st.markdown("One of these songs is a legend... prepare yourself.")
    st.warning("Scoring just got real.")
