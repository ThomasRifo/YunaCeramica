@echo off
echo Iniciando worker de cola de Laravel...
echo Usando driver: database
php artisan queue:work database --queue=emails --tries=3 --timeout=90 --verbose
pause