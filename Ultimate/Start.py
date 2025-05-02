import streamlit as st

st.set_page_config(
    page_title="SONGARENA CLEAN",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🎵 SONGARENA ULTIMATE CLEAN VERSION")
st.markdown("Use these links to navigate:")

# ✅ These names MUST match the visible page titles in the sidebar
st.page_link("Battle", label="🎤 Enter a Battle")
st.page_link("AddSong", label="➕ Add Songs")
st.page_link("Hall", label="👑 View Hall of Legends")
st.page_link("SongStats", label="📊 Song Stats")
st.page_link("Reset", label="🛠 God-Mode Panel")

st.markdown("---")
st.caption("💡 Navigation is now bulletproof.")
