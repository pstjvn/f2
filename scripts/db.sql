create database foundation;
create user 'foundation'@'localhost' identified by 'Foundation2018!';
flush privileges;
grant all on foundation.* to 'foundation'@'localhost';
flush privileges;