start-server:
	npx start-server -s ./frontend/build

build:
	npm run build

start-front:
	npx start-server & npm -C frontend start

run:
	npm run build
	npm -C frontend start