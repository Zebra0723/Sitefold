import streamlit as st

st.set_page_config(
    page_title="SONGARENA CLEAN",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🎵 SONGARENA ULTIMATE CLEAN VERSION")
st.markdown("Use these links to navigate:")

st.page_link("pages/Battle.py", label="🎤 Enter a Battle")
st.page_link("pages/AddSong.py", label="➕ Add Songs")
st.page_link("pages/Hall.py", label="👑 View Hall of Legends")
st.page_link("pages/SongStats.py", label="📊 Song Stats")
st.page_link("pages/Reset.py", label="🛠 God-Mode Panel")

st.markdown("---")
st.caption("💡 If you're reading this, your main file is loading correctly.")
