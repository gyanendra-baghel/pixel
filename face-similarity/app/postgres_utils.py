import psycopg2
import os

def save_metadata(image_id: str):
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    cur.execute("INSERT INTO faces(id) VALUES(%s) ON CONFLICT DO NOTHING", (image_id,))
    conn.commit()
    cur.close()
    conn.close()
