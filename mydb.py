import mysql.connector

dataBase = mysql.connector.connect(
    host='127.0.0.1',
    user='crmuser',
    password='StrongPass!234'
)

cursorObject = dataBase.cursor()
cursorObject.execute("CREATE DATABASE IF NOT EXISTS crmdb")

print("All done!")
