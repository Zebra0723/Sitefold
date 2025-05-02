# utils/storage.py
import pandas as pd
import os

LB_FILE = "data/leaderboard.csv"
HALL_FILE = "data/hall_of_legends.csv"

def load_lb():
    if os.path.exists(LB_FILE):
        return pd.read_csv(LB_FILE)
    return pd.DataFrame(columns=["Time", "Nickname", "Song A", "Song B", "Winner", "Score A", "Score B"])

def save_lb(df):
    df.to_csv(LB_FILE, index=False)

def load_hall():
    if os.path.exists(HALL_FILE):
        return pd.read_csv(HALL_FILE)
    return pd.DataFrame(columns=["Song", "Win Count"])

def save_hall(df):
    df.to_csv(HALL_FILE, index=False)
