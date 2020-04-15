from pymongo import MongoClient


def __getConnection__ (hostName, port):

    try:
        dbUrl = hostName+":"+port
        connection = MongoClient(host=dbUrl,document_class=dict,tz_aware=False, connect=True )
        print("Database connection success!!")
        return connection
    except:
        print("Database connection ERROR!!")
        raise Exception("Database connection ERROR!!")


def __getCollection__(hostName, port, dbName, collName):

    dbConnection = __getConnection__(hostName, port)

    dbList = dbConnection.list_database_names()

    if dbName in dbList:
        print("The database exists.")
        dataBase = dbConnection[dbName]
        collections = dataBase.list_collection_names()
        if collName in collections:
            dbConnection.close()
            return dataBase[collName]
        else:
            dbConnection.close()
            raise Exception("Collection does not exist")
    else:
        dbConnection.close()
        raise Exception("Database does not exist")


def __closeConnection__(dbConnection):
    try:
        dbConnection.close()
        print("Database connection succesfully close")
    except:
        print("Error closing database connection")

