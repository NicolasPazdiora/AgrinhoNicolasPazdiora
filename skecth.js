let tela = "CAMPO";

let dinheiro = 0;
let dinheiroParaVencer = 1000;
let perdeu = false;

// 🚗 Carro e melhoria
let carro = { x: 850, y: 450, largura: 120, altura: 80 };
let carroMelhorado = false;
let botaoMelhoriaVisivel = true;

// 🌾 Plantas e grade
let gridPlantas = [];
let plantas = [
  { nome: "Alface", quantidade: 0, incremento: 1, preco: 5, cor: [0, 200, 0] },
  { nome: "Cenoura", quantidade: 0, incremento: 1, preco: 7, cor: [255, 140, 0] },
  { nome: "Couve-Flor", quantidade: 0, incremento: 1, preco: 10, cor: [245, 245, 245] },
  { nome: "Pepino", quantidade: 0, incremento: 1, preco: 6, cor: [0, 100, 0] },
  { nome: "Tomate", quantidade: 0, incremento: 1, preco: 8, cor: [255, 0, 0] },
];

// 🌞 Ciclo dia/noite
let tempoInicio = 0;
let duracaoDia = 2 * 60 * 1000; // 2 minutos
let ehDia = true;
let sol = { x: 0, y: 100 };
let nuvens = [];

// 👥 Clientes
let filaPessoas = [];

function setup() {
  createCanvas(1000, 600);
  gerarGradePlantas();
  gerarFila();
  gerarNuvens();
  tempoInicio = millis();
}

function gerarGradePlantas() {
  gridPlantas = [];
  let inicioX = 165;
  let inicioY = 220;
  let espacamentoX = 80;
  let espacamentoY = 70;
  plantas.forEach((p, index) => {
    let linha = [];
    for (let i = 0; i < 8; i++) {
      linha.push({
        planta: p,
        x: inicioX + i * espacamentoX,
        y: inicioY + index * espacamentoY
      });
    }
    gridPlantas.push(linha);
  });
}

function gerarNuvens() {
  nuvens = [];
  for (let i = 0; i < 5; i++) {
    nuvens.push({
      x: random(width),
      y: random(50, 150),
      velocidade: random(0.2, 0.5)
    });
  }
}

function draw() {
  background(135, 206, 235);
  atualizarCiclo();
  desenharCenario();

  if (tela === "CAMPO") {
    desenharCampo();
  } else if (tela === "CIDADE") {
    desenharCidade();
  }

  desenharDinheiro();
  desenharContadorTempo();
  checarVitoria();

  if (perdeu) {
    mostrarTelaPerdeu();
    noLoop();
  }
}

function atualizarCiclo() {
  let tempoDecorrido = millis() - tempoInicio;
  let progresso = tempoDecorrido / duracaoDia;

  if (tempoDecorrido > duracaoDia) {
    perdeu = true;
  }

  sol.x = progresso * width;
  sol.y = 100 + sin(progresso * PI) * 80;

  nuvens.forEach(nuvem => {
    nuvem.x += nuvem.velocidade;
    if (nuvem.x > width + 50) {
      nuvem.x = -50;
    }
  });
}

function desenharCenario() {
  background(135, 206, 235);

  fill(255, 255, 0);
  ellipse(sol.x, sol.y, 80, 80);

  // 🌞 Raios de sol animados
  push();
  translate(sol.x, sol.y);
  let numRaios = 12;
  let tempo = millis() * 0.005;
  for (let i = 0; i < numRaios; i++) {
    let angulo = map(i, 0, numRaios, 0, TWO_PI);
    let comprimento = 50 + sin(tempo + i) * 10;
    stroke(255, 255, 0, 180);
    strokeWeight(2);
    line(0, 0, cos(angulo) * comprimento, sin(angulo) * comprimento);
  }
  pop();

  fill(255, 255, 255, 200);
  nuvens.forEach(nuvem => {
    ellipse(nuvem.x, nuvem.y, 60, 40);
    ellipse(nuvem.x + 30, nuvem.y + 10, 50, 30);
    ellipse(nuvem.x - 30, nuvem.y + 10, 50, 30);
  });
}

function desenharCampo() {
  fill(34, 139, 34);
  rect(0, 100, width, 600);

  fill(160, 82, 45);
  rect(100, 180, 700, 350);

  for (let i = 0; i < 5; i++) {
    fill(139, 69, 19);
    rect(135 + i * 150, 100, 20, 80);
    fill(34, 139, 34);
    ellipse(145 + i * 150, 80, 80, 80);
  }

  gridPlantas.forEach(linha => {
    linha.forEach(ponto => {
      desenharPlanta(ponto);
    });
  });

  plantas.forEach((p, i) => {
    fill(0);
    textAlign(LEFT);
    textSize(16);
    text(`${p.nome}: ${p.quantidade}`, 850, 200 + i * 30);
  });

  desenharCarro(carro.x, carro.y);

  fill(0);
  textAlign(CENTER);
  textSize(18);
  text("Clique na planta para colher | Clique no carro para ir para a cidade", width / 2, 50);
}

