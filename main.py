from fastapi import FastAPI
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os, json

env = load_dotenv()
app = FastAPI()

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", api_key=os.getenv("GEMINI_API_KEY"))

class QuestionList(BaseModel):
    questions: list[Question] = Field(description="Lista de questões solicitadas pelo usuario")
    difficulty: int = Field(description="Dificuldade solicitada pelo usuario")

class Question(BaseModel):
    code: str = Field(description="Codigo da questão")
    output: str = Field(description="Saida prevista do codigo gerado pela questão")

llm = llm.with_structured_output(QuestionList)


@app.post("/generate_question")
def main(question_amount: int, difficulty: str):
    question = llm.invoke([
        SystemMessage("""
            Você é uma AI responsavel por gerar codigos e saidas.
            
            Regras:
            - Sempre gere um codigo de no maximo 15 linhas
            - O Output, sempre deve ser um valor numerico ou uma string.
        """),
        HumanMessage(
            content=[
                {"type": "text", "text": f"Gere {question_amount} codigos com a dificuldade: {difficulty}"}
            ])
    ])
    print(question)
    return {"response": question, "difficulty": difficulty}