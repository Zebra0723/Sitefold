# Home.py – Streamlit-native navigation (no extras needed)
import streamlit as st

st.set_page_config(page_title="SONGARENA ULTIMATE", layout="centered")

st.title("🎵 SONGARENA ULTIMATE")
st.caption("Only one track will survive. But many will fight.")

st.markdown("### 🔥 Jump Into the Arena")

st.page_link("pages/Battle.py", label="🎤 Enter a Battle", icon="🎧")
st.page_link("pages/Hall.py", label="👑 View Hall of Legends", icon="👑")
st.page_link("pages/AddSong.py", label="➕ Add Songs to Arena", icon="➕")
st.page_link("pages/SongStats.py", label="📊 Song Stats", icon="📊")
st.page_link("pages/Reset.py", label="🛠️ God-Mode Panel", icon="🛠️")

st.markdown("---")
st.caption("Built by YOU. Ruled by LEGENDS. 👑💎")
