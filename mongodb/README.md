
mongodb 설치
```shell
yum install mongodb
```

mongodb.conf 파일 생성
```
dbpath=/data/mongodb-data
logpath=/data/logs/mongodb.log
logappend=true
oplogSize=512
verbose=true

#bind_ip=127.0.0.1
port=27017
fork=true

rest=true
auth=true
#noauth=true
```

mongodb 저장공간 생성, 권한 설정 
```shell
sudo mkdir /data/mongodb-data
sudo mkdir /data/logs
chown hanadmin /data/mongodb-data
chown hanadmin /data/logs
```

mongodb 실행
```shell
$mongodir/bin> sudo ./mongod -f ../mongodb.conf
tail -f /data/logs/mongodb.log 
```

nodejs 설치
```shell
su - hanadmin
wget http://nodejs.org/dist/v0.10.5/node-v0.10.5.tar.gz
tar xzvf node-v0.10.5.tar.gz
cd node-v0.10.5
./configure
sudo make install
```

npm proxy setting
```shell
npm config set proxy http://proxy.cloud.daumcorp.com:3128 
npm config set https-proxy http://proxy.cloud.daumcorp.com:3128 
```

node mongorestful 설치
```shell
sudo npm install -g mongodb-rest
```

node forever 설치
```shell
sudo npm install -g forever
```

mongodb rest 실행
```shell
forever start /usr/local/bin/mongodb-rest
curl localhost:3000/test/example1
```
