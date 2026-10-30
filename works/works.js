// Canonical film catalog. Run node scripts/sync-art-portfolio.mjs after editing.
window.PORTFOLIO = {
  "featured": "ink-breath",
  "order": [
    "ink-breath",
    "gyeol",
    "sand-pendulum",
    "breath-beneath-the-tide",
    "nakhwa",
    "gyeong",
    "joinery"
  ],
  "materialsUrl": "mailto:deck@dexa.art?subject=Media%20art%20screening%20inquiry",
  "artist": {
    "name": "육대근",
    "alias": "DECK",
    "email": "deck@dexa.art",
    "website": "https://dexa.art/",
    "intro": "인간의 앎은 공간, 빛, 소리로 물질화될 수 있는가.",
    "bio": "육대근(DECK)은 「누스피어 레이어」라는 세계관 아래 실시간 시뮬레이션과 절차적 렌더링으로 작업하는 미디어 아티스트입니다. 직접 만든 시스템으로 움직임을 짓고, 소리와 빛이 서로에게 남기는 흔적을 바라봅니다.",
    "bioEn": "Yuk Daekeun (DECK) is a media artist working with real-time simulation and procedural rendering. Within his Noosphere Layer, he asks whether human knowing can be materialized in space, light and sound."
  },
  "works": [
    {
      "id": "gyeong",
      "title": "경(磬)",
      "subtitle": "소리가 앉는 자리",
      "titleEn": "Gyeong — Where Sound Settles",
      "year": 2026,
      "group": "individual",
      "caption": "옥빛 돌판 위에서, 소리의 진동이 가루를 모아 능선과 물길을 만든다.",
      "description": {
        "ko": "돌을 다듬어 음을 맞추는 편경에서 시작해, 화면 전체를 하나의 넓은 옥빛 돌판으로 펼쳤다. 가상의 판이 지닌 고유 진동을 계산해 합성한 소리가 울릴 때마다 진사빛 붉은색과 청록, 황색의 안료 가루가 진동의 무늬를 따라 느리게 모인다. 굵은 모래는 진동이 잦아드는 선으로, 고운 가루는 크게 울리는 자리로 움직인다. 가루는 능선과 골짜기, 물길 같은 지형이 되고, 낮게 비추는 빛이 그 결을 드러낸다. 작가가 Suno로 만든 앰비언트가 시간을 깔고, 앞선 소리의 잔상 위에 다음 형상이 겹친다. 소리가 형상으로 굳는 '누스피어 레이어'의 결정이다.",
        "en": "From the pyeongyeong, a chime of stones shaped to pitch, the whole screen becomes one jade-coloured stone plate. Each time a tone synthesized from the plate's natural vibrations sounds, cinnabar, blue-green and yellow powders gather along its vibration pattern. Coarse sand drifts to where vibration dies down, fine powder to where it rings most. The powder builds ridges, valleys and waterways under low light, over an ambient bed the artist made with Suno. Each new form settles on the trace of the last: crystallization in the Noosphere Layer, sound held as form."
      },
      "poster": "/works/assets/posters/gyeong.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261024/gyeong.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 60.0,
      "sound": true,
      "loop": true,
      "credit": "구상·연출·프로그래밍 육대근(DECK) · 음악: 작가가 Suno로 제작"
    },
    {
      "id": "nakhwa",
      "title": "낙화",
      "subtitle": "Confluence · 합류",
      "titleEn": "Nakhwa",
      "year": 2026,
      "group": "confluence",
      "caption": "느린 불비가 되어 떨어지는 불씨와, 그 빛을 한 번 더 붙드는 밤의 수면.",
      "description": {
        "ko": "봄밤의 연못. 물 위에 불을 매단 줄 여러 가닥이 걸려 있다. 줄은 보이지 않고 줄에서 쏟아지는 불만 보인다. 촬영한 장면은 없고, 수만 개의 불씨를 하나하나 계산해 그렸다. 불씨는 느린 불비가 되어 내리며 백금과 금에서 주홍, 붉은빛으로 식어 간다. 물은 그 불을 길게 떨리는 기둥으로 한 번 더 비추고, 떨어지는 불씨마다 고리 하나를 그리며 삼킨다. 바람이 일면 한 줄의 불이 셀 수 없는 점으로 흩어지고, 불씨 하나하나는 타는 순간에만 보인다. 작가가 Suno로 만든 음악의 악절마다 불빛이 차가워졌다 따뜻해진다. 흩어지고 깨어나는 빛, '누스피어 레이어'의 발산과 감응이다.",
        "en": "A spring night pond. Lines of fire hang above the water; the lines are never seen, only the fire pouring from them. Nothing is filmed: tens of thousands of computed embers fall as slow fire rain, cooling from white-gold through amber to red. The water doubles the fire as long trembling columns and swallows each ember with a ring. Wind scatters one line of fire into countless points, and each spark is seen only while it burns: divergence and sensing of the Noosphere Layer. With each phrase of music the artist made with Suno, the fire breathes cooler or warmer."
      },
      "poster": "/works/assets/posters/nakhwa.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261024/nakhwa.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 60.0,
      "sound": true,
      "loop": true,
      "credit": "구상·연출·프로그래밍 육대근(DECK) · 음악: 작가가 Suno로 제작"
    },
    {
      "id": "gyeol",
      "title": "결",
      "subtitle": "바람이 지나간 들",
      "titleEn": "Gyeol — Wind over the Grass",
      "year": 2026,
      "group": "confluence",
      "caption": "음악이 바람이 되어 빽빽한 들판을 지난다. 은빛 억새와 핑크뮬리, 달빛의 갈대 사이로 보이지 않는 힘이 빛과 그늘의 결을 남긴다.",
      "description": {
        "ko": "하늘과 지평선 없이, 빽빽한 들판을 바로 위에서 바라본다. 음악의 낮은 울림이 차오르면 풀이 기울고, 이삭의 방향을 따라 빛과 그늘의 결이 달라진다. 바람은 여러 방향으로 스며들고 겹치며 풀밭에 흐름을 남긴다. 억새의 은빛에서 핑크뮬리, 달빛을 머금은 갈대로 이어지는 동안 들판의 색과 시간이 천천히 바뀐다. 풀과 바람의 움직임은 음악에 반응하는 자체 시뮬레이션으로 만들어졌다. 보이지 않는 힘이 풀의 몸을 빌려 모습을 얻는 60초. 소리가 움직임으로, 움직임이 빛으로 번지는 '누스피어 레이어'의 감응과 발산을 담는다.",
        "en": "Seen from directly above, a dense field fills the frame. Music becomes wind, bending the grass in shifting directions and turning its surface into bands of light and shade. Silver grass gives way to pink muhly and moonlit reeds as the field moves through changing light. Built with a custom simulation, this sixty-second loop makes an unseen force visible through the bodies it moves. Sound becomes motion, and motion becomes light: resonance and dispersion within the artist's Noosphere Layer."
      },
      "poster": "/works/assets/posters/gyeol.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261024/gyeol.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 60.0,
      "sound": true,
      "loop": true,
      "credit": "구상·연출·프로그래밍 육대근(DECK) · 음악: 작가가 Suno로 제작"
    },
    {
      "id": "joinery",
      "title": "결구",
      "subtitle": "구조와 여백",
      "titleEn": "Joinery",
      "year": 2026,
      "group": "individual",
      "caption": "단청 부재가 천천히 맞물리고 벌어지는 동안, 틈 너머 지붕과 실내의 깊이가 드러난다.",
      "description": {
        "ko": "한옥의 처마 아래를 바짝 올려다본다. 화면을 가로지르는 단청 부재가 천천히 미끄러지고, 서로의 자리를 찾아 맞물린 뒤 다시 간격을 벌린다. 주홍과 옥빛의 문양은 목재의 옆면과 아랫면을 따라 이어지고, 부재 사이로 서까래와 천장, 뒤쪽 구조가 겹쳐 보인다. 한 부재의 표면에서는 안료가 작은 점으로 잠시 흩어졌다 돌아오지만, 건물의 공간은 계속 남아 있다. 카메라가 한 방향으로 이동하는 동안 가려졌던 면과 틈의 깊이가 드러난다. 구조를 지탱하는 결합과 여백의 관계를, 느린 조립과 분리의 움직임으로 바라보는 60초의 3D 영상이다.",
        "en": "Seen from beneath the eaves of a Korean timber building, painted beams fill the frame. They slide, align and settle into one another, then slowly part. Vermilion and jade patterns follow their sides and undersides; rafters and ceilings remain visible through the gaps. Pigment briefly loosens into points on one beam while the surrounding architecture stays intact. A camera moving in one direction reveals hidden faces and depth. This sixty-second 3D work explores how joints and spaces hold a structure together."
      },
      "poster": "/works/assets/posters/joinery.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261024/joinery.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 60.0,
      "sound": true,
      "loop": false,
      "credit": "구상·연출·프로그래밍 육대근(DECK) · 절차적 3D 애니메이션 · 음악: 작가가 Suno로 제작"
    },
    {
      "id": "sand-pendulum",
      "title": "하모노그래프",
      "subtitle": "움직임이 남긴 시간",
      "titleEn": "Harmonograph",
      "year": 2026,
      "group": "individual",
      "caption": "두 강철 구가 겹쳐 그린 곡선이 모래 위에 쌓이며, 반복되는 운동이 시간의 지형으로 남는다.",
      "description": {
        "ko": "크기가 다른 두 강철 구가 넓은 모래 위를 천천히 오간다. 서로 다른 주기와 위상으로 움직이는 구는 하나의 영역에 리사주 곡선을 겹쳐 그린다. 지나간 자리는 지워지지 않고 홈으로 쌓이며, 뒤따르는 움직임이 앞선 흔적을 다시 가로지른다. 낮게 들어오는 빛은 모래의 작은 굴곡과 밀려난 가장자리에 긴 그림자를 드리우고, 구의 표면에는 주변의 빛이 비친다. 살짝 기울인 탑뷰가 한 방향으로 이동하는 동안 두 궤적은 하나의 그림으로 이어진다. 작가가 Suno로 만든 음악 위에서, 반복되는 운동이 되돌릴 수 없는 지형과 시간의 기록으로 남는 60초의 3D 영상이다.",
        "en": "Two steel spheres of different sizes move slowly across a wide sand field. Their distinct rhythms trace overlapping Lissajous curves in one shared space. Each passage leaves a groove, and later movements cross the marks already there. Low light reveals ridges and grains while reflections shift across the polished steel. A slightly tilted overhead camera moves in one direction. With music made by the artist using Suno, this sixty-second 3D work turns recurring motion into a landscape that remembers time."
      },
      "poster": "/works/assets/posters/sand-pendulum.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261024/Harmonograph_3x_60s_review_1920x640.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 60.0,
      "sound": true,
      "loop": false,
      "credit": "구상·연출·프로그래밍 육대근(DECK) · 절차적 3D 시뮬레이션 · 음악: 작가가 Suno로 제작"
    },
    {
      "id": "ink-breath",
      "title": "먹의 호흡",
      "subtitle": "두 폭의 산수, 한 호흡",
      "titleEn": "Ink Breath",
      "year": 2026,
      "group": "individual",
      "caption": "거문고 한 음마다 먹 알갱이가 모여 산수가 되고, 바람처럼 쓸려 다른 산수로 내려앉는다.",
      "description": {
        "ko": "낡은 한지 위에 먹 알갱이 백만 개가 안개처럼 떠돈다. 거문고 술대가 줄을 칠 때마다 알갱이들이 모여 산수의 한 층을 이룬다. 먼 산과 폭포, 강과 바위, 소나무와 정자가 차례로 맺혀 한 폭의 산수가 완성되고, 셋째 악절에서 먹은 종이에서 떠올라 바람처럼 쓸리며 절벽과 호수, 고깃배가 있는 다른 산수로 다시 내려앉는다. 여음이 길게 남는 동안 그림 전체가 숨 쉬듯 조였다 풀리고, 마지막에는 모두 안개로 돌아간다. 작가가 Suno로 만든 거문고 곡 위에서 수묵 산수 두 폭이 한 호흡으로 이어지는 60초의 입자 영상이다.",
        "en": "A million grains of ink drift like mist over aged hanji paper. Each strike of the geomungo plectrum gathers them into one layer of a landscape: distant peaks and a waterfall, river and rocks, pines and a pavilion settle in turn until a whole ink painting stands. In the third phrase the ink lifts off the paper, sweeps across like wind and settles into another landscape of cliffs, a lake and a boat. While the strings resonate the picture breathes, and at the end all returns to mist. Set to a geomungo piece the artist made with Suno, two landscapes pass in a breath."
      },
      "poster": "/works/assets/posters/ink-breath.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261024/ink-breath.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 59.5,
      "sound": true,
      "loop": false,
      "credit": "구상·연출·프로그래밍 육대근(DECK) · GPU 입자 군집(먹 알갱이 100만) · 산수 밑그림 2장은 작가가 AI(Nano Banana Pro)로 생성해 입자 배치 지도로만 사용 · 음악: 작가가 Suno로 제작한 거문고 곡"
    },
    {
      "id": "breath-beneath-the-tide",
      "title": "수면의 호흡",
      "subtitle": "파도와 빛의 안쪽",
      "titleEn": "Breath Beneath the Tide",
      "year": 2026,
      "group": "individual",
      "caption": "파란 하늘 아래 음악이 큰 너울을 밀어 올린다. 수면을 통과해 굴절된 빛을 바라보고, 다시 열린 바다로 돌아오는 90초의 여정.",
      "description": {
        "ko": "쨍한 파란 하늘 아래, 음악의 낮은 울림이 바다를 밀어 올린다. 넓은 수평선에서 시작한 시선은 커다란 너울에 다가가고, 파도의 능선을 따라 빛과 흰 포말이 흩어진다. 수면을 통과하면 하늘은 물결 사이로 굴절되고, 소리가 만든 움직임은 머리 위의 푸른 천장이 된다. 깊이를 지나 다시 열린 바다로 돌아오는 90초의 여정. 실제 음원의 저음과 고음이 파도의 변위와 미세한 표면 변화에 연결되어, 듣는 힘이 바라보는 풍경으로 드러난다. 수면은 바다를 나누는 선이면서, 같은 세계를 다른 감각으로 만나게 하는 경계다.",
        "en": "Beneath a vivid blue sky, low musical pulses lift the ocean. The view approaches broad swells, follows bright crests and white foam, then passes through the surface. Underwater, the sky bends into a shifting window of light. This ninety-second journey returns to the open sea, linking measured musical energy to wave displacement and fine surface changes. The waterline becomes a threshold between two ways of sensing the same world: sound takes shape, and a landscape becomes an experience of depth."
      },
      "poster": "/works/assets/posters/breath-beneath-the-tide.jpg",
      "video": "https://github.com/DECK6/adxdeck/releases/download/art-films-20261030/breath-beneath-the-tide.mp4",
      "resolution": [
        6144,
        2048
      ],
      "fps": 30,
      "duration": 90,
      "sound": true,
      "loop": false,
      "credit": "구상·연출 육대근(DECK) · Three.js/Poseidon 기반 바다 렌더링 · 하늘: 생성형 AI · 음악: 작가가 Suno로 제작"
    }
  ],
  "homeFeatured": [
    "ink-breath",
    "gyeol",
    "sand-pendulum"
  ],
  "series": []
};
