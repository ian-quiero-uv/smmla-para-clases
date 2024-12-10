# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG PYTHON_VERSION=3.11.9
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/app" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

# Switch to the non-privileged user to run the application.
#USER appuser

# Copy the source code into the container.
COPY . .

VOLUME /app/code/static/uploads

USER root

RUN chown -R appuser:appuser ./code/static/uploads

# Crear la carpeta .cache para garantizar que Whisper pueda escribir allí
RUN mkdir -p /app/.cache && chown -R appuser:appuser /app/.cache && chmod -R 777 /app/.cache

# Crear la carpeta para los modelos de Whisper si no existe
RUN mkdir -p /app/whisper_models && chown -R appuser:appuser /app/whisper_models && chmod -R 777 /app/whisper_models



# Establecer la variable de entorno para la ubicación de descarga
ENV WHISPER_CACHE_DIR=/app/whisper_models

USER appuser

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD python code/app.py
