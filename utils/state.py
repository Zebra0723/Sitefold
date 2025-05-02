# utils/state.py
import streamlit as st
import random

default_songs = [
    {"title": "Echo Drive", "artist": "Nova", "genre": "Synthwave"},
    {"title": "Crimson Keys", "artist": "Lyra Blaze", "genre": "Piano-Pop"},
    {"title": "Pulse Shift", "artist": "DJ Sync", "genre": "EDM"},
    {"title": "Shadow Vibe", "artist": "The Fade", "genre": "Lo-fi"},
    {"title": "Moonlight Bass", "artist": "Lunara", "genre": "Chillstep"},
    {"title": "Firestorm", "artist": "Riotrix", "genre": "Hardstyle"},
    {"title": "Neon Bloom", "artist": "Glowkit", "genre": "Indie-Electro"},
    {"title": "Skyline Drift", "artist": "Drive Logic", "genre": "Retrowave"},
    {"title": "Ocean Rise", "artist": "Aqualight", "genre": "Ambient"},
    {"title": "Nova Drop", "artist": "Starglide", "genre": "Future Bass"},
]

def init_state():
    ss = st.session_state
    if "songs"     not in ss: ss.songs = default_songs.copy()
    if "battle"    not in ss: pick_two_songs()
    if "nickname"  not in ss: ss.nickname = "Player"
    if "history"   not in ss: ss.history = []
    if "god"       not in ss: ss.god = False
    if "celebrate" not in ss: ss.celebrate = False
    if "boss_mode" not in ss: ss.boss_mode = False

def pick_two_songs():
    st.session_state.battle = random.sample(st.session_state.songs, 2)
    st.session_state.boss_mode = any(s["title"] in BOSS_SONGS for s in st.session_state.battle)
