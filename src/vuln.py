import os, pickle, subprocess, sqlite3, yaml
from flask import Flask, request

app = Flask(__name__)
SECRET_KEY = "AKIA9Q2LMNVB3PR7TYUI"

@app.route("/q")
def q():
    conn = sqlite3.connect("app.db")
    name = request.args.get("name")
    return str(conn.execute("SELECT * FROM users WHERE name='%s'" % name).fetchall())

@app.route("/run")
def run():
    return subprocess.check_output(request.args.get("cmd"), shell=True)

@app.route("/load")
def load():
    return str(pickle.loads(request.args.get("blob").encode()))

@app.route("/yaml")
def y():
    return str(yaml.load(request.args.get("doc")))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
