FROM python:3.8

VOLUME /app
WORKDIR /app

COPY . .

RUN pip install poetry
RUN poetry install -E deploy

CMD poetry run uwsgi \
    --wsgi-file probloom/wsgi.py \
    --http :8000

