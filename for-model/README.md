path: common
---
### 1. Nginx 로컬 설치
https://nginx.org/download/nginx-1.27.3.zip 참고

설치 위치: C:/Temp/nginx-1.27.2

### 2. nginx.conf 파일 수정

위치: C:/Temp/nginx-1.27.2/conf/nginx.conf

ex)
```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                     '$status $body_bytes_sent "$http_referer" '
                     '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush     on;
    
    # 연결 최적화 설정
    keepalive_timeout  65;
    keepalive_requests 100;
    
    # GZIP 압축 활성화
    gzip  on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    server {
        # 포트 번호 수정(gateway > application.yml에 명시된 포트번호와 동일하게 설정)
        listen       8081; 
        server_name  localhost;
        
        # CORS 설정 추가
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 'healthy\n';
        }

        # 접근할 frontend 파일 위치 추가
        location /common/ {
            # 프로젝트가 위치한 경로
            root "C:/Users/cp246678/Desktop/cartest";
            index MainPage.html;
            try_files $uri $uri/ =404;
        }

        location /common {
            root "C:/Users/cp246678/Desktop/cartest";
            try_files /common/MainPage.html =404;
        }

        # 모델에 의해 생성된 common하위 경로의 실제 html 파일에 대한 설정 추가
        # root: 프로젝트가 위치한 경로
        # try_files: 접근할 html 파일 위치
        location /common/dispatchRequests {
            root "C:/Users/cp246678/Desktop/cartest";
            try_files /common/DispatchRequest.html =404;
        }

        location /common/dispatchStatuses {
            root "C:/Users/cp246678/Desktop/cartest";
            try_files /common/DispatchStatus.html =404;
        }
    }
}

```

### 3. Nginx 실행 방법

실행: C:/Temp/nginx-1.27.2/nginx.exe 를 통해 실행

종료
    1. 작업관리자를 이용한 종료
        작업관리자 > 프로세스 > nginx.exe 작업 종료

    2. cmd 창에서 명렁어를 통한 종료
        - netstat -ano | findstr :8081
        - taskkill /PID 8081포트ID /F
