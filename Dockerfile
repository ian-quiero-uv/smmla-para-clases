ARG PYTHON_VERSION=3.11.9
FROM python:${PYTHON_VERSION}-slim

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
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

COPY . .

VOLUME /app/code/static
VOLUME /app/.cache
VOLUME /app/whisper_models

USER root

RUN chown -R appuser:appuser ./code/static
RUN chown -R appuser:appuser /app/.cache
RUN chown -R appuser:appuser /app/whisper_models

# Crear la carpeta de logs (flask y nginx)
#RUN mkdir -p /app/logs/flask && \
#    mkdir -p /app/logs/nginx && \
#    chown -R appuser:appuser /app/logs && \
#    chmod -R 755 /app/logs

RUN mkdir -p /app/.cache && chown -R appuser:appuser /app/.cache && chmod -R 777 /app/.cache
RUN mkdir -p /app/whisper_models && chown -R appuser:appuser /app/whisper_models && chmod -R 777 /app/whisper_models
RUN chmod -R 755 /app/code/static

ENV WHISPER_CACHE_DIR=/app/whisper_models

USER appuser

EXPOSE 8000

CMD ["gunicorn", "-c", "gunicorn.conf.py", "code.app:app"]
#CMD python code/app.py code\app.py
