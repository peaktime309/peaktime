<img src="./readmeImg/peaktime.png" alt="peaktime" width="128" height="128">

# 집중 관리가 필요한 모든 순간, **PeakTime**

# Overview

![00-introPage.gif](./readmeImg/gif/00-introPage.gif)

# PeakTime 서비스 화면

### ■ 메인 페이지

- 루트계정 메인
  <br>
  ![01-root-mainPage.gif](./readmeImg/gif/01-root-mainPage.gif)

- 서브계정 메인
  <br>
  ![02-sub-mainPage.gif](./readmeImg/gif/02-sub-mainPage.gif)

### ■ 하이킹 시작, 종료

- 하이킹 시작 후 사이트, 프로그램 차단 기능
  <br>
  ![03-hiking-start-block.gif](./readmeImg/gif/03-hiking-start-block.gif)

- 종료
  <br>
  ![04-hiking-finish.gif](./readmeImg/gif/04-hiking-finish.gif)

### ■ 월간 하이킹 내역 페이지

- 캘린더 - 일자 클릭 - 상세
  <br>
  ![05-monthly-report.gif](./readmeImg/gif/05-monthly-report.gif)

### ■ 전체 통계 페이지

- root 전체 통계
  <br>
  ![06-stats.gif](./readmeImg/gif/06-stats.gif)

### ■ 메모 및 요약 페이지

- 메모 작성 및 확인
  <br>
  ![07-memo.gif](./readmeImg/gif/07-memo.gif)

- 요약 작성 및 확인
  <br>
  ![08-summary.gif](./readmeImg/gif/08-summary.gif)

### ■ 차단 프리셋 설정 페이지

- 사이트, 프로그램 추가 입력
  <br>
  ![09-presetList.gif](./readmeImg/gif/09-presetList.gif)

### ■ 서브계정 관리 페이지

- 서브계정 생성 및 차단 예약 타이머
  <br>
  ![10-sub-setting.gif](./readmeImg/gif/10-sub-setting.gif)

- 서브계정 타이머 예약 기반 자동 차단
  <br>
  ![11-sub-timer.gif](./readmeImg/gif/11-sub-timer.gif)

# 주요 기능

### 서비스 소개

- 웹 사이트 및 프로그램 차단으로 PC 사용자의 사용 목적에 집중하도록 하는 서비스

### 프로젝트 주요 기능

- 웹 사이트 및 프로그램 차단
  - 타이머에 시간과 사전에 지정한 차단 목록을 선택해 콘텐츠 차단 기능을 실행할 수 있습니다.
  - 차단 기능 실행 중에는 이용한 콘텐츠를 기록하고, Chrome 웹 사이트와 실행 프로그램을 감지해 사전에 지정한 콘텐츠를 차단합니다.
- 차단 프리셋 관리
  - 사전에 차단하고 싶은 웹 사이트와 프로그램 목록을 지정할 수 있습니다.
  - 자신이 직접 차단 기능을 사용하거나, 서브유저 그룹에 차단 목록을 지정하는 데 사용됩니다.
  - 차단 기능 실행 도중, 원하는 웹 사이트를 차단 웹 사이트 목록에 등록할 수 있습니다.
- 활동 내역 확인
  - 이번 달 이용 내역을 이용 시간에 따른 히트맵 방식으로 캘린더를 제공합니다.
  - 이용 건당 실제 시작 및 종료 시각, 가장 많이 이용한 콘텐츠 등을 확인할 수 있습니다.
- 사용자의 전체 활동에 대한 통계 제공
  - 전체 이용 시간 및 이용 중 차단 콘텐츠 접근에 대한 정보에 관한 통계를 제공합니다.
  - 프로그램 실행 중 가장 많이 이용한 콘텐츠와, 하루 중 프로그램 실행 시작 시각 분포를 시각화된 자료로 제공합니다.
- 서브계정 차단 관리
  - 한 계정에 종속된 다수의 서브계정을 생성하고 관리하는 기능을 제공합니다.
  - 그룹 단위로 지정된 서브계정에게 차단 일정을 부여해, 지정된 시간 동안 콘텐츠 실행을 차단하도록 합니다.
  - 서브 계정은 자동으로 시작되는 하이킹을 종료할 수 없으며, 일반적인 방법으로는 프로그램 종료가 불가능합니다.
