"""
Database-Connection
Real connection to database over a given connector
"""
from pymongo.errors import ServerSelectionTimeoutError


class Connector:
    """
    Superclass connector
    """

    DEFAULT_CONNECTION_TIMEOUT = 10

    def __init__(self, host, port, database_name, timeout=DEFAULT_CONNECTION_TIMEOUT):
        """
        Connector init
        :param host: database server address
        :param port: database server port
        :param database_name: database name
        :param timeout: connection timeout in sec
        """
        self.host = host
        self.port = port
        self.database_name = database_name
        self.timeout = timeout

    def connect(self):
        """
        connect to database
        :return: connections status
        """
        raise NotImplementedError

    def disconnect(self):
        """
        disconnect from database
        :return: connection status
        """
        raise NotImplementedError


class MongoConnector(Connector):
    """
    PyMongo (MongoDB) implementation from connector
    """

    DEFAULT_CONNECTION_TIMEOUT = 100

    def __init__(self, host, port, database_name, *auth):
        """
        init mongodb connector
        :param host: database server address
        :param port: database server port
        :param database_name: database name
        :param auth: (optional) authentication methods
               @see http://api.mongodb.com/python/current/examples/authentication.html
               for more informations - same paramenters in cmdb.conf
        """
        super().__init__(host, port, database_name, MongoConnector.DEFAULT_CONNECTION_TIMEOUT)
        from pymongo import MongoClient
        self.client = MongoClient(
            self.host,
            self.port,
            *auth,
            socketTimeoutMS=self.timeout,
            serverSelectionTimeoutMS=self.timeout
        )
        self.database = self.client[database_name]

    def connect(self):
        """
        try's to connect to database
        :return: server status
        """
        try:
            return self.client.server_info()
        except ServerSelectionTimeoutError:
            raise ServerTimeoutError(self.host)

    def disconnect(self):
        """
        try's to disconnect from database
        :return: server status
        """
        self.client.close()

    def get_database_name(self):
        """
        get database name
        :return: database name
        """
        return self.database.name

    def get_database(self):
        """
        get database
        :return: database object
        """
        return self.database

    def get_collection(self, name):
        """
        get a collection inside database
        (same as Tables in SQL)
        :param name: collection name
        :return: collection object
        """
        return self.database[name]


class ServerTimeoutError(Exception):
    """
    Server timeout error if connection is lost
    """
    def __init__(self, host):
        super().__init__()
        self.message = "Server Timeout - No connection to database at {}".format(host)