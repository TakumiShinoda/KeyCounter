cd `dirname $0`
rm keyEvents
cd `dirname $0`
c++ main.c -o keyEvents -framework ApplicationServices
