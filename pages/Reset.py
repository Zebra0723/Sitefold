# Reset.py – God-Mode Control & Data Reset
import streamlit as st
import os
from utils.storage import LB_FILE, HALL_FILE
from utils.state import init_state

init_state()

st.set_page_config(page_title="God-Mode", layout="centered")
st.title("🛠️ GOD-MODE PANEL")
st.caption("Wipe leaderboard. Reset the Hall. Start fresh.")

PASSWORD = "vortexmaster2025"

if not st.session_state.god:
    pw = st.text_input("Enter God-Mode password", type="password")
    if st.button("Unlock") and pw == PASSWORD:
        st.session_state.god = True
        st.experimental_rerun()
    st.stop()

st.success("God-Mode Activated")

# Reset leaderboard
st.markdown("### 🔥 Reset Leaderboard")
if st.button("Wipe leaderboard.csv"):
    if os.path.exists(LB_FILE):
        os.remove(LB_FILE)
        st.success("Leaderboard reset!")

# Reset Hall of Legends
st.markdown("### 💀 Reset Hall of Legends")
if st.button("Wipe hall_of_legends.csv"):
    if os.path.exists(HALL_FILE):
        os.remove(HALL_FILE)
        st.success("Hall of Legends reset!")

# Reset both
st.markdown("### 🧨 Nuke Everything")
if st.button("Nuke both leaderboard + hall"):
    for f in [LB_FILE, HALL_FILE]:
        if os.path.exists(f): os.remove(f)
    st.session_state.history.clear()
    st.warning("Everything wiped!")
    st.experimental_rerun()
