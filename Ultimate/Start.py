import streamlit as st
from streamlit_extras.switch_page_button import switch_page

st.set_page_config(
    page_title="SONGARENA ULTIMATE",
    layout="centered"
)

st.title("🎵 SONGARENA ULTIMATE")
st.caption("Only one track will survive. But many will fight.")

st.markdown("---")

# 🔘 Top-level navigation
col1, col2 = st.columns(2)

with col1:
    if st.button("🎤 Enter a Battle"):
        switch_page("Battle")

    if st.button("➕ Add Songs"):
        switch_page("AddSong")

with col2:
    if st.button("👑 View Hall of Legends"):
        switch_page("Hall")

    if st.button("📊 Song Stats"):
        switch_page("SongStats")

# 🛠 God-mode
st.markdown("---")
if st.button("🛠 God-Mode Panel"):
    switch_page("Reset")

st.markdown("---")
st.caption("Built by YOU. Ruled by LEGENDS. 👑💾🔥")
