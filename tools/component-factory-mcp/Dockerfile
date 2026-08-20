FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV COMPONENT_FACTORY_HOST=0.0.0.0
ENV COMPONENT_FACTORY_PORT=8787

EXPOSE 8787

CMD ["npm", "run", "component-factory:remote"]
