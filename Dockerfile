FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN mkdir -p server/data

EXPOSE 8080

CMD ["python", "server/app.py"]
