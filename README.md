# AWS_Cognito

Cognito를 사용하여 google ouath2.0 구현 및 토큰 관리

### IaC (Infrastructure as Code) 실행 코드

-   serverless.yml : Cognito custom api 배포 코드
-   trigger_serverless.yml : Cognito의 lambda trigger 배포 코드

#### 실행 방법

`serverless deploy`  
`serverless deploy --config trigger_serverless.yml`
