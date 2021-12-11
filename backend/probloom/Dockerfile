FROM python:3.8

VOLUME /app
WORKDIR /app

RUN pip install poetry

COPY poetry.lock pyproject.toml ./

# Install dependencies first to make use of cache
RUN poetry install --no-dev --extras deploy --no-root

COPY manage.py ./
COPY prob/ prob/
COPY probloom/ probloom/

RUN poetry install --no-dev

CMD poetry run uwsgi \
    --wsgi-file probloom/wsgi.py \
    --http :8000

