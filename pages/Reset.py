import streamlit as st
import os

st.set_page_config(page_title="God-Mode Reset")
st.title("🛠️ God-Mode Panel")

LB = "data/leaderboard.csv"

password = st.text_input("Password", type="password")

if st.button("Reset Leaderboard") and password == "vortexmaster2025":
    if os.path.exists(LB):
        os.remove(LB)
    st.success("Leaderboard wiped!")
