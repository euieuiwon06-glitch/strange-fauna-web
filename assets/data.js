// 커버 띠 · 상세 일러스트 · 패키지 3종 데이터 (Figma '공룡 그래픽 템플릿' 페이지 기준)
window.FAUNA = {
  // 커버 띠: Figma Frame 2의 칸 순서와 투명도 그대로
  stripTop: {
    tiles: ['u0','u1','u2','u3','u4','u5','t00','t01','t02','t03','t04','t05','t06','t00','t01','t02','t03','t04','t05','t06'],
    opacity: [0.04,0.05,0.07,0.09,0.12,0.15,0.19,0.23,0.28,0.33,0.38,0.44,0.5,0.56,0.63,0.7,0.77,1,1,1],
  },
  stripBottom: {
    tiles: ['t07','t08','t09','t10','t11','t12','u0','u1','u2','u3','u4','u5','t00','t01','t07','t08','t09','t10','t11','t12'],
    opacity: [1,0.92,1,0.77,0.7,0.63,0.56,0.5,0.44,0.38,0.33,0.28,0.23,0.19,0.15,0.12,0.09,0.07,0.05,0.04],
  },
  // 상세 일러스트 18장, 사용자가 정한 순서 (n = assets/illust 파일 번호, ar = 가로/세로 비율)
  // 07(보정_02, 잎 위의 새)은 사용자 요청으로 제외
  illust: [
    { n: 14, src: '보정_18', ar: 1.3325 }, { n: 13, src: '보정_16', ar: 1.381 },  { n: 9,  src: '보정_09', ar: 1.4074 },
    { n: 8,  src: '보정_07', ar: 1.4183 }, { n: 17, src: '보정_24', ar: 1.4183 }, { n: 19, src: '보정_27', ar: 1.4368 },
    { n: 15, src: '보정_19', ar: 1.4275 }, { n: 16, src: '보정_20', ar: 1.4183 }, { n: 2,  src: '22',     ar: 1.3325 },
    { n: 11, src: '보정_14', ar: 1.4183 }, { n: 10, src: '보정_12', ar: 1.4368 }, { n: 12, src: '보정_15', ar: 1.3325 },
    { n: 3,  src: '23',     ar: 1.3325 }, { n: 18, src: '보정_26', ar: 1.4557 }, { n: 5,  src: '28',     ar: 1.3325 },
    { n: 4,  src: '25',     ar: 1.3325 }, { n: 6,  src: '29',     ar: 1.3325 }, { n: 1,  src: '21',     ar: 1.3325 },
  ],

  packages: [
    {
      id: 'sticker-archive', key: 'archive', no: 'Nº01', name: 'Sticker Archive',
      logo: ['Sticker', '+', 'Archive'], accent: '#F67261',
      nav: 'Box, Mailer, Sleeve',
      caps: {
        big1: ['Display Box', 'Front, Print'],
        s1: ['Display Box', 'Perspective'],
        c3: ['Mailer Box, Sleeve', 'Package'],
        s2: ['Die-cut Stickers', 'Creature, Rock'],
        big2: ['Dieline', 'Top view, Print'],
      },
      desc: [
        '앞면에는 파란 사막을 걷는 생물과 손글씨 로고를 크게 배치하고, 옆면에도 같은 풍경을 이어 붙였습니다.',
        '생물과 바위를 각각 다이컷 스티커로 떼어 만들어 상자 속에 함께 담기도록 했습니다.',
      ],
      palette: [['Blue','#1C7AE4'],['Sky','#4899E5'],['Navy','#3F60A8'],['Yellow','#F6CB28'],['Coral','#F67261']],
    },
    {
      id: 'sticker-kit-09', key: 'kit09', no: 'Nº02', name: 'Sticker Kit 09',
      logo: ['Sticker Kit', '+', '09'], accent: '#C76551',
      nav: 'Box, Mailer, Folder',
      caps: {
        big1: ['Display Box', 'Front, Kraft'],
        s1: ['Display Box', 'Perspective'],
        c3: ['Mailer Box, Folder', 'Package'],
        s2: ['Die-cut Stickers', '5 Birds'],
        big2: ['Dieline', 'Top view, Print'],
      },
      desc: [
        '크라프트지 질감 위에 빨간 큐브를 둘러싼 새 다섯 마리를 그려, 박스 정면을 하나의 장면처럼 구성했습니다.',
        '박스 속 다섯 마리 새를 각각 다이컷 스티커로 떼어 만들었습니다.',
      ],
      palette: [['Kraft','#DFB983'],['Blue','#6597C4'],['Red','#C76551'],['Purple','#816599'],['Pink','#B46C7C']],
    },
    {
      id: 'sticker-kit', key: 'kit', no: 'Nº03', name: 'Sticker Kit',
      logo: ['Sticker', '+', 'Kit'], accent: '#785B7D',
      nav: 'Window Box, Folder',
      caps: {
        big1: ['Window Box', 'Front, Print'],
        s1: ['Window Box', 'Perspective'],
        c3: ['Open Box, Folder', 'Package'],
        s2: ['Die-cut Sticker', 'Creature'],
        big2: ['Dieline', 'Top view, Print'],
      },
      desc: [
        '창이 뚫린 앞면 너머로 길게 누운 생물이 보이도록, 보랏빛 호수 풍경과 투명 창을 겹쳐 구성했습니다.',
        '창 속 생물을 다이컷 스티커로 떼어 만들고, 구체와 바위 스티커를 함께 구성했습니다.',
      ],
      palette: [['Mint','#B1C9A7'],['Lavender','#9B76AF'],['Plum','#785B7D'],['Yellow','#ECD074'],['Pink','#BD809A']],
    },
  ],
};