- 메모 및 요약
  - Chrome Extension을 통해 원하는 내용을 입력해 저장하는 메모 기능을 제공합니다.
  - 저장한 메모를 포함해 입력한 내용을, 키워드를 지정해 생성형 AI가 요약하는 기능을 제공합니다.
  - 요약한 내용을 pdf, markdown 형식의 파일로 내보내는 기능을 제공합니다.

### 개발 환경

- OS
  - Local : Windows 10
  - AWS : Ubuntu 20.04.6 LTS
- IDE
  - IntelliJ IDE 2024.1.4
  - Visual Studio Code 1.90.2
- UI / UX
  - Figma
- Database
  - PostgreSQL 15
  - Redis 7.4
- CI/CD
  - Jenkins
  - Docker
  - Docker-Compose
- API
  - Openai API

### 상세 스택

- Backend(Spring Boot)
  - JAVA - openjdk 17.0.12
  - Gradle: 8.8
  - Spring Boot: 3.3.3 (Spring Data JPA, Spring Data Redis, Spring Security)
  - Spring Mail: 3.2.2
  - Spring retry
  - Spring Aspects
  - PostgreSql: 42.7.3
  - Swagger: 2.2.22
  - Lombok: 1.18.34
  - QueryDSL: 5.0.0
  - jjwt: 0.11.2
  - Junit: 5.10.3
- FrontEnd(React)
  - React: 18.3.1
  - Vite: 5.4.10
  - JavaScript: 5.5.3
  - tailwindcss: 3.4.14
  - react-icons: 5.3.0
  - react-router-dom: 6.27.0
  - react-spinner: 0.14.1
  - d3.js: 7.9.0
  - react-chartjs-2: 5.2.0
  - axios: 1.7.7
  - dayjs: 1.11.13
  - flowbite-react: 0.12.0
  - html2pdf.js: 0.10.2
  - sweetalert2: 11.14.4
  - three.js: 0.170.0
  - ws: 8.18.0
  - zustand: 5.0.1
- Frontend(Electron)
  - Electron: 33.0.2
  - Electron-stroe: 10.0.0
- Extension(Chrome Extension)
  - tailwindcss: 3.4.14
  - Html, JavaScript, CSS
  -

### 협업 툴

- 일정 관리 : Notion, Onedrive.live(Microsoft 365)
- 이슈 및 형상 관리 : Gitlab, Git
- 커뮤니케이션 : MatterMost, KakaoTalk

### 유저 플로우

<img src="./readmeImg/image%201.png" alt="image 1" width="512">

<img src="./readmeImg/image%202.png" alt="image 2" width="512">

### 시스템 아키텍처

<img src="./readmeImg/System_Arithetecture.png" alt="System Architecture" width="512">

### 기능 명세서

<img src="./readmeImg/image%203.png" alt="image 3" width="512">

<img src="./readmeImg/image%204.png" alt="image 4" width="512">

<img src="./readmeImg/image%205.png" alt="image 5" width="512">

<img src="./readmeImg/image%206.png" alt="image 6" width="512">

<img src="./readmeImg/image%207.png" alt="image 7" width="512">

### API 연동규격서

<img src="./readmeImg/image%208.png" alt="image 8" width="512">

<img src="./readmeImg/image%209.png" alt="image 9" width="512">

<img src="./readmeImg/image%2010.png" alt="image 10" width="512">

### 화면 설계서