function desenharPlanta(ponto) {
  const p = ponto.planta;

  fill(120, 60, 20);
  ellipse(ponto.x, ponto.y, 60, 30);

  if (p.nome === "Alface") {
    fill(0, 200, 0);
    ellipse(ponto.x, ponto.y - 5, 30, 30);
  } else if (p.nome === "Cenoura") {
    fill(34, 139, 34);
    triangle(ponto.x - 10, ponto.y - 10, ponto.x + 10, ponto.y - 10, ponto.x, ponto.y - 30);
    fill(255, 140, 0);
    ellipse(ponto.x, ponto.y + 5, 8, 16);
  } else if (p.nome === "Couve-Flor") {
    fill(34, 139, 34);
    ellipse(ponto.x, ponto.y, 40, 15);
    fill(245);
    ellipse(ponto.x, ponto.y - 10, 25, 25);
  } else if (p.nome === "Pepino") {
    fill(34, 139, 34);
    ellipse(ponto.x, ponto.y, 40, 15);
    fill(0, 100, 0);
    rect(ponto.x - 5, ponto.y - 20, 10, 20, 5);
  } else if (p.nome === "Tomate") {
    fill(34, 139, 34);
    rect(ponto.x - 5, ponto.y - 20, 10, 20);
    fill(255, 0, 0);
    ellipse(ponto.x - 8, ponto.y - 25, 10, 10);
    ellipse(ponto.x + 8, ponto.y - 25, 10, 10);
  }
}

function desenharCidade() {
  fill(200);
  rect(0, 400, width, 200);

  for (let i = 0; i < 5; i++) {
    fill(169, 169, 169);
    rect(150 + i * 150, 150, 100, 250);
    fill(255);
    for (let j = 0; j < 5; j++) {
      rect(160 + i * 150, 160 + j * 40, 20, 20);
      rect(190 + i * 150, 160 + j * 40, 20, 20);
    }
  }

  fill(50);
  rect(0, 500, width, 100);

  stroke(255);
  strokeWeight(4);
  line(0, 550, width, 550);
  noStroke();

  fill(200, 0, 0);
  rect(500, 400, 200, 100);
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text("Tenda", 600, 420);

  filaPessoas.forEach((p, i) => {
    fill(255, 228, 181);
    ellipse(800 + i * 50, 470, 30, 30);
    fill(0, 0, 255);
    rect(785 + i * 50, 485, 30, 40);
    fill(0);
    textAlign(CENTER);
    textSize(12);
    text(p.pedido.substring(0, 2), 800 + i * 50, 540);
  });

  desenharCarro(100, 450);

  fill(0);
  textAlign(CENTER);
  textSize(18);
  text("Clique no cliente para vender | Clique no carro para voltar para o campo", width / 2, 50);
}

function desenharCarro(x, y) {
  fill(0, 0, 255);
  rect(x, y, 120, 50);
  fill(139, 69, 19);
  rect(x + 10, y - 30, 100, 30);
  fill(0);
  ellipse(x + 20, y + 50, 20, 20);
  ellipse(x + 100, y + 50, 20, 20);

  plantas.forEach((p, i) => {
    fill(p.cor);
    ellipse(x + 20 + i * 15, y - 15, 10, 10);
  });
}

function mousePressed() {
  if (perdeu) return;

  if (tela === "CAMPO") {
    gridPlantas.forEach(linha => {
      linha.forEach(ponto => {
        if (dist(mouseX, mouseY, ponto.x, ponto.y) < 30) {
          ponto.planta.quantidade += ponto.planta.incremento;
        }
      });
    });

    if (mouseX > carro.x && mouseX < carro.x + carro.largura &&
      mouseY > carro.y && mouseY < carro.y + carro.altura) {
      tela = "CIDADE";
    }
  } else if (tela === "CIDADE") {
    filaPessoas.forEach((p, index) => {
      let px = 800 + index * 50;
      let py = 470;
      if (dist(mouseX, mouseY, px, py) < 20) {
        let planta = plantas.find(pl => pl.nome === p.pedido);
        if (planta && planta.quantidade > 0) {
          planta.quantidade--;
          dinheiro += planta.preco;
          filaPessoas.splice(index, 1);
          gerarUmaPessoa();
        }
      }
    });

    if (mouseX > 100 && mouseX < 100 + carro.largura &&
      mouseY > 450 && mouseY < 450 + carro.altura) {
      tela = "CAMPO";
    }
  }

  if (botaoMelhoriaVisivel &&
    mouseX > 800 && mouseX < 950 && mouseY > 20 && mouseY < 70 && dinheiro >= 100) {
    dinheiro -= 100;
    plantas.forEach(p => {
      p.incremento = 3;
    });
    carroMelhorado = true;
    botaoMelhoriaVisivel = false;
  }
}

function desenharDinheiro() {
  fill(255);
  rect(20, 20, 150, 50);
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text(`Dinheiro: R$ ${dinheiro}`, 30, 50);

  if (botaoMelhoriaVisivel) {
    fill(0, 200, 0);
    rect(800, 20, 150, 50);
    fill(0);
    textAlign(CENTER);
    textSize(14);
    text("Upgrade R$ 100", 875, 50);
  }
}

function desenharContadorTempo() {
  let tempoDecorrido = millis() - tempoInicio;
  let tempoRestante = max(0, duracaoDia - tempoDecorrido);
  let segundos = floor(tempoRestante / 1000);

  fill(255);
  rect(400, 20, 200, 50);
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text(`Tempo restante: ${segundos}s`, 500, 50);
}

function gerarFila() {
  filaPessoas = [];
  for (let i = 0; i < 5; i++) {
    gerarUmaPessoa();
  }
}

function gerarUmaPessoa() {
  let sorteio = random(plantas);
  filaPessoas.push({ pedido: sorteio.nome });
}

function checarVitoria() {
  if (dinheiro >= dinheiroParaVencer) {
    noLoop();
    fill(0, 200, 0);
    rect(width / 2 - 200, height / 2 - 100, 400, 200);
    fill(255);
    textAlign(CENTER);
    textSize(24);
    text("Parabéns! Você venceu o jogo!", width / 2, height / 2);
  }
}

function mostrarTelaPerdeu() {
  fill(200, 0, 0);
  rect(width / 2 - 200, height / 2 - 100, 400, 200);
  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("Você perdeu! Tente novamente mais rápido!", width / 2, height / 2);
}