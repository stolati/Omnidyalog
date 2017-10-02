#!/usr/bin/env python3
import os
from os.path import join, dirname

app_config = dict(
    # TODO we should use mysql, this in nearer to the real stuff than sqlite
    SQLALCHEMY_DATABASE_URI=os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///file.db'),
    MONGO_URI=os.environ.get('MONGO_URI', 'mongodb://localhost:27017/omnidyalog'),
    SQLALCHEMY_TRACK_MODIFICATIONS=True,  # set to False when on prod
    PROPAGATE_EXCEPTIONS=True,
    STATIC_FILES=join(dirname(__file__), 'static'),

    CHROME_EXTENSION_URL='https://s3-us-west-2.amazonaws.com/omnidyalog/chrome_omnidyalog.crx',
    FIREFOX_EXTENSION_URL='https://s3-us-west-2.amazonaws.com/omnidyalog/',
)
