### 1. Install nginx

```
sudo apt update
sudo apt install nginx

// if asked about the version of nginx.conf, Enter 'N'
```

### 2. Set nginx.conf

```
sudo vim /etc/nginx/nginx.conf
```

### 3. Modify nginx.conf

```
//modify port number
listen         0.0.0.0:8081; (8002 -> 8081)
```
```
//remove 

location / {
    ...
}
```
```
//add

location /common/ {
    root $gitpod_repo_root;
}

location / {
    root $gitpod_repo_root;
    try_files /common/MainPage.html =404;
}
{{#boundedContexts.aggregates}}
location /{{nameCamelCase}} {
    root $gitpod_repo_root;
    try_files /common/{{namePascalCase}}.html =404;
}
{{/boundedContexts.aggregates}}
```

### 4. Run nginx

```
nginx //start nginx
nginx -s stop //stop nginx
nginx -s reload //reload nginx
```