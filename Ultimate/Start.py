import streamlit as st

st.set_page_config(page_title="SONGARENA ULTIMATE", layout="wide")

st.sidebar.title("🎵 SONGARENA MENU")
page = st.sidebar.radio(
    "Go to",
    ["Home", "Battle", "Hall", "Add Songs", "Song Stats", "Reset"]
)

if page == "Home":
    st.title("🎵 SONGARENA ULTIMATE")
    st.caption("Only one track will survive. But many will fight.")
    st.markdown("Use the sidebar to navigate.")
elif page == "Battle":
    exec(open("pages/Battle.py").read())
elif page == "Hall":
    exec(open("pages/Hall.py").read())
elif page == "Add Songs":
    exec(open("pages/AddSong.py").read())
elif page == "Song Stats":
    exec(open("pages/SongStats.py").read())
elif page == "Reset":
    exec(open("pages/Reset.py").read())
