# 초등교육 온톨로지 설계

가상의 초등 수학 수업 설계 자료입니다. 선수 관계는 이 수업의 교수학습 가정이며 공식 교육과정의 필수 순서나 학생 진단 결과가 아닙니다.

## 종류
- Topic: 학습 주제
- Material: 교재
- Assessment: 확인 질문
- Path: 학습 경로
- Plan: 수업 설계

## 관계
- requires: 먼저 확인한다 (Topic → Topic)
- teaches: 학습을 돕는다 (Material → Topic)
- checks: 이해를 확인한다 (Assessment → Topic)
- targets: 도달 목표로 삼는다 (Path → Topic)
- documents: 설계를 기록한다 (Plan → Path)

OWL 파일은 종류·관계·개체·출처를 표현합니다. 웹의 순환/필수값 검사는 별도의 경량 검사이며 OWL reasoner나 SHACL 엔진 실행 결과가 아닙니다.
