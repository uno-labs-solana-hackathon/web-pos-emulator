FROM node:buster
COPY . /web-pos-emulator
RUN cd /web-pos-emulator && npm install && npm run build
CMD cd /web-pos-emulator && npm run prod
EXPOSE 8000
