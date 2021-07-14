const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const electron = require("electron");
const expect = chai.expect;

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var appPath = path.join(__dirname, '..');

var app = new Application({
  path: electron,
  args: [path.join(__dirname, "..", "src", "index.js")],
  chromeDriverArgs: ["--disable-extensions"],
});

// global.before(function () {
//     chai.should();
//     chai.use(chaiAsPromised);
// });

describe('Test Example', function () {
  beforeEach(function () {
      return app.start();
      done();
  });

  afterEach(async function () {
    if (app && app.isRunning()) {
        await app.stop();
    }
  });

  it("shows an initial window", async () => {
    const windowCount = await app.client.getWindowCount();
    console.log(windowCount)
    expect(windowCount).to.equal(1);
  });

  // it("should have correct text", async () => {
  //   const h1Text = await app.client.getText("h1");

  //   expect(h1Text).toEqual("💖 Hello World!");
  // });
});