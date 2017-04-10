from flask import Flask, render_template
import subprocess
import threading


app = Flask(__name__, template_folder=".", static_folder="assets")
# url_for('static', filename='assets')

def test_worker():
    ## Starting of the test
    is_running = open('is_test_running','w')
    is_running.write('True')
    is_running.close()
    cmd = ["npm","test"]
    p = subprocess.Popen(cmd, stdout = subprocess.PIPE,stderr=subprocess.PIPE,
    stdin=subprocess.PIPE)

    out,err = p.communicate()
    output_report = open('output.txt', 'w')
    output_report.write(out)
    output_report.close()
    ## End of the test
    is_running = open('is_test_running','w')
    is_running.write('False')
    is_running.close()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/get_report")
def hello():
    is_running = open('is_test_running','r')
    out = is_running.read()
    is_running.close()
    if out == 'False':
        return render_template('mochawesome.html')
    else:
        return "Please wait test is running"


@app.route("/is_running")
def is_running():
    is_running = open('is_test_running','r')
    out = is_running.read()
    is_running.close()
    return out

@app.route("/run_test")
def run_test():
    try:
        is_running = open('is_test_running','r')
        out = is_running.read()
        is_running.close()
    except:
        threading.Thread(target=test_worker).start()
        return "Background Thread Started"
    if out == 'False':
        threading.Thread(target=test_worker).start()
        return "Background Thread Started"
    else:
        return "Test already running"

if __name__ == "__main__" :
        app.run()
