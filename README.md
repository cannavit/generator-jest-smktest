# Smoke Test Master

## Build Image steps

    1. Login with:
        docker login --username $DOCKER_USER -p $DOCKER_TOKEN
    2. Build base imagen:
        docker build -t smktesting/smoke-master -f Dockerfile .
    3. docker push smktesting/smoke-master:latest

##
