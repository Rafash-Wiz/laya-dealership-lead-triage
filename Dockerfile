FROM python:3.11-slim-trixie

ARG TORCH_INDEX=cpu
ARG TORCH_VERSION=2.14.0

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && python -m venv --upgrade-deps /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir "torch==${TORCH_VERSION}" --index-url "https://download.pytorch.org/whl/${TORCH_INDEX}" \
    && /opt/venv/bin/pip install --no-cache-dir "laya[serve]==0.3.20" \
    && useradd --create-home --uid 10001 --shell /usr/sbin/nologin laya \
    && mkdir -p /home/laya/.cache/huggingface \
    && chown -R laya:laya /home/laya

ENV HOME=/home/laya \
    PATH=/opt/venv/bin:$PATH \
    TORCH_DISABLE_NATIVE_JIT=1 \
    USE_TF=0 \
    USE_TORCH=1 \
    TOKENIZERS_PARALLELISM=false \
    HF_HOME=/home/laya/.cache/huggingface \
    LAYA_HOST=0.0.0.0 \
    LAYA_PORT=8000 \
    LAYA_DEVICE=cpu \
    OMP_NUM_THREADS=4

USER laya
EXPOSE 8000

CMD ["laya-serve"]
