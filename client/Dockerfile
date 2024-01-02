FROM node:slim as builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

ENV VITE_FULLSTORY_ORG_ID=o-1TD77Z-na1
ENV VITE_PROXY_DOMAIN=sniffer.sharkio.dev
ENV VITE_SERVER_URL=https://admin.sharkio.dev
ENV VITE_SUPABASE_PROJECT_URL='https://rlhmecfbrihwgltuacbn.supabase.co'
ENV VITE_SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaG1lY2Zicmlod2dsdHVhY2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkwODc5NDYsImV4cCI6MjAwNDY2Mzk0Nn0.HKx4k173_JShm58AUhBoq2VWt5GGfhbtwhaya5qGos8'


RUN npm run build

FROM nginx:1.23-alpine as production

ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
# Expose port
EXPOSE 8080
# Start nginx
CMD ["nginx", "-g", "daemon off;"]