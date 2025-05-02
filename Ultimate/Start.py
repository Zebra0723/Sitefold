import streamlit as st

st.set_page_config(
    page_title="SONGARENA START",
    layout="wide",
    initial_sidebar_state="expanded"  # 🔥 this line is the magic
)

st.title("🚀 SongArena Start Page")
st.caption("Use the sidebar to navigate manually.")

st.markdown("Go to the top-left menu ➜ select ‘Battle’ to launch the arena.")
