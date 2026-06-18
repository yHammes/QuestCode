export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  code: string;
  answer: string;
  language: "javascript" | "python";
}

export const QUESTIONS: Record<Difficulty, Question[]> = {
  easy: [
    { language: "javascript", code: `let x = 5;\nlet y = 3;\nconsole.log(x + y);`, answer: "8" },
    { language: "javascript", code: `let name = "Alice";\nconsole.log("Hello, " + name);`, answer: "Hello, Alice" },
    { language: "python", code: `a = 10\nb = 4\nprint(a - b)`, answer: "6" },
    { language: "javascript", code: `console.log(2 * 3 + 1);`, answer: "7" },
    { language: "python", code: `print("Code" + "Quest")`, answer: "CodeQuest" },
    { language: "javascript", code: `let n = 10;\nn = n / 2;\nconsole.log(n);`, answer: "5" },
    { language: "python", code: `x = 7\ny = 2\nprint(x % y)`, answer: "1" },
    { language: "javascript", code: `console.log(typeof 42);`, answer: "number" },
    { language: "python", code: `print(len("hello"))`, answer: "5" },
    { language: "javascript", code: `let a = 3;\nlet b = a;\na = 10;\nconsole.log(b);`, answer: "3" },
  ],
  medium: [
    { language: "javascript", code: `let x = 7;\nif (x > 5) {\n  console.log("big");\n} else {\n  console.log("small");\n}`, answer: "big" },
    { language: "python", code: `total = 0\nfor i in range(4):\n  total += i\nprint(total)`, answer: "6" },
    { language: "javascript", code: `let s = "";\nfor (let i = 1; i <= 3; i++) {\n  s += i;\n}\nconsole.log(s);`, answer: "123" },
    { language: "python", code: `x = 5\nwhile x > 2:\n  x -= 1\nprint(x)`, answer: "2" },
    { language: "javascript", code: `let n = 10;\nconsole.log(n % 3 === 0 ? "yes" : "no");`, answer: "no" },
    { language: "python", code: `nums = [1, 2, 3]\nprint(sum(nums))`, answer: "6" },
    { language: "javascript", code: `let count = 0;\nfor (let i = 0; i < 5; i++) {\n  if (i % 2 === 0) count++;\n}\nconsole.log(count);`, answer: "3" },
    { language: "python", code: `x = 4\nif x > 10:\n  print("A")\nelif x > 2:\n  print("B")\nelse:\n  print("C")`, answer: "B" },
    { language: "javascript", code: `let arr = [10, 20, 30];\nconsole.log(arr[1] + arr[2]);`, answer: "50" },
    { language: "python", code: `result = 1\nfor i in range(1, 4):\n  result *= i\nprint(result)`, answer: "6" },
  ],
  hard: [
    { language: "javascript", code: `function f(n) {\n  if (n <= 1) return n;\n  return f(n - 1) + f(n - 2);\n}\nconsole.log(f(6));`, answer: "8" },
    { language: "python", code: `def mystery(arr):\n  return [x * 2 for x in arr if x > 1]\nprint(mystery([1, 2, 3]))`, answer: "[4, 6]" },
    { language: "javascript", code: `let arr = [1, 2, 3, 4];\nlet r = arr.reduce((a, b) => a + b * 2, 0);\nconsole.log(r);`, answer: "20" },
    { language: "python", code: `d = {"a": 1, "b": 2}\nd["a"] += d["b"]\nprint(d["a"])`, answer: "3" },
    { language: "javascript", code: `let count = 0;\nfor (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (i === j) count++;\n  }\n}\nconsole.log(count);`, answer: "3" },
    { language: "python", code: `def f(x, y=2):\n  return x ** y\nprint(f(3))`, answer: "9" },
    { language: "javascript", code: `const arr = [3, 1, 4, 1, 5];\nconst sorted = [...arr].sort((a, b) => b - a);\nconsole.log(sorted[0] + sorted[1]);`, answer: "9" },
    { language: "python", code: `s = "abcdef"\nprint(s[1:4])`, answer: "bcd" },
    { language: "javascript", code: `function make() {\n  let x = 0;\n  return () => ++x;\n}\nconst c = make();\nc(); c();\nconsole.log(c());`, answer: "3" },
    { language: "python", code: `matrix = [[1,2],[3,4],[5,6]]\ntotal = 0\nfor row in matrix:\n  total += row[1]\nprint(total)`, answer: "12" },
  ],
};
