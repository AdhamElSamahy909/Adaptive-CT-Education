FROM python:3.9-slim

RUN useradd -m -u 1000 sandbox && \
    mkdir -p /code && \
    chown -R sandbox:sandbox /code

WORKDIR /code

USER sandbox

CMD ["python3"]