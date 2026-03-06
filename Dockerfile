FROM python:3.11-slim
<<<<<<< HEAD

WORKDIR /app

COPY . .

RUN mkdir -p server/data

EXPOSE 8080

CMD ["python", "server/app.py"]
=======
WORKDIR /app
COPY . .
RUN mkdir -p server/data
EXPOSE 8080
CMD ["python", "server/app.py"]
>>>>>>> 6c305dc1677727c37f16a30c0cb69754385a9b38
