#!/usr/bin/bash
verde="\033[0;32m"

apt-get update -y
clear
apt-get upgrade -y
clear
apt-get update -y
clear
apt-get upgrade -y
clear
apt-get install nodejs  -y
clear
apt-get install libwebp -y
clear
pkg upgrade -y
clear
pkg update -y
clear
pkg install nodejs -y
clear
pkg install nodejs-lts -y
clear
pkg install wget -y
clear
pkg install git -y
clear
pkg install python -y
clear

echo "${verde}[*] Todas as dependências foram instaladas, por favor execute o comando \"node index.js\",\"sh start.sh\" para iniciar o script imediatamente"