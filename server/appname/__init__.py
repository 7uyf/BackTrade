#! ../env/bin/python

import click
from flask import Flask, current_app, url_for
from flask.cli import with_appcontext

from appname.controllers.main import main
from mongoengine import connect as mongoengineConnect

from appname.extensions import cache, debug_toolbar, login_manager


def create_app(object_name):
    """
    An flask application factory, as explained here:
    http://flask.pocoo.org/docs/patterns/appfactories/

    Arguments:
        object_name: the python path of the config object,
                     e.g. appname.settings.ProdConfig
    """

    app = Flask(__name__)

    app.config.from_object(object_name)

    # initialize the cache
    cache.init_app(app)

    # initialize the debug tool bar
    debug_toolbar.init_app(app)

    # initialize mongoEngine
    mongoengineConnect(host=app.config.get("MONGO_DATABASE_URI"))

    login_manager.init_app(app)

    # register our blueprints
    app.register_blueprint(main)

    return app
