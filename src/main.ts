import Benchmark from "tinybench";
import * as PIXI from "pixi.js";
import img from "./union.png";

const suite = new Benchmark.Suite();
const app = new PIXI.Application({autoStart: false})
document.body.appendChild(app.view)

const AMOUNT = 1_000;
const SIZE = 200;

const createButton = (buttonColor: number, iconColor: number, alpha: number) => {
  const graphics = new PIXI.Graphics();
  graphics.beginFill(buttonColor);
  graphics.drawRoundedRect(0, 0, SIZE, SIZE / 3, 20);
  graphics.position.x = app.view.width * Math.random();
  graphics.position.y = app.view.height * Math.random();
  // graphics.alpha = alpha;

  const icon = new PIXI.Sprite();
  const texture = PIXI.Texture.from(img);
  icon.width = SIZE / 5;
  icon.height = SIZE / 5;
  icon.y = SIZE / 4 - SIZE / 5;
  icon.x = 5;
  icon.texture = texture;
  icon.tint = iconColor;
  icon.alpha = alpha;

  const text = new PIXI.Text("Some Text", {fontSize: SIZE / 7});
  text.x = SIZE / 4;
  text.y = SIZE / 4 - SIZE / 6;
  text.alpha = alpha;

  graphics.addChild(text);
  graphics.addChild(icon);

  return graphics;
}

// иконки с тинтом и прозрачностью + текст с прозрачности bitmap

const containerAlpha05 = new PIXI.Container();
Array(AMOUNT).fill(0).forEach(() => {
  containerAlpha05.addChild(createButton(0x898e9a, 0xffff00, 0.5));
})
const containerAlpha1 = new PIXI.Container();
Array(AMOUNT).fill(0).forEach(() => {
  containerAlpha1.addChild(createButton(0x898e9a, 0x00ff00, 1));
})

suite
  .add("case 1: alpha === 0.5", function () {
    app.stage.removeChild(containerAlpha1);
    app.stage.addChild(containerAlpha05);
    app.render();
  })
  .add("case 2: alpha === 1", function () {
    app.stage.removeChild(containerAlpha05);
    app.stage.addChild(containerAlpha1);
    app.render();
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
