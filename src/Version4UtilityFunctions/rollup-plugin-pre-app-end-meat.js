// const template = require('lodash.template')
const fs = require('fs');
const path = require('path');

export default class BannerPlugin {
  // export default function BannerPlugin {
  constructor(options = {}) {
    this._options = options;
    this._cwd = options.cwd || process.cwd();
    this._pkg = require(path.join(this._cwd, 'package.json'));
  }
  prependBanner(code) {
    let content = '';
    let res = code;
    if (typeof this._options === 'string') {
      content = this._options;
    } else {
      const {prependFile, encoding} = this._options;
      if (!prependFile) return code;
      const filePath = path.resolve(prependFile);
      const exits = fs.existsSync(filePath);
      if (exits) {
        content = fs.readFileSync(filePath, encoding || 'utf-8');
      }
    }

    // fix content
    if (content) {
      // const tmpl = template(content)
      res = content + code;
    }
    return res;
  }
  appendBanner(code) {
    let content = '';
    let res = code;
    if (typeof this._options === 'string') {
      content = this._options;
    } else {
      const {appendFile, encoding} = this._options;
      if (!appendFile) return code;
      const filePath = path.resolve(appendFile);
      const exits = fs.existsSync(filePath);
      if (exits) {
        content = fs.readFileSync(filePath, encoding || 'utf-8');
      }
    }

    // fix content
    if (content) {
      res = code + content;
    }
    return res;
  }
}
