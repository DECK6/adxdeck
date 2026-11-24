---
title: "AI 분석 코드에서 전처리가 시험 데이터를 미리 보지 않게 하려면"
description: "AI가 작성한 분석 코드의 전처리에서 학습 데이터와 시험 데이터의 경계를 확인하는 방법을 살펴봅니다. 작은 표준화 예제와 교차검증으로 Pipeline의 역할과 한계를 짚습니다."
aliases:
  - "Fit Preprocessing Inside the AI Evaluation Boundary"
author: 육대근
date created: 2026-11-24
date modified: 2026-11-24
tags:
  - article
  - AI
  - evaluation
  - machine-learning
  - data-quality
track: ai-ax
type: article
status: completed
thumbnail: images/fit-preprocessing-inside-the-ai-evaluation-boundary-cover.png
akmLayer: output
akmType: output
trustLevel: reviewed
---

# AI 분석 코드에서 전처리가 시험 데이터를 미리 보지 않게 하려면

![유리 칸막이로 나뉜 두 접시 중 한쪽의 구슬만 측정하는 황동 도구](images/fit-preprocessing-inside-the-ai-evaluation-boundary-cover.png)

*학습용 자료와 평가용 자료의 경계를 표현한 AI 생성 개념 이미지다. 실제 장비나 실험 결과를 재현한 사진은 아니다.*

AI에게 고객 문의 분류기를 만드는 코드를 부탁했다고 가정해 보자. 코드는 결측값을 채우고, 숫자 열의 크기를 맞추고, 학습용과 시험용 데이터를 나눈 다음 성능을 출력한다. 오류 없이 실행되고 점수도 좋아 보인다. 그런데 데이터 전체를 보고 만든 전처리 기준이 이미 시험용 자료의 정보를 학습 과정에 전달했다면, 마지막 점수는 아직 만나지 않은 문의를 얼마나 잘 처리할지 판단하는 근거로 쓰기 어렵다.

분류기나 회귀기를 학습시키는 코드에서 모델은 마지막 `fit` 호출로만 만들어지지 않는다. 평균을 구하고, 빈칸을 채울 값을 정하고, 사용할 열을 고르는 단계도 데이터에서 규칙을 배우는 과정이다. AI가 코드를 작성한 업무에서는 실행 성공과 함께 이 규칙을 어느 자료에서 배웠는지 확인해야 한다. 이는 특정 AI 모델이 누수를 일으킨다는 주장이 아니라, 생성된 분석 코드를 사람이 검토할 때 적용할 기준이다.

## 데이터에서 배운 규칙은 어디까지 전달되는가

[scikit-learn의 현재 공식 지침](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)은 전처리에서 학습한 변환에도 학습·시험 분리가 적용되어야 한다고 설명한다. 표준화의 평균과 분산, 결측값 대체에 쓰는 통계, 특징 선택의 기준은 모두 확인할 대상이다. 시험 자료에 정답 열이 없더라도 그 입력값이 평균 계산에 들어갔다면, 시험 자료의 정보가 학습 과정을 바꾼 셈이다.

작은 가상 예제로 이 차이를 확인할 수 있다. 학습용 값은 `0, 2, 4`, 시험용 값은 `100`이라고 하자. 학습 자료만 본 평균은 `2`다. 시험 자료까지 합쳐 구한 평균은 `26.5`다. 다음 코드는 scikit-learn 1.9.1에서 실행해 두 값을 확인한 예제다. 실제 고객 자료나 AI 모델의 성능 측정값은 쓰지 않았다.

```python
import numpy as np
from sklearn.preprocessing import StandardScaler

X_train = np.array([[0.], [2.], [4.]])
X_test = np.array([[100.]])

proper = StandardScaler().fit(X_train)
leaked = StandardScaler().fit(np.vstack([X_train, X_test]))

print(proper.mean_[0])  # 2.0
print(leaked.mean_[0])  # 26.5

X_train_scaled = proper.transform(X_train)
X_test_scaled = proper.transform(X_test)
```

마지막 두 줄은 같은 전처리 객체로 학습 자료와 시험 자료를 변환한다. 시험 자료를 변환할 때 평균을 다시 구하지 않는다. 학습 자료에서 정한 기준을 시험 자료에도 적용하는 것이다. 시험 자료에 별도로 `fit_transform`을 실행하면 시험 자료가 자기만의 기준을 갖게 되어, 학습할 때와 다른 좌표에서 예측하게 될 수 있다.

이 예제는 누수의 통로를 눈에 보이게 만든다. 평균이 달라졌다는 사실만으로 성능 점수가 반드시 얼마나 오르는지까지 결론 내릴 수는 없다. 실제 영향은 전처리와 모델, 데이터 분포에 따라 달라진다. 확인해야 할 첫 번째 사실은 점수의 크기가 아니라, 평가에 남겨 둔 자료가 학습 규칙을 정하는 데 쓰였는지다.

## 교차검증에서는 전처리도 매번 새로 배운다

학습·시험을 한 번 나누는 코드를 고쳐도, 교차검증 앞에서 전처리를 끝내면 문제가 다시 생긴다. 예를 들어 전체 학습 자료를 표준화한 배열에 교차검증을 적용하면, 각 검증 구간의 값이 이미 전체 평균에 반영되어 있다. 교차검증은 마지막 모델만 나누는 절차가 되어서는 안 된다. 데이터에서 규칙을 배우는 전처리도 해당 구간의 학습 자료 안에서 이루어져야 한다.

