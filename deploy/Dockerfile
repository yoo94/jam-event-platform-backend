# Node 이미지 사용
FROM node:20

# 작업 디렉토리 생성 및 이동
WORKDIR /app

# package.json, package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 (필요시)
RUN npm run build

# Prisma 클라이언트 생성
RUN npx prisma generate

# 환경 변수 설정 (예시)
ENV NODE_ENV=production

# 8083 포트 오픈
EXPOSE 8083

# 서버 실행
CMD ["npm", "start"]