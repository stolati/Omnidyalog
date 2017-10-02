#!/usr/bin/env python3
import uuid
from datetime import datetime
from os.path import join, dirname

from bson import ObjectId
from flask import Flask, request, jsonify, send_from_directory, send_file, render_template
from flask_sqlalchemy import SQLAlchemy
from flask.ext.pymongo import PyMongo

from server import settings

app = Flask(__name__)
app.config.update(settings.app_config)

db = SQLAlchemy(app)
mongo = PyMongo(app)


class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime())
    user_ip = db.Column(db.String(46))

    def __init__(self, timestamp, user_ip):
        self.timestamp = timestamp
        self.user_ip = user_ip


class ExternalPage(db.Model):
    id = db.Column(db.INTEGER, nullable=False, primary_key=True, autoincrement=True)
    oid = db.Column(db.VARCHAR, nullable=False, unique=True)
    creation_date = db.Column(db.DateTime)
    url = db.Column(db.VARCHAR, nullable=True, unique=False)


class Comment(db.Model):
    id = db.Column(db.INTEGER, nullable=False, primary_key=True, autoincrement=True)
    oid = db.Column(db.VARCHAR, nullable=False, unique=True)
    page_id = db.Column(db.BigInteger, db.ForeignKey(ExternalPage.id))
    text = db.Column(db.TEXT, nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return render_template('index.html',
                           chrome_url=app.config['CHROME_EXTENSION_URL'],
                           firefox_url=app.config['FIREFOX_EXTENSION_URL'],
                           )


@app.route('/init')
def init():
    db.create_all()
    return 'created'


@app.route('/pages/<page_oid>/comments')
def get_comments(page_oid):

    page = mongo.db.page.find_one(ObjectId(page_oid))
    if not page:
        res = jsonify(error='page_not_found', oid=page_oid)
        res.status_code = 404
        return res

    res = []
    for comment in mongo.db.comment.find(dict(page_id=page['_id'])):
        res.append(dict(
            text=comment['text'],
            creation_date=int(comment['creation_date'].timestamp()),
        ))

    res = sorted(res, key=lambda e: e['creation_date'])
    return jsonify(comments=res)


@app.route('/pages/<page_oid>/comments', methods=['POST'])
def post_comment(page_oid):

    page = mongo.db.page.find_one(ObjectId(page_oid))
    if not page:
        res = jsonify(error='page_not_found', oid=page_oid)
        res.status_code = 404
        return res
    new_comment = dict(
        page_id=page['_id'],
        text=request.json['text'],
        creation_date=datetime.utcnow(),
    )
    mongo.db.comment.insert_one(new_comment)
    return jsonify(res='ok')


@app.route('/pages')
def pageurl2oid():
    url = request.args.get('url')

    res = mongo.db.page.find_one(dict(url=url))
    if not res:
        res = dict(
            creation_date=datetime.utcnow(),
            url=url,
        )
        insert_res = mongo.db.page.insert_one(res)
        oid = insert_res.inserted_id
    else:
        oid = res['_id']
    return jsonify(oid=str(oid))


@app.route('/pages/show')
def page_show():
    return send_file(join(dirname(__file__), 'pages', 'page_show.html'))


@app.route('/ping')
def ping():
    return 'pong'

@app.route('/check/mongo')
def check_mongo():
    return jsonify(all_db=mongo.db.collection_names())


# static files
if app.config.get('STATIC_FILES'):
    @app.route('/static/<path:path>')
    def static_files(path):
        return send_from_directory(app.config.get('STATIC_FILES'), path)

if __name__ == '__main__':
    # This is used when running locally. Gunicorn is used to run # application on Google App Engine. See entrypoint in app.yaml.
    db.create_all()
    app.run(host='0.0.0.0', port=8080, debug=True)
