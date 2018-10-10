import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_PATH = ''
ALLOWED_EXTENSIONS = set(['wav'])

app = Flask(__name__)
app.secret_key = 'insert key here'
app.config['UPLOAD_FOLDER'] = UPLOAD_PATH
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024 

def allowed_file(filename):
    for extension in ALLOWED_EXTENSIONS:
        if filename.endswith('.{}'.format(extension)):
            return True
    return False

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    filename = "no file specified"
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part.')
            return redirect(request.url)
        
        file = request.files['file']
    
        if file.filename == '':
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(
                os.path.join(
                    app.config['UPLOAD_FOLDER'],
                    filename
                )
            )
            return '{"result":"success"}'

    return 'It\'s probably easier if you use the app! {}'.format(
        filename)

