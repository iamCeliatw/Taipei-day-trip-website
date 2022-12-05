import mysql.connector

db = {
  "host":"localhost",
  "database": "data",
  "user":     "root",
  "password": "asd24680",
  "port":"3306",
  "charset":"utf8"
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                      pool_size = 4,
                                                      **db)
conn = cnxpool.get_connection()
print("連線成功")

cursor = conn.cursor()
sql = """DROP TABLE IF EXISTS `member`;"""
# sql = 'INSERT INTO accounts(id, name, email) VALUES (%s, %s, %s)'

cursor.execute(sql)
conn.commit()
conn.close

sql = '''CREATE TABLE member(
                            `id` bigint PRIMARY KEY AUTO_INCREMENT,
                            `name` VARCHAR(64) NOT NULL,
                            `email` VARCHAR(64) NOT NULL,
                            `password` VARCHAR(64) NOT NULL
                            )'''
cursor.execute(sql)
conn.commit()
conn.close
