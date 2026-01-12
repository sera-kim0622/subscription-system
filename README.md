## 도메인

https://www.sera-kim.shop

## 시스템 아키텍쳐

![Subscription system architecture](./subscription-system-diagram.png)

## 유닛 테스트 결과

![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/sera-kim0622/dea840e18ff6c9590895a3b120f8f077/raw/coverage.json)

## 진행사항

1. API 생성
   - [x] 회원가입
   - [x] 로그인
   - [x] 구독 상품 조회
   - [x] 구독 상품 구매
   - [ ] 구독 상품 환불

2. Jest + Supertest로 **단위 테스트/통합 테스트 작성**
   - [x] 단위 테스트
   - [ ] 통합 테스트

3. **테스트 자동화 파이프라인** 추가
   - [x] Gist로 coverage report 페이지 생성
   - [x] Github actions로 test 실행(CI)

## Description

유저가 월간/연간 상품을 결제 후 구독권이 생성되는 시스템을 만든 백엔드 서버입니다.

## Installation

```bash
yarn install
```

## Running the app

```bash
yarn run start:prod
```

## Test

jest-mock-extended : 모의 객체를 생성해주는 패키지
