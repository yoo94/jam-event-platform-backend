dist
node_module
prisma
src
    config - 설정 정보 , swagger 설정파일 등
    lib - helper, 인증키생성관리, 시간표시 등 주제별로 헬퍼함수를 만들어서 넣어둠
    plugin - 패스티파이 플러그인
    routes - 패스티파이 라우트 
    schema - 패스티파이 및 타입스크립트 타입, 인터페이스 등을 넣음 패스티파이와 타입스크립트의 타입이 중복되는경우가 많아서 타입박스라는 플러그인으로 재사용할 예정
    services - rest요청에 대한 관리 
    startup - 서버가 실행할때 관련된 코드
package.json
tsconfig.json