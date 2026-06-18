import os

from dotenv import load_dotenv
from fastapi import FastAPI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

env = load_dotenv()
app = FastAPI()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite", api_key=os.getenv("GEMINI_API_KEY")
)


class Question(BaseModel):
    code: str = Field(description="Codigo da questão")
    answer: str = Field(description="Saida prevista do codigo gerado pela questão")
    language: str = Field(
        description="Linguagem de programação usada no código: 'javascript' ou 'python'"
    )


class QuestionList(BaseModel):
    questions: list[Question] = Field(
        description="Lista de questões solicitadas pelo usuario"
    )
    difficulty: int = Field(description="Dificuldade solicitada pelo usuario")


llm = llm.with_structured_output(QuestionList)


@app.post("/generate_question")
def main(question_amount: int, difficulty: str):
    question = llm.invoke(
        [
            SystemMessage("""
            Você é uma AI responsavel por gerar codigos e saidas.

            Regras:
            - Sempre gere um codigo de no maximo 15 linhas
            - O Output, sempre deve ser um valor numerico ou uma string.
            - No campo `code`, use quebras de linha reais para separar as linhas de código (não use \\n literal).
            - Defina o campo `language` como 'javascript' ou 'python' de acordo com a linguagem usada no código gerado.
        """),
            HumanMessage(
                content=[
                    {
                        "type": "text",
                        "text": f"Gere {question_amount} codigos com a dificuldade: {difficulty}",
                    }
                ]
            ),
        ]
    )

    return {"response": question, "difficulty": difficulty}


print("System loaded!!")
