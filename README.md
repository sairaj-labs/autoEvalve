
# 🚀 AutoElave – LLM Evaluation & Benchmarking Platform

**AutoElave** is an end-to-end evaluation platform for benchmarking and comparing **Large Language Models (LLMs)** on **reasoning, truthfulness, and safety** datasets.

It enables teams to **measure quality, detect regressions, and visualize results** using a reproducible, production-grade evaluation pipeline.

---

## ✨ Why AutoElave?

As LLMs evolve rapidly, it becomes critical to answer questions like:

* Is the new model actually better?
* Did accuracy improve or regress?
* Is the model hallucinating or producing unsafe answers?

**AutoElave solves this** by providing an **automated, extensible, and reproducible evaluation framework**, similar to internal tooling used at large AI companies.

---

## 🧠 Supported Evaluation Types

### 📘 GSM8K – Reasoning Evaluation

Evaluates step-by-step mathematical reasoning using word problems.

**Example:**

> “Janet has 16 eggs, eats some, sells the rest. How much money does she make?”

**Metrics:**

* Exact Match Accuracy
* Model Failure Rate
* Judge Scores

---

### 🧪 TruthfulQA – Truthfulness Evaluation

Tests whether the model provides **truthful and non-misleading answers**.

**Example:**

> “Can humans breathe underwater without equipment?”

**Focus Areas:**

* Hallucination detection
* Confidence vs correctness
* Response safety

---

### 🛡️ Safety Evaluation (Extensible)

Designed to evaluate responses for **harmful, unsafe, or restricted content**.

> Supports custom datasets and judge prompts.

---
<img width="2816" height="1536" alt="Gemini_Generated_Image_1anc9x1anc9x1anc (1)" src="https://github.com/user-attachments/assets/ebace06c-e580-49d5-b0e7-c9ff56cf2a0c" />


## 🧩 Key Design Choices

* Asynchronous background execution for long-running evaluations
* Polling-based reporting (non-blocking APIs)
* Model-agnostic architecture (easy to add OpenAI, Anthropic, etc.)
* Clear separation of **datasets, metrics, judges, and orchestration**

---

## 🔄 User Workflow

### 1️⃣ Run Evaluation

* Select a dataset (e.g. `GSM8K`)
* Enter a model name (e.g. `gemini-pro`)
* Start evaluation (runs asynchronously)

### 2️⃣ View Report

* Enter the generated **Run ID**
* View metrics like accuracy, failure rate, and judge scores

### 3️⃣ Compare Runs

* Compare two evaluation runs
* Detect regressions or improvements
* Get **PASS / FAIL** decision with metric deltas

---

## 📊 Metrics Explained

| Metric                 | Meaning                                  |
| ---------------------- | ---------------------------------------- |
| Exact Match Accuracy   | % of answers matching the correct answer |
| Average Judge Score    | Mean score from LLM-based judges (1–5)   |
| Judge Coverage         | Fraction of samples evaluated by judges  |
| Model Failure Rate     | % of failed or empty responses           |
| High Disagreement Rate | Judge disagreement indicator             |

---

## 🧰 Tech Stack

### Backend

* **FastAPI** – REST API
* **Python** – Core logic
* **Gemini API** – LLM inference & judging
* **Async Background Tasks** – Non-blocking execution

### Frontend

* **React + Vite**
* **TypeScript**
* **Tailwind CSS**
* Modern UI components

---

## ▶️ Running Locally

### Backend

```bash
pip install -r requirements.txt && uvicorn api.main:app --reload
```

Backend runs at:
**[http://localhost:8000](http://localhost:8000)**

---

### Frontend

```bash
cd Frontend/llm-insights-dashboard && npm install && npm run dev
```

Frontend runs at:
**[http://localhost:5173](http://localhost:5173)**

---

## 🔐 Environment Variables

Create a `.env` file in the backend root:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 📈 Current Status

* ✅ Backend complete
* ✅ Frontend dashboard complete
* ✅ Async evaluation pipeline

### 🚧 Ongoing Improvements

* More datasets
* Additional LLM providers
* Advanced judge prompts
* CI-based evaluation

---

## 🎯 Future Enhancements

* OpenAI / Anthropic model support
* Automatic periodic evaluations
* Evaluation history tracking
* Cost and latency metrics
* Cloud deployment (Render + Vercel)

* 🧱 Add **Architecture Diagram section**
* 📦 Add **Project Structure tree**
* 🛠️ Add **API Endpoints documentation**

