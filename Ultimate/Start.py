import streamlit as st

st.set_page_config(
    page_title="SONGARENA ULTIMATE",
    layout="centered"
)

st.title("🎵 SONGARENA ULTIMATE")
st.caption("Only one track will survive. But many will fight.")

st.markdown("---")

# 🔘 Buttons for navigation
col1, col2 = st.columns(2)

with col1:
    if st.button("🎤 Enter a Battle"):
        st.switch_page("pages/Battle.py")

    if st.button("➕ Add Songs"):
        st.switch_page("pages/AddSong.py")

with col2:
    if st.button("👑 View Hall of Legends"):
        st.switch_page("pages/Hall.py")

    if st.button("📊 Song Stats"):
        st.switch_page("pages/SongStats.py")

# 🛠 God-mode panel
st.markdown("---")
if st.button("🛠 God-Mode Panel"):
    st.switch_page("pages/Reset.py")

st.markdown("---")
st.caption("Built by YOU. Ruled by LEGENDS. 👑💾🔥")
