# Hyeseong Kim — 개인 홈페이지

GitHub Pages로 운영되는 홈페이지입니다. 모든 내용은 `content/data.json` 한 파일에 들어 있습니다.

## 내용 수정하는 법

**맥의 편집기를 쓰는 것이 가장 편합니다.** 바탕화면의 `홈페이지 편집.command`를 더블클릭하면 편집 화면이 열리고, 칸을 채운 뒤 **게시하기**를 누르면 1~2분 뒤 홈페이지에 반영됩니다.

GitHub 웹에서 직접 고칠 수도 있습니다. `content/data.json` → 연필 아이콘(Edit this file) → 고친 뒤 **Commit changes**. 따옴표(`"`)와 쉼표(`,`)를 지우지 않도록 주의하세요.

## 파일 구성

| 파일 | 내용 |
|---|---|
| `content/data.json` | 이름, 소개, 링크, 섹션과 모든 항목 |
| `profile.jpg` | 프로필 사진 |
| `cv.pdf` | CV 파일 |
| `index.html`, `style.css`, `site.js` | 디자인 (내용 수정 시 건드릴 필요 없음) |

## data.json의 형식 (참고)

- 섹션 `type`: `text`(글), `entries`(경력·학력형), `publications`(논문형), `presentations`(발표형)
- 섹션 `page`: `main`(메인 페이지) 또는 `separate`(왼쪽 메뉴 아래 별도 페이지)
- `hidden: true`인 섹션이나 항목은 홈페이지에 보이지 않습니다.
- 날짜 `kind`: `range`(기간), `single`(기일), `ongoing`(시작 – present), `none`(없음)
- 논문 `status`: `published`(표시 없음), `submitted`, `review`(Under review)
- `highlight`에 적은 이름(예: `Kim, H.`)은 저자 목록에서 굵게 표시됩니다.
