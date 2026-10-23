import bcrypt

from jose import jwt
from datetime import datetime, timedelta

from database import get_connection


# =========================================================
# JWT CONFIGURATION
# =========================================================

SECRET_KEY = "RIDEMATE_SECRET_KEY_CHANGE_LATER"
ALGORITHM = "HS256"


# =========================================================
# PASSWORD HASHING
# =========================================================

def hash_password(password: str):

    if not isinstance(password, str):
        raise ValueError("Password must be text")

    password_bytes = password.encode("utf-8")

    # bcrypt supports maximum 72 bytes
    if len(password_bytes) > 72:
        raise ValueError(
            "Password is too long. Please use a password of 72 bytes or less."
        )

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


def verify_password(password: str, hashed_password: str):

    if not isinstance(password, str):
        return False

    if not isinstance(hashed_password, str):
        return False

    password_bytes = password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    if len(password_bytes) > 72:
        return False

    try:

        return bcrypt.checkpw(
            password_bytes,
            hashed_bytes
        )

    except Exception:

        return False


# =========================================================
# JWT TOKEN
# =========================================================

def create_token(user_id: int, email: str):

    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================================================
# REGISTER USER
# =========================================================

def register_user(name, email, phone, password):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # CHECK IF EMAIL ALREADY EXISTS
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE LOWER(email) = LOWER(%s)
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            return {
                "success": False,
                "message": "Email already registered"
            }

        # -------------------------------------------------
        # CHECK PASSWORD
        # -------------------------------------------------

        if not password:

            return {
                "success": False,
                "message": "Password is required"
            }

        if len(password.encode("utf-8")) > 72:

            return {
                "success": False,
                "message": "Password must be 72 bytes or less"
            }

        # -------------------------------------------------
        # HASH PASSWORD
        # -------------------------------------------------

        password_hash = hash_password(password)

        # -------------------------------------------------
        # INSERT USER
        # -------------------------------------------------

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                phone,
                password_hash
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
            RETURNING
                user_id,
                name,
                email,
                phone
            """,
            (
                name.strip(),
                email.strip().lower(),
                phone.strip(),
                password_hash
            )
        )

        user = cursor.fetchone()

        connection.commit()

        # -------------------------------------------------
        # RETURN USER
        # -------------------------------------------------

        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3]
            }
        }

    except Exception:

        connection.rollback()

        raise

    finally:

        cursor.close()
        connection.close()


# =========================================================
# LOGIN USER
# =========================================================

def login_user(email, password):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # FIND USER
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                user_id,
                name,
                email,
                phone,
                password_hash
            FROM users
            WHERE LOWER(email) = LOWER(%s)
            """,
            (email.strip(),)
        )

        user = cursor.fetchone()

        # -------------------------------------------------
        # USER DOES NOT EXIST
        # -------------------------------------------------

        if not user:

            return {
                "success": False,
                "message": "Invalid email or password"
            }

        # -------------------------------------------------
        # VERIFY PASSWORD
        # -------------------------------------------------

        password_valid = verify_password(
            password,
            user[4]
        )

        if not password_valid:

            return {
                "success": False,
                "message": "Invalid email or password"
            }

        # -------------------------------------------------
        # CREATE JWT
        # -------------------------------------------------

        token = create_token(
            user[0],
            user[2]
        )

        # -------------------------------------------------
        # RETURN LOGIN RESPONSE
        # -------------------------------------------------

        return {
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3]
            }
        }

    finally:

        cursor.close()
        connection.close()