import streamlit as st

# 🔥 FORCE SIDEBAR TO APPEAR
st.set_page_config(
    page_title="SONGARENA",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 🔥 FAKE SIDEBAR CONTENT TO MAKE IT RENDER
with st.sidebar:
    st.markdown("## 🧭 Navigation Menu")
    st.markdown("Use the sidebar links at the top to switch pages!")

# 🏠 HOME CONTENT
st.title("🚀 Welcome to SONGARENA")
st.caption("Choose a page from the sidebar to begin your journey.")
st.markdown("👈 Use the sidebar on the left to access battles, stats, and more!")
