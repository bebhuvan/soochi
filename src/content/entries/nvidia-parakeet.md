---
name: "NVIDIA Parakeet"
url: "https://huggingface.co/collections/nvidia/parakeet-asr"
blurb: "Fast, locally runnable speech-to-text models for transcribing interviews, meetings and recordings with punctuation and timestamps"
kind: tool
orgType: commercial
topics: ["technology", "media", "education"]
geography: ["global", "india"]
licensing: open
access: free
license: "CC BY 4.0"
alternateNames: ["Parakeet ASR", "Parakeet TDT"]
links:
  - label: "Recommended model"
    url: "https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3"
  - label: "NeMo ASR documentation"
    url: "https://docs.nvidia.com/nemo/speech/nightly/asr/intro.html"
  - label: "Browser demo"
    url: "https://huggingface.co/spaces/nvidia/parakeet-tdt-0.6b-v3"
added: "2026-08-12"
status: live
verifiedAt: "2026-08-12"
---

Parakeet is NVIDIA's family of automatic speech-recognition models for turning audio into text. For researchers, the practical starting point is Parakeet TDT 0.6B v3: a downloadable 600-million-parameter model that adds punctuation and capitalisation, returns word- and segment-level timestamps, and can process long recordings. That makes it useful for transcribing interviews, focus groups, meetings, lectures and audiovisual archives without sending sensitive recordings to a transcription service. The checkpoint is released under CC BY 4.0 and works through Hugging Face Transformers or NVIDIA NeMo. Its central limitation for Indian research is language coverage: v3 supports English and 24 other European languages, but no Indic languages, so it is most useful for English-language material in India. It is optimized for Linux systems with NVIDIA GPUs; test accuracy on local accents, noisy field recordings and specialist vocabulary before relying on a transcript.
