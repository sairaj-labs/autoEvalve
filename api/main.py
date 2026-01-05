from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import evaluate, report, compare

app = FastAPI(title="AutoElave LLM Evaluation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for local + demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluate.router)
app.include_router(report.router)
app.include_router(compare.router)
