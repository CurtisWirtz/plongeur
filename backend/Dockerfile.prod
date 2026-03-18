# Use the official Python runtime image
FROM python:3.14-slim AS builder 

# 'libpq-dev' is required for non-binary version of psycopg to compile against PostgreSQL libraries.
# 'gcc' is required for compilation tools.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    # Remove lists to keep the image small
    && rm -rf /var/lib/apt/lists/*

# Create the app directory
RUN mkdir /app
 
# Set the working directory inside the container
WORKDIR /app
 
# Set environment variables to optimize Python
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 
 
# Upgrade pip and install dependencies
RUN pip install --upgrade pip 
 
# Copy the requirements file first (better caching)
COPY requirements.txt /app/
 
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
 


# Stage 2: Production stage
FROM python:3.14-slim
 
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    # Clean up apt lists
    && rm -rf /var/lib/apt/lists/*

# Create the app directory
RUN mkdir /app

# Add non-root user
RUN useradd -m -r appuser && \
   chown -R appuser /app
 
# Copy the Python dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.14/site-packages/ /usr/local/lib/python3.14/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy the entrypoint script into the image
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
# Make the script executable
RUN chmod +x /usr/local/bin/entrypoint.sh
 
# Set the working directory
WORKDIR /app
 
# Copy application code
COPY --chown=appuser:appuser . .
 
# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 
 
# Expose the application port
EXPOSE 8000 
 
ENTRYPOINT ["entrypoint.sh"]

# Switch to non-root user
USER appuser

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "config.wsgi:application"]