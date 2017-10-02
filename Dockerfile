FROM python:3
MAINTAINER Mickael Kerbrat

ENV STATIC_PATH=/app/server/static

# Installation nodejs
RUN apt-get update
RUN apt-get install -y build-essential
RUN curl -sL 'https://deb.nodesource.com/setup_6.x' | bash -
RUN apt-get install -y nodejs

# Installation Server
ENV SERVER_PORT=80
EXPOSE $SERVER_PORT
ADD ./server /app/server
WORKDIR /app
RUN pip install -r server/requirements.txt

# Build client
ADD ./client /app/client
WORKDIR /app/client
RUN npm install
RUN npm install -g browserify
RUN npm run compile

ENV PYTHONPATH=/app
CMD gunicorn -b :$SERVER_PORT server.main:app
#CMD python server/main.py
#CMD bash --login
