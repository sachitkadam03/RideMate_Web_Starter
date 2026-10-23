import psycopg2
from psycopg2 import pool


# =========================================================
# DATABASE CONFIGURATION
# =========================================================

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "ridematedb",
    "user": "postgres",
    "password": "Travel@123"
}


# =========================================================
# CONNECTION POOL
# =========================================================

connection_pool = psycopg2.pool.SimpleConnectionPool(
    1,
    10,
    **DB_CONFIG
)


# =========================================================
# GET CONNECTION
# =========================================================

def get_connection():
    return connection_pool.getconn()


# =========================================================
# RELEASE CONNECTION
# =========================================================

def release_connection(connection):
    connection_pool.putconn(connection)