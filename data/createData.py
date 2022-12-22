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


sql = '''CREATE TABLE IF NOT EXISTS member(
                                    `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                    `name` VARCHAR(64) NOT NULL,
                                    `email` VARCHAR(64) NOT NULL,
                                    `password` VARCHAR(64) NOT NULL
                                    )'''
cursor.execute(sql)
conn.commit()
conn.close


#新增booking 訂單資訊
sql = '''CREATE TABLE IF NOT EXISTS booking(
                            `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                            `attraction_id` BIGINT ,
                            `attraction_name` VARCHAR(64) NOT NULL,
                            `address`  VARCHAR(100) NOT NULL,
                            `image` VARCHAR(200) NOT NULL,
                            `date` DATE NOT NULL,
                            `time` VARCHAR(64) NOT NULL,
                            `price` INT NOT NULL,
                            `order_number` VARCHAR(64),
                            `user_email` VARCHAR(200),
                            FOREIGN KEY (user_email) REFERENCES member(email),
                            FOREIGN KEY (attraction_id) REFERENCES spots(id)
                            )'''
cursor.execute(sql)
conn.commit()
conn.close

#新增order 資訊
sql = '''CREATE TABLE IF NOT EXISTS `orders`(
                            `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                            `order_number` VARCHAR(64) NOT NULL,
                            `name`  VARCHAR(50) NOT NULL,
                            `email` VARCHAR(200) NOT NULL,
                            `phone` VARCHAR(100) NOT NULL,
                            `price` INT NOT NULL,
                            `order_by` VARCHAR(200) NOT NULL,
                            `status` Boolean NOT NULL,
                            FOREIGN KEY (order_by) REFERENCES member(email)
                            )'''
cursor.execute(sql)
conn.commit()
conn.close


