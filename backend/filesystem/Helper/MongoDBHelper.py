from pymongo import MongoClient


def getConnection (mongoUri):
    print(mongoUri)
    try:

        connection = MongoClient(mongoUri)
        print("Database connection success!!")
        return connection
    except:
        print("Database connection ERROR!!")
        raise Exception("Database connection ERROR!!")


def getCollection(connection, dbName, collName):

    #dbList = connection.list_database_names()
    #if dbName in dbList:
    #    print("The database exists.")
    dataBase = connection[dbName]
    collections = dataBase.list_collection_names()
    #    if collName in collections:
    return dataBase[collName]
    #    else:
    #        raise Exception("Collection does not exist")
    #else:
    #    raise Exception("Database does not exist")

def closeConnection(dbConnection):
    try:
        dbConnection.close()
        print("Database connection succesfully close")
    except:
        print("Error closing database connection")

