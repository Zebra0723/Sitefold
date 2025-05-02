# AddSong.py – Add new songs into the battle pool
import streamlit as st
from utils.state import init_state

init_state()
st.set_page_config(page_title="Add Songs", layout="centered")

st.title("➕ Add Songs to Arena")
st.caption("Submit new contenders for future battles.")

col1, col2 = st.columns(2)
title  = col1.text_input("🎶 Song Title")
artist = col2.text_input("🎤 Artist")
genre  = st.text_input("🏷️ Genre")

if st.button("Add to Song Pool") and title and artist:
    st.session_state.songs.append({
        "title": title,
        "artist": artist,
        "genre": genre or "Unknown"
    })
    st.success(f"{title} added!")

if st.checkbox("📄 Show Current Pool"):
    for s in st.session_state.songs:
        st.write(f"🎧 **{s['title']}** by *{s['artist']}* – `{s['genre']}`")
