import logging
from colorlog import ColoredFormatter

def setup_logger():
    # Get the root logger and remove any existing handlers
    root_logger = logging.getLogger()
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Create a logger and remove any existing handlers
    logger = logging.getLogger('Logger')
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    logger.setLevel(logging.DEBUG)  # Set the minimum overall logging level
    logger.propagate = False  # DO NOT REMOVE THIS LINE EVER

    # Custom formatter without time in the log message
    log_colors = {
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'red,bg_white',
    }

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)  # Modify this as needed
    formatter = ColoredFormatter(
        '%(log_color)s%(name)s - %(levelname)s - %(message)s%(reset)s',
        log_colors=log_colors
    )
    console_handler.setFormatter(formatter)

    file_handler = logging.FileHandler('../../logs/logfile.log')
    file_handler.setLevel(logging.DEBUG)  # Modify this as needed
    file_formatter = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(file_formatter)

    # Add handlers to the logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger

def get_class_logger(cls):
    setup_logger()
    return logging.getLogger('Logger.' + cls.__class__.__name__)
