# Dockerfile for Django
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port 8000
EXPOSE 8000

# Run Django development server (for production use Gunicorn or another WSGI server)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]