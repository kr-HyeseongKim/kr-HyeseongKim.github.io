# Hyeseong Kim — 개인 홈페이지

GitHub Pages로 운영되는 홈페이지입니다. **내용은 모두 `content` 폴더 안의 파일만 고치면 됩니다.**
디자인 파일(`index.html`, `style.css`, `site.js`)은 건드리지 않아도 됩니다.

## GitHub에서 내용 수정하는 법

1. 이 저장소 페이지에서 `content` 폴더 → 고칠 파일을 클릭합니다.
2. 오른쪽 위 **연필 아이콘(Edit this file)** 을 누릅니다.
3. 내용을 고친 뒤 오른쪽 위 **Commit changes…** → **Commit changes** 를 누릅니다.
4. 1~2분 뒤 홈페이지에 반영됩니다. (안 보이면 새로고침)

## 파일 구성

| 파일 | 내용 |
|---|---|
| `content/site.yml` | 이름, 한 줄 소개, 링크 버튼, **섹션 순서와 제목**, 하단 문구 |
| `content/research.md` | Research Interests |
| `content/education.md` | Education |
| `content/experience.md` | Research Experience |
| `content/publications.md` | Publications |
| `content/presentations.md` | Presentations |
| `content/programs.md` | Program Development |
| `content/work.md` | Work |
| `profile.jpg` | 프로필 사진 (같은 이름으로 업로드하면 교체됨) |
| `cv.pdf` | CV 파일 (같은 이름으로 업로드) |

## 작성 규칙 (Markdown)

```markdown
### 제목 | 기간                ← 제목 오른쪽에 기간이 표시됨
소속, 장소                      ← 제목 바로 아래 줄은 회색 글씨

- 글머리 항목

#### In English                ← 작은 소제목 (대문자로 표시)

1. 저자, **Kim, H.** (2026). 논문 제목. *저널명, 1*(2), 3–4. `Submitted`
```

- `**굵게**` → 본인 이름 강조
- `*기울임*` → 저널·학회명
- `` `글자` `` → 작은 배지 (예: `Submitted`, `Poster`, `Under review`)
- `[보이는 글자](https://주소)` → 링크
- 번호 목록은 모두 `1.`로 써도 자동으로 1, 2, 3… 번호가 매겨집니다.

## 섹션 추가·삭제·순서 바꾸기

`content/site.yml`의 `sections` 목록을 고칩니다. 새 섹션을 추가하려면:

1. `content` 폴더에서 **Add file → Create new file** 로 `awards.md` 같은 파일을 만들고,
2. `site.yml`의 `sections`에 아래처럼 추가합니다. (앞의 공백 개수를 기존 줄과 똑같이 맞춰야 합니다)

```yaml
  - title: Awards
    file: awards.md
```

## 링크 버튼 추가

`site.yml`의 `links`에 추가합니다. `icon`은 `email`, `orcid`, `cv`, `scholar`, `github`, `link` 중 하나.

```yaml
  - label: Google Scholar
    url: https://scholar.google.com/citations?user=...
    icon: scholar
```
