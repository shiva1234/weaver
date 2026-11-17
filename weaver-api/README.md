# Start infra (Postgres + MinIO)
docker compose up -d

# Run the API
cd weaver-api
./mvnw spring-boot:run -Dspring-boot.run.profiles=local


# Start the UI
cd weaver-web
npm install && npm run dev



# weaver_api
create docker image build
./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=run/weaver-api

docker run
docker run -p 8080:8080  run/weaver-api   