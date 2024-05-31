start:
	npm run build
	npx start-server -s ./frontend/build

build:
	npm run build

# start:
# 	npm -C frontend start

start-front:
	npm -C frontend start

run:
	npm run build
	npm -C frontend start