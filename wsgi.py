"""ASGI entry-point for Uvicorn.

Flask is a WSGI framework and Uvicorn speaks ASGI, so we wrap the Flask
app with `a2wsgi.WSGIMiddleware` and expose the resulting ASGI callable
as `app`.

Run it with:

    uvicorn wsgi:app --host 0.0.0.0 --port 8000
"""

from a2wsgi import WSGIMiddleware

from app import create_app

flask_app = create_app()
app = WSGIMiddleware(flask_app)
