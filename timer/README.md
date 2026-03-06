# Lecture Flow Timer

강의 진행 중 휴식, 점심시간, 실습 세션을 빠르게 전환할 수 있는 정적 웹앱입니다.

## 실행

브라우저에서 [index.html](/Users/deck/Documents/Playground/index.html)을 바로 열어도 되고, 간단한 정적 서버로 실행해도 됩니다.

```bash
python3 -m http.server 8000
```

그 뒤 브라우저에서 `http://localhost:8000` 으로 접속하면 됩니다.

## 기능

- 휴식, 점심시간, 실습 세션 선택
- 지속 시간 또는 종료 시각 기준 카운트다운
- 휴식/점심 세션 Web Audio 배경음
- 세션별 미디어아트 스타일 캔버스 그래픽
- 시작, 일시정지, 정지 제어
