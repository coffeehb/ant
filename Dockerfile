# docker file for ant
FROM ubuntu:14.04
MAINTAINER JimmyZhou <i@zmy.im>

RUN mkdir -p /app
ADD ./app /app/
WORKDIR /app

RUN apt-get update
RUN apt-get install apt-file -y
RUN apt-file update
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN npm install

ENV MONGODB_USERNAME admin
ENV MONGODB_PASSWORD password
ENV MONGODB_INSTANCE_NAME ant

ENV EMAIL_ENC true
ENV EMAIL_PORT 465
ENV EMAIL_NAME ANT
ENV EMAIL_EMAIL username@qq.com
ENV EMAIL_USERNAME username@qq.com
ENV EMAIL_PASSWORD wmrixhcwmxiobjia
ENV EMAIL_SMTP smtp.qq.com

EXPOSE  3000
ENTRYPOINT ["nodejs", "app.js"]
