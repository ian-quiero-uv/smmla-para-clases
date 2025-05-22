ARG PYTHON_VERSION=3.11.9
FROM python:${PYTHON_VERSION}-slim as base

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

WORKDIR /app

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/app" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

COPY . .

VOLUME /app/code/static/uploads

USER root

RUN chown -R appuser:appuser ./code/static/uploads

RUN mkdir -p /app/.cache && chown -R appuser:appuser /app/.cache && chmod -R 777 /app/.cache

RUN mkdir -p /app/whisper_models && chown -R appuser:appuser /app/whisper_models && chmod -R 777 /app/whisper_models

ENV WHISPER_CACHE_DIR=/app/whisper_models

USER appuser

EXPOSE 80

CMD python code/app.py
