## 인증토큰을 얻는 방법  

## 1. postman 에서 확인
-- url 주소 POST
http://localhost:8090/oauth/token

Type : Basic Auth
Username : uengine-client
Password : uengine-secret

-- body 부분
grant_type : password
username : 4@4.com
password : password


## httpie 로 테스트
http --form POST localhost:8090/oauth/token \  
"Authorization: Basic dWVuZ2luZS1jbGllbnQ6dWVuZ2luZS1zZWNyZXQ=" \  
grant_type=password \  
username=1@uengine.org \  
password=1

http --form POST localhost:8090/oauth/token "Authorization: Basic dWVuZ2luZS1jbGllbnQ6dWVuZ2luZS1zZWNyZXQ=" grant_type=password username=1@uengine.org password=1


## JKS (Java KeyStore) 파일 생성 방법

1. keytool 명령어를 사용하여 키스토어 생성
keytool -genkeypair -alias uengine -keyalg RSA -keysize 2048 -keystore server.jks -validity 3650

2. 명령어 실행 시 다음 정보를 입력
- 키스토어 비밀번호: qweqwe
- 이름과 성: [엔터]
- 조직 단위: [엔터]
- 조직 이름: [엔터]
- 구/군/시: [엔터]
- 시/도: [엔터]
- 국가 코드: [엔터]
- 확인: yes

3. 생성된 server.jks 파일을 프로젝트의 src/main/resources 폴더에 복사

4. application.yml 설정 확인
- 키스토어 비밀번호가 OAuth2AuthorizationServerConfig.java의 설정과 일치하는지 확인

주의사항:
- JKS 파일은 버전 관리 시스템(git 등)에 포함시키지 않는 것을 권장
- 프로덕션 환경에서는 더 강력한 비밀번호 사용 필요
- 키 유효기간(validity)은 환경에 맞게 조정 (예제는 3650일 = 10년)