`Pipeline`은 이 순서를 코드 구조로 묶는 데 쓸 수 있다. 다음 예제에서는 숫자 여섯 개를 세 구간으로 나누고, 각 학습 구간에서 표준화기가 배운 평균을 직접 확인한다. `return_estimator=True`는 각 구간에서 학습된 객체를 돌려받기 위한 설정이다.

```python
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold, cross_validate
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X = np.array([[0.], [2.], [4.], [6.], [8.], [10.]])
y = np.array([0., 1., 2., 3., 4., 5.])
model = make_pipeline(StandardScaler(), Ridge())
result = cross_validate(
    model, X, y,
    cv=KFold(n_splits=3, shuffle=False),
    return_estimator=True,
)
means = [
    fitted.named_steps['standardscaler'].mean_[0]
    for fitted in result['estimator']
]
print(means)  # 값은 순서대로 7.0, 5.0, 3.0
```

첫 검증 구간은 `0, 2`이고 나머지 학습 자료의 평균은 `7`이다. 다음 두 학습 구간의 평균은 각각 `5`, `3`이다. 실행 결과도 이 순서와 같았다. 전체 평균 `5` 하나를 모든 구간에 재사용하지 않았다는 것을 확인한 것이다. 여섯 개의 값으로 만든 예제이므로 점수 자체에는 업무 성능의 의미를 부여하지 않는다.

실제 분석에서는 데이터 분할 방법도 업무 질문에 맞춰야 한다. 이 예제의 순차적인 `KFold`를 고객 기록이나 시계열에 그대로 적용하라는 뜻은 아니다. [같은 고객의 기록을 어느 평가 집합에 둘지](https://dexa.art/blog/posts/split-ai-evaluation-data-by-the-question-you-ask/)는 별도의 판단이고, 그 판단 뒤에도 전처리가 학습 구간 안에 머무는지 확인해야 한다.

## Pipeline 밖에서 이미 본 정보는 되돌릴 수 없다

공식 문서는 전처리와 모델을 Pipeline에 함께 넣어 교차검증하는 방식을 권한다. 하지만 Pipeline이라는 이름이 모든 누수를 차단하는 것은 아니다. 그 객체에 들어가기 전에 전체 자료로 중요한 열을 골랐다면, Pipeline은 이미 선택이 끝난 입력을 받는다. 미래에만 알 수 있는 값을 입력 열에 넣거나 시험 점수를 반복해서 보고 설계를 바꾸는 문제도 전처리를 묶는 것만으로 해결되지 않는다.

코드를 검토할 때는 다음처럼 입력이 이동하는 순서를 적어 보면 좋다. 아래 표는 공식 문서의 기능 목록이 아니라, 그 원칙을 팀의 분석 검토에 적용하기 위한 제안이다.

| 검토할 단계 | 남길 근거 | 확인할 경계 |
|---|---|---|
| 자료 분할 | 학습·검증·최종 시험에 속한 행의 기준 | 같은 대상이나 미래 정보가 어디까지 공유되는가 |
| 전처리 학습 | 각 `fit` 호출에 전달한 자료 | 평균·대체값·선택 기준을 어떤 행에서 배웠는가 |
| 검증 예측 | 학습된 전처리 객체와 변환 대상 | 검증 자료에는 기존 규칙을 적용했는가 |
| 최종 평가 | 설계 선택을 끝낸 뒤 사용한 시험 자료 | 시험 결과를 보고 다시 선택한 것은 없는가 |

모든 데이터 변환을 무조건 학습이라고 부를 필요는 없다. 데이터 분포를 보지 않고 미리 정한 단위 환산과, 표 전체에서 추정한 평균으로 값을 바꾸는 작업은 다르다. 검토자가 물어야 할 것은 함수 이름에 ‘정리’가 들어가는지가 아니라, 해당 규칙이 어떤 정보로 정해졌는지다.

## AI에게 코드와 함께 확인 가능한 경계를 요구하기

AI에게 분석 코드를 맡길 때 요청문에 이 검토 기준을 넣을 수 있다. 자료를 먼저 분할하고, 데이터에서 통계를 배우는 변환은 각 학습 구간 안에서 실행하며, 검증 자료에는 학습된 변환만 적용하도록 요구한다. 이어서 평균이나 선택된 열처럼 실제로 학습된 속성을 출력하게 하면, 설명과 코드가 같은 순서를 따르는지 비교하기 쉽다.

검토의 완료 조건도 실행 성공을 넘어 구체적으로 정할 수 있다. 어떤 자료로 전처리를 학습했는지 추적할 수 있고, 검증 자료를 변환한 뒤 그 학습 속성이 바뀌지 않았으며, 교차검증의 각 구간이 자기 학습 자료에서 규칙을 배웠다는 근거가 있어야 한다. 최종 시험 집합을 설계 선택에 쓰지 않았다는 운영 기록도 함께 남긴다.

AI가 빠르게 완성한 분석 코드의 가치는 검토 가능한 상태로 전달될 때 커진다. 성능 점수 옆에 데이터 경계를 남기면, 동료는 높은 숫자를 믿을지부터 고민하는 대신 그 숫자가 어떤 절차에서 나왔는지 확인할 수 있다.

---

근거는 2026년 11월 24일 확인한 [scikit-learn 1.9.1의 공통 실수 안내](https://scikit-learn.org/stable/common_pitfalls.html)와 [공식 저장소 기본 브랜치의 해당 문서 고정본](https://github.com/scikit-learn/scikit-learn/blob/6b8ba39487fe28111986d599deecd0680d2787d0/doc/common_pitfalls.rst)이다. 본문의 작은 수치 예제는 이 글을 위해 구성해 직접 실행했다. 특정 AI 서비스의 오류율이나 조직의 도입 성과를 측정한 결과는 아니다.
