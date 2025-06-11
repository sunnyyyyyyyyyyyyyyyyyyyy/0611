let handpose, video;
let detections = [];
let canvas;

const LEFT = ["教學設計", "程式設計", "攝影與視覺傳達"];
const RIGHT = ["教材與策略規劃", "撰寫邏輯語法", "鏡頭與美感訓練"];
const CORRECT = {
  "教學設計": "教材與策略規劃",
  "程式設計": "撰寫邏輯語法",
  "攝影與視覺傳達": "鏡頭與美感訓練"
};
let leftPos = [], rightPos = [];
let selected = null, lines = [];
let success = false, modelReadyFlag = false;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // 影片素材隱藏，改由畫布 image() 顯示

  handpose = ml5.handpose(video, () => modelReadyFlag = true);
  handpose.on("predict", results => detections = results);

  textSize(18);
  for (let i = 0; i < LEFT.length; i++) {
    leftPos.push({x:150, y:120 + i * 120});
    rightPos.push({x:490, y:120 + i * 120});
  }
}

function draw() {
  background(240);
  if (!modelReadyFlag) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("模型載入中...", width/2, height/2);
    return;
  }

  image(video, 0, 0, width, height); // 顯示鏡頭畫面 :contentReference[oaicite:1]{index=1}

  // 畫題目與答案區
  :contentReference[oaicite:2]{index=2}
  :contentReference[oaicite:3]{index=3}

  // 轉換食指尖座標
  :contentReference[oaicite:4]{index=4}
  :contentReference[oaicite:5]{index=5}
    :contentReference[oaicite:6]{index=6}
    :contentReference[oaicite:7]{index=7}
    :contentReference[oaicite:8]{index=8}
    :contentReference[oaicite:9]{index=9}
    noStroke();
    :contentReference[oaicite:10]{index=10}
  }

  // 畫已配對線條
  :contentReference[oaicite:11]{index=11}
  strokeWeight(3);
  :contentReference[oaicite:12]{index=12}

  // 畫選取中的拖曳線
  :contentReference[oaicite:13]{index=13}
    :contentReference[oaicite:14]{index=14}
    :contentReference[oaicite:15]{index=15}
  }

  // 完成訊息
  if (success) {
    noStroke();
    :contentReference[oaicite:16]{index=16}
    textSize(28);
    textAlign(CENTER);
    :contentReference[oaicite:17]{index=17}
  }
}

:contentReference[oaicite:18]{index=18}
  fill(255);
  stroke(0);
  :contentReference[oaicite:19]{index=19}
  noStroke();
  fill(0);
  :contentReference[oaicite:20]{index=20}
  :contentReference[oaicite:21]{index=21}
}

function touchStarted() {
  :contentReference[oaicite:22]{index=22}
    :contentReference[oaicite:23]{index=23}
      :contentReference[oaicite:24]{index=24}
        :contentReference[oaicite:25]{index=25}
      }
    });
  }
  return false;
}

function touchEnded() {
  :contentReference[oaicite:26]{index=26}
    :contentReference[oaicite:27]{index=27}
      :contentReference[oaicite:28]{index=28}
          :contentReference[oaicite:29]{index=29}
        lines.push({
          :contentReference[oaicite:30]{index=30}
          :contentReference[oaicite:31]{index=31}
          :contentReference[oaicite:32]{index=32}
        });
      }
    });

    if (lines.length === LEFT.length) {
      success = lines.every(l => CORRECT[l.text] === 
        RIGHT[rightPos.findIndex(r => r.y === l.y2 && r.x === l.x2)]);
    }
    selected = null;
  }
  return false;
}

function windowResized() {
  :contentReference[oaicite:33]{index=33}
}
