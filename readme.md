# From 蚁逅@1.0

> 感谢作者!!!
> [蚁逅@1.0][1]

# 如何使用

## 数据库部分

我们需要新建一个数据库的容器来存放数据, 命令如下

```bash
docker run --name some-mongo -d -v /my/own/datadir:/data/db mongo
```

我们通过 `-v /my/own/datadir:/data/db` 参数从宿主机挂载 `/my/own/datadir` 目录至容器内作为 `/data/db` 目录, 那样 MongoDB 就会默认将数据文件写入这个目录中

在安装好了之后, 我们需要将数据导入到 mongo 数据库中

```bash
docker exec -it some-mongo /bin/bash

# 这样我们就进入到了 mongodb 里面, 接下来恢复数据

apt-get update && apt-get install curl unzip -y

curl https://github.com/antoor/ant/archive/master.zip > master.zip
unzip master.zip
cd ant-master/database
mongorestore
exit
```

这样我们的数据库部分就处理完了

** 虽然 mongodb 不加密码可以, 但是为了提醒某些厂商, 你们用的 mongo 端口暴露在公网, 一点安全防护都不作, 我来告诉你们怎么加密 **

首先进入 mongodb 容器
```bash
docker exec -it some-mongo /bin/bash
mongo

###
use admin 
# switched to db admin 
var schema = db.system.version.findOne({"_id" : "authSchema"}) 
schema.currentVersion = 3 
# 3 
db.system.version.save(schema) 
# WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) 
### 这里是因为mongodb3.0认证时需要某种交互, 我们把版本降低以适配ant的moogose
use admin
db.createUser(
    {
      user: "root",
      pwd: "123456",
      roles: [ "root" ]
    }
)

use admin
db.createUser(
  {
    user: "admin",
    pwd: "admin",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)

use ant
db.createUser(
  {
    user: "test",
    pwd: "password",
    roles: [ 
     { role: "userAdmin", db: "ant" },
     { role: "readWrite", db: "ant" } 
    ]
  }
)
# 最后都要认证一下
db.auth("user", "pwd")
# 返回1代表成功，0代表失败
```

因为这里我们处理好了账户的问题, 我们就可以用授权模式开启mongodb

``` bash
# 首先删掉我们刚刚建好的mongodb
docker stop some-mongo
docker rm some-mongo
# 之后重建一个, 开启授权模式
docker run --name some-mongo -d -v /my/own/datadir:/data/db mongo mongod --auth
```

这样就处理完了数据库部分

## 程序部分

这部分反倒简单了, 只需要一条命令, 其中的参数稍后解释

```bash
docker run --link some-mongo:mongodb \
           -p 80:3000 \
           -e MONGODB_USERNAME=user \
           -e MONGODB_PASSWORD=pwd \
           -e EMAIL_ENC=true \
           -e EMAIL_PORT=465 \
           -e EMAIL_NAME=ANT \
           -e EMAIL_EMAIL=username@qq.com
           -e EMAIL_USERNAME=username@qq.com
           -e EMAIL_PASSWORD=wmrixhcwmxiobjia
           -e EMAIL_SMTP=smtp.qq.com
           jimmyzhou/ant
```

--link some-mongo:mongodb  把数据库容器和这个容器链接
-p 80:3000 将容器的3000端口映射到主机的80端口
-e 开头的都是环境变量, 具体作用如下

|         参数名        |      |                    作用                   |
|:---------------------:|:----:|:-----------------------------------------:|
|      MONGODB_USERNAME | 必填 | 你刚创建的mongodb的用户名, 没设置密码留空 |
|      MONGODB_PASSWORD | 必填 | 你刚创建的mongodb的密码, 没设置密码留空   |
| MONGODB_INSTANCE_NAME | 可选 | 如果你导入的数据库不是ant, 请设置         |
|             EMAIL_ENC | 必填 | 邮箱SMTP服务是否加密 (true, false)        |
|            EMAIL_PORT | 必填 | SMTP服务器端口(根据是否加密一般为25或465) |
|            EMAIL_NAME | 必填 | 发送者名                                  |
|           EMAIL_EMAIL | 必填 | 电子邮件地址                              |
|        EMAIL_USERNAME | 必填 | 邮箱用户名 (126用户的用户名和邮箱不同)    |
|        EMAIL_PASSWORD | 必填 | 邮箱密码 (腾讯需要授权码)                 |
|            EMAIL_SMTP | 必填 | 邮箱SMTP服务器                            |

之后就可以愉快的玩耍了~~~~


 [1]: https://github.com/antoor/ant
