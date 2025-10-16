# weaver_api
create docker image build
./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=run/weaver-api

docker run
docker run -p 8080:8080  run/weaver-api   