<img src="./readmeImg/01-login.png" alt="01-login" width="512">
<img src="./readmeImg/02-signup.png" alt="02-signup" width="512">
<img src="./readmeImg/03-password.png" alt="03-password" width="512">
<img src="./readmeImg/04-home.png" alt="04-home" width="512">
<img src="./readmeImg/05-timer.png" alt="05-timer" width="512">
<img src="./readmeImg/06-profile.png" alt="06-profile" width="512">
<img src="./readmeImg/07-changepassword.png" alt="07-changepassword" width="512">
<img src="./readmeImg/08-changeemail.png" alt="08-changeemail" width="512">
<img src="./readmeImg/09-presetmodal.png" alt="09-presetmodal" width="512">
<img src="./readmeImg/10-presetsetting.png" alt="10-presetsetting" width="512">
<img src="./readmeImg/11-presetsetting2.png" alt="11-presetsetting2" width="512">
<img src="./readmeImg/12-addpreset.png" alt="12-addpreset" width="512">
<img src="./readmeImg/13-addsite.png" alt="13-addsite" width="512">
<img src="./readmeImg/14-importpreset.png" alt="14-importpreset" width="512">
<img src="./readmeImg/15-calendar.png" alt="15-calendar" width="512">
<img src="./readmeImg/16-hikingdetail.png" alt="16-hikingdetail" width="512">
<img src="./readmeImg/17-sublist.png" alt="17-sublist" width="512">
<img src="./readmeImg/18-addgroup.png" alt="18-addgroup" width="512">
<img src="./readmeImg/19-groupchoose.png" alt="19-groupchoose" width="512">
<img src="./readmeImg/20-addgrouptimer.png" alt="20-addgrouptimer" width="512">
<img src="./readmeImg/21-addsub.png" alt="21-addsub" width="512">
<img src="./readmeImg/22-updatesub.png" alt="22-updatesub" width="512">
<img src="./readmeImg/23-statistic.png" alt="23-statistic" width="512">
<img src="./readmeImg/24-memo.png" alt="24-memo" width=" 512">
<img src="./readmeImg/25-extension.png" alt="25-extension" width="512">

### 시퀀스 다이어그램 (Sequence Diagram)

- 홈페이지

  <img src="./readmeImg/home.png" alt="home" width="512">

- 하이킹 내역

  <img src="./readmeImg/reports.png" alt="reports" width="512">

- 전체 통계

  <img src="./readmeImg/statistics.png" alt="statistics" width="512">

- 차단 관리

  <img src="./readmeImg/preset_setting.png" alt="preset_setting" width="512">

- 서브계정 관리

  <img src="./readmeImg/subsetting.png" alt="subsetting" width="512">

- 유저정보 수정

  <img src="./readmeImg/usersetting.png" alt="usersetting" width="512">

### 일정관리 (Gantt Chart)

- 10월17일~11월 17일 일간 일정 정리 Excel

[](./readmeImg/https://onedrive.live.com/:x:/g/personal/56061953A967445C/EVxEZ6lTGQYggFaTIwAAAAABKaZWu7KlBn4deFp953NIEw?resid=56061953A967445C!9107&ithint=file%2Cxlsx&e=2vaPaz&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3gvYy81NjA2MTk1M2E5Njc0NDVjL0VWeEVaNmxUR1FZZ2dGYVRJd0FBQUFBQkthWld1N0tsQm40ZGVGcDk1M05JRXc_ZT0ydmFQYXo)

### Git Commit 컨벤션

- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 내용 변경
- `style` : 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우 등
- `design` : 디자인 추가 및 수정
- `refactor` : 코드 리팩토링
- `test` : 테스트 코드 작성
- `chore` : 빌드 수정, 패키지 매니저 설정, 운영 코드 변경이 없는 경우 등

```
[type][FE/BE][developer] subject

ex) 백엔드 회원가입 기능

- [FEAT][BE][석범] 회원가입 기능 추가

```

---

### Git Branch 전략

`git-flow`전략

- `master`
- `develop-EL` : 일렉트론 개발 브랜치
- `develop-BE` : BE 배포 브랜치
- `develop-EX`: 크롬 익스텐션 개발 브랜치
- `feature/EL/{issue-num}-function`: 일렉트론 기능 브랜치
- `feature/BE/{issue-num}-function`: BE 기능 브랜치
- `feature/EX/{issue-num}-function` : 크롬 익스텐션 기능 브랜치

### ERD

![peaktime.png](./readmeImg/peaktime%201.png)

### EC2 포트 정리

| Port  | Main Server          |
| ----- | -------------------- |
| 80    | Nginx HTTP 기본 포트 |
| 443   | Nginx HTTPS          |
| 5173  | React                |
| 5432  | PostgreSql           |
| 6379  | Redis                |
| 8080  | Spring boot          |
| 9090  | Jenkins              |
| 12345 | WebSocket            |

### 역할 분배

![image.png](./readmeImg/0280a4d9-ddd7-4eb7-954a-fc23a2ec7313.png)
