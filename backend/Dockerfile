FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
RUN adduser --disabled-password --gecos "" appuser
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY . .
USER appuser
EXPOSE 8080
CMD ["gunicorn", "-w", "3", "-k", "gthread", "-b", "0.0.0.0:8080", "app.wsgi:app"]
