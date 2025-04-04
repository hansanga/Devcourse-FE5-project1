# Notion Clone

## 📝 프로젝트 소개

Notion Clone Project는 Vanilla JS 를 사용하여 SPA로 구현된 프로젝트입니다.

- K-Digital Training: 클라우드 기반 프론트엔드 엔지니어링 1팀
- 강하영, 구민지, 권유정, 박상윤, 주경록, 한상아
- 기간: 2025-04-03 (목) ~ 2025-04-04 (금)

## 🕹️ 주요 기능

### 문서 관리

- 문서의 제목과 내용을 수정할 수 있습니다.
- 문서 수정시 자동저장 됩니다.
- 문서의 제목과 내용 사이의 + 버튼을 클릭하면 템플릿을 추가할 수 있습니다.
  - 텍스트, 제목1, 제목2, 제목3, 글머리 기호 목록, 숫자 목록, 체크박스 목록, ~~_구분선, 페이지 링크_~~
- 문서의 삭제가 가능합니다.

### 사이드 바

- 문서의 리스트를 출력합니다.
- 문서마다 하위 문서를 생성할 수 있습니다.

## 💡 기술 스택 및 협업도구

### 기술 스택

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">

### 프로젝트 관리

<img src="https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white"> <img alt="GitHub" src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/>

### 디자인

<img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white">

## ✏️ Code convention

- Fix: 수정 내용 작성
- Feat: 새로운 기능 추가, 사용자 입장에서 변화가 있을 경우
- Chore: 그 외 자잘한 수정에 대한 커밋, 주석, 리드미 수정
- Style: CSS 스타일 관련 변경
- Refactor: 코드 리팩토링에 대한 커밋, 사용자 입장에서 변화가 없는 코드, 파일명 폴더명 변경 및 이동
- Remove: 파일을 삭제하는 작업만 수행하는 경우
- Format: 코드 포맷팅 변경에 관련된 작업

## 📂 폴더 구조

```
├── README.md
├── images
├── server
│   └── server.js
├── css
│   ├── editor.css
│   ├── reset.css
│   └── sidebar.css
├── index.html
├── style.css
└── ./src
  ├── api.js
  ├── app.js
  ├── components
  │   ├── Document.js
  │   ├── info_tooltip.js
  └   └── Sidebar.js
```

## ✅ 실행 방법

```bash
git clone

npm install

node ./server/server.js

http://localhost:3000
```

## 💻 완성 사진
