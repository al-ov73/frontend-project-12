start:
	npx start-server -s ./frontend/build

build:
	npm run build

start-front:
	npm -C frontend start

run: build start

install:
	npm ci

test:
	npx playwright test --project=chromium