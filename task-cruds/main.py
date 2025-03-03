from fastapi import FastAPI

import uvicorn


app = FastAPI()


@app.get("/")
def hello_index():
    return {
        "message": "Nice to meet you! Make sure to move to /docs endpoint"
    }

if __name__ == "__main__":
    uvicorn.run(app=app, port=8888